from Lobby import Lobby

class waitingRoom(Lobby):
    def kick_player (self, player):
        self._players.remove(player)

    def generate_link (self):
        return None

    def add_player (self, player):
        self._players.append(player)
