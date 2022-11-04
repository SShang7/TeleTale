from django.db import models

from channels.db import database_sync_to_async

from profiles.models import Profile


class Game(models.Model):
    class GameStatus(models.TextChoices):
        CREATED = 'Created', ('Created')
        IN_PROGRESS = 'In Progress', ('In Progress')
        FINISHED = 'Finished', ('Finished')

    game_id = models.CharField(max_length=50, primary_key=True)
    owner = models.OneToOneField(Profile, null=True, on_delete=models.SET_NULL)
    time_created = models.DateTimeField(auto_now=True)
    game_status = models.TextField(
        choices=GameStatus.choices, default=GameStatus.CREATED)

    num_rounds = models.PositiveSmallIntegerField(default=4)
    current_round = models.PositiveSmallIntegerField(default=1)
    current_turn = models.PositiveSmallIntegerField(default=1)
    timer = models.PositiveSmallIntegerField(default=30)
    prompt = models.TextField(
        default="Write about anything you want to start your story!")

    @database_sync_to_async
    def as_json(self):
        current_player = None if self.game_status != self.GameStatus.IN_PROGRESS else (
            GamePlayer
            .objects
            .filter(game=self, is_current=True)[0]
            .profile.as_json())

        return {
            'id': self.game_id,
            'gameStatus': self.game_status,
            'owner': self.owner.as_json() if self.owner else None,
            'currentPlayer': current_player,
            'allPlayers': [p.profile.as_json() for p in GamePlayer.objects.filter(game=self)],
            'numRounds': self.num_rounds,
            'currentRound': self.current_round,
            'currentTurn': self.current_turn,
            'timer': self.timer,
            'prompt': self.prompt,
        }


class GamePlayer(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    next_player = models.ManyToManyField('self')
    is_current = models.BooleanField(default=False)
    is_first = models.BooleanField(default=False)


class GamePhrase(models.Model):
    author = models.ForeignKey(GamePlayer, on_delete=models.CASCADE)
    round_number = models.PositiveSmallIntegerField()
    turn_number = models.PositiveSmallIntegerField()
    phrase = models.TextField()
    image = models.ImageField()
