from random import shuffle

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Game, GamePhrase, GamePlayer
from profiles.models import Profile

class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.user = self.scope['user']

        # Create game and player objects and accept connection
        await self.create_game()
        await self.create_player()
        await self.accept()

        # Join room group
        self.room_group_name = 'game_%s' % self.game_id
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def create_game(self):
        self.game, _ = Game.objects.get_or_create(game_id=self.game_id)

    @database_sync_to_async
    def create_player(self):
        profile = Profile.objects.get(user=self.user)
        self.player, _ = GamePlayer.objects.get_or_create(profile=profile, game=self.game)

    @database_sync_to_async
    def set_players(self):
        players = list(self.game.gameplayer_set.all())
        self.all_players = [x.profile.as_json() for x in players]

    @database_sync_to_async
    def delete_player(self):
        # TODO: need to reset deque
        self.player.delete()
        player_count = self.game.gameplayer_set.all().count()
        if player_count == 0:
            self.game.delete()

    async def disconnect(self, close_code):
        # Leave the game room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'websocket_leave',
                'info': f'{self.player.profile.display_name} has left'
            }
        )

        await self.delete_player()

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        command = content.get("command", None)

        if command == 'join' and self.game.game_status == Game.GameStatus.CREATED:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'info': f'{await self.get_profile_name()} has joined',
                    'type': 'websocket_info',
                }
            )
        if command == 'start':
            # TODO
            await self.setup_game()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'command': command,
                    'type': 'websocket_info',
                }
            )
        if command == 'submit':
            # TODO
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
                    'user': content.get('user', None),
                }
            )

    @database_sync_to_async
    def get_profile_name(self):
        return self.player.profile.display_name

    @database_sync_to_async
    def setup_game(self):
        # Shuffle the order of players and create circular queue of players
        players = shuffle(list(self.game.gameplayer_set.all()))
        previous = players[0]
        previous.is_current = True
        previous.is_first = True

        for player in players[1:]:
            previous.next_player = player
        players[-1].next_player = players[0]

        self.game.game_status = Game.GameStatus.IN_PROGRESS

    @database_sync_to_async
    def write_phrase(self, content):
        # Submit phrase for the player's turn
        phrase = content.get('phrase', '')
        GamePhrase.objects.create(
            author=self.player,
            round_number=self.game.current_round,
            turn_number=self.game.current_turn,
            phrase=phrase,
        )

        # Update round information
        self.player.is_current = False
        self.next_player.is_current = True

        if self.next_player.is_first:
            self.game.current_round += 1
            self.game.current_turn = 1
        else:
            self.game.current_turn += 1

    async def websocket_join(self, event):
        await self.set_players()
        await self.send_json(({
            'command': event['command'],
            'info': event['info'],
            'players': self.all_players,
        }))

    async def websocket_info(self, event):
        await self.send_json(({
            'command': event['command'],
            'gameState': await self.game.as_json(),
        }))

    async def websocket_chat(self, event):
        await self.send_json(({
            'command': event['command'],
            'user': event['user'],
            'message': event['message'],
        }))

    async def websocket_leave(self, event):
        await self.set_players()
        await self.send_json(({
            'command': 'leave',
            'info': event['info'],
            'gameState': await self.game.as_json(),
        }))
