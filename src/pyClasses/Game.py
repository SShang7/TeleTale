from Lobby import Lobby
from Story import Story

class Game:
    def __init__(self, *args, **kwargs):
        Lobby(self, *args)
        self._history = []
        self._current_story = None

    def pause(self):
        pass

    def restart(self):
        pass

    def vote_to_kick(self):
        pass