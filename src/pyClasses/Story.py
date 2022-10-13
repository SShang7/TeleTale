from Phrase import Phrase

class Story:
    def __init__(self, topic, name, id):
        self._topic = topic
        self._name = name
        self._id = id
        self._story = []
    
    def get_topic(self):
        return self._topic

    def get_name(self):
        return self._name

    def get_id(self):
        return self._id

    def add_phrase(self, phrase):
        self._story.append(phrase)

    def share(self):
        return None