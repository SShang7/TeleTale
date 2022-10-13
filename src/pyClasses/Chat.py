from Line import Line

class Chat:
    def __init__(self):
        self._dialog = []

    def update_chat(self, line):
        self._dialog.append(line)

    def get_chat(self):
        return self._dialog

    def clear_chat(self):
        self._dialog.clear
