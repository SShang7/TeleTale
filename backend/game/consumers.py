import logging
import asyncio
import threading
from random import shuffle

from django.core.exceptions import ObjectDoesNotExist

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .illustrator import illustrate

from .models import Game, GamePhrase, GamePlayer
from profiles.models import Profile


def background_thread(loop):
    asyncio.set_event_loop(loop)
    loop.run_forever()


background_event_loop = asyncio.new_event_loop()
background_thread = threading.Thread(
    target=background_thread, args=(background_event_loop,), daemon=True)
background_thread.start()


class MockAIGenerator:
    _logger = logging.getLogger(__name__)

    async def generate(self, game, round_number, turn_number, phrase_content):
        self._logger.debug(f"Generating for phrase: '{phrase_content}'.")

        image_url = illustrate([phrase_content])

        await game.set_phrase_image_url(round_number, turn_number, image_url)

        self._logger.debug(
            f"Done generating for phrase: '{phrase_content}'. Got image url {image_url[:20]}.")


class GameConsumer(AsyncJsonWebsocketConsumer):
    _logger = logging.getLogger(__name__)

    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.user = self.scope['user']

        self._logger.debug(
            f'User {self.user.username} has joined game {self.game_id}')

        # Set game and player objects and accept connection
        if not await self.set_game():
            return
        await self.create_player()
        await self.accept()

        # Join room group
        self.room_group_name = 'game_%s' % self.game_id
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def set_game(self):
        try:
            self.game = Game.objects.get(game_id=self.game_id)
            return True
        except ObjectDoesNotExist:
            self._logger.error(
                f"User tried to join game {self.game_id}, which does not exist.")
            self.game = None
            return False

    @database_sync_to_async
    def create_player(self):
        self.profile = Profile.objects.get(user=self.user)
        self.player, _ = GamePlayer.objects.get_or_create(
            profile=self.profile, game=self.game)

    @database_sync_to_async
    def refresh_player_list(self):
        players = list(self.game.gameplayer_set.all())
        self.all_players = [x.profile.as_json() for x in players]

    @database_sync_to_async
    def refresh_game_state(self):
        self.game = Game.objects.get(game_id=self.game_id)
        self.player = GamePlayer.objects.get(
            game_id=self.game_id, profile=self.profile)

    @database_sync_to_async
    def delete_player(self):
        old_turns = self.game.gameplayer_set.count()
        self.player = GamePlayer.objects.get(id=self.player.id)
        self.player.delete()

        all_players = self.game.gameplayer_set.all()

        if all_players.count() == 0:
            self._logger.debug(
                f'Game {self.game_id} has zero players and will be deleted.')
            self.game.delete()
        else:
            self.game.owner = all_players[0].profile
            if self.game.game_status == Game.GameStatus.IN_PROGRESS:
                # Special case: move game to the next round if this one is the last player
                turn_position = self.player.turn_position
                if self.game.current_turn == turn_position and turn_position == old_turns:
                    self.game.current_turn = 1
                    self.game.current_round += 1
                    if self.game.current_round > self.game.num_rounds:
                        self.game.game_status = Game.GameStatus.FINISHED

                # Decrement the turn position of all players after this one
                players_after = all_players.filter(
                    turn_position__gt=self.player.turn_position)
                for player in players_after:
                    player.turn_position -= 1
                    player.save()
            self.game.save()

    async def set_phrase_image_url(self, round_number, turn_number, image_url):
        if self.game is None or len(self.all_players) == 0:
            self._logger.debug(
                f"Generated image for deleted game {self.game_id}.")
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'command': 'updatePhrase',
                'type': 'websocket_update_phrase',
                'round_number': round_number,
                'turn_number': turn_number,
                'image_url': image_url,
            }
        )

    async def disconnect(self, close_code):
        self._logger.debug(
            f'{self.user.username} disconnected from game {self.game_id}.')

        if self.game is None:
            return

        # Leave the game room
        await self.delete_player()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'websocket_leave',
                'info': f'{await self.get_profile_name()} has left'
            }
        )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        await self.refresh_game_state()
        await self.refresh_player_list()
        command = content.get("command", None)

        if command == 'join':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'info': f'{await self.get_profile_name()} has joined',
                    'type': 'websocket_info',
                }
            )
        if command == 'start':
            if self.game.game_status != Game.GameStatus.CREATED:
                self._logger.error(
                    f'Game {self.game.game_id} tried to start from an invalid state.')
                return

            await self.setup_game()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'type': 'websocket_info',
                }
            )
        if command == 'submit':
            if self.game.game_status != Game.GameStatus.IN_PROGRESS:
                self._logger.error(
                    f'User {self.user.username} tried to submit a phrase to game {self.game.game_id}, which is not in progress.')
                return

            if self.game.current_turn != self.player.turn_position:
                self._logger.error(
                    f'User {self.user.username} tried to submit a phrase to game {self.game.game_id} when it is not their turn.')
                return

            await self.write_phrase(content)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'type': 'websocket_info',
                }
            )
        if command == 'chat':
            # Send message to game room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'type': 'websocket_chat',
                    'message': content.get('message', ''),
                    'sender': self.profile.as_json(),
                }
            )

    @database_sync_to_async
    def get_profile_name(self):
        return self.profile.display_name

    @database_sync_to_async
    def setup_game(self):
        # Shuffle the order of players
        players = list(self.game.gameplayer_set.all())
        shuffle(players)
        for i, player in enumerate(players):
            player.turn_position = i+1
            player.save()
        self.game.game_status = Game.GameStatus.IN_PROGRESS
        self.game.save()

    @database_sync_to_async
    def write_phrase(self, content):
        # Submit phrase for the player's turn
        phrase = content.get('phrase', '')
        phrase_db_object = GamePhrase.objects.create(
            author=self.player.profile,
            game=self.game,
            round_number=self.game.current_round,
            turn_number=self.game.current_turn,
            phrase=phrase,
        )

        # Schedule to mock AI generator to run in the background.
        current_round, current_turn = self.game.current_round, self.game.current_turn
        background_event_loop.call_soon_threadsafe(
            lambda: asyncio.get_event_loop().create_task(MockAIGenerator().generate(self, current_round, current_turn, phrase)))

        # Update the turn and round
        turns = len(self.all_players)

        # This line increments the turn by one, modulo the number of turns (1-indexed)
        next_turn = (((current_turn - 1) + 1) % turns) + 1

        self.game.current_turn = next_turn
        if next_turn == 1:
            self.game.current_round += 1
            if self.game.current_round > self.game.num_rounds:
                self.game.game_status = Game.GameStatus.FINISHED
        self.game.prompt = phrase
        self.game.save()

    async def websocket_join(self, event):
        await self.refresh_player_list()
        await self.send_json(({
            'command': event['command'],
            'info': event['info'],
            'players': self.all_players,
        }))

    async def websocket_info(self, event):
        await self.refresh_game_state()
        await self.send_json(({
            'command': event['command'],
            'gameState': await self.game.as_json(),
        }))

    async def websocket_chat(self, event):
        await self.send_json(({
            'command': event['command'],
            'sender': event['sender'],
            'message': event['message'],
        }))

    async def websocket_update_phrase(self, event):
        await self.send_json(({
            'command': event['command'],
            'roundNumber': event['round_number'],
            'turnNumber': event['turn_number'],
            'imageUrl': event['image_url'],
        }))

    async def websocket_leave(self, event):
        await self.refresh_game_state()
        await self.refresh_player_list()
        await self.send_json(({
            'command': 'leave',
            'info': event['info'],
            'gameState': await self.game.as_json(),
        }))
