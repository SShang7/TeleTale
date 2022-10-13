from Chat import Chat
from GameSetting import GameSetting

class Lobby:
    def __init__(self, lobby_ID, game_setting, chat_session, owner):
        self._id = lobby_ID
        self._setting = game_setting
        self._chat = chat_session
        self._owner = owner
        self._players = [owner]

    def get_id (self):
        return self._id

    def get_players (self):
        return self._players

    def get_chat (self):
        return self._chat
