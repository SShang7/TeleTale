class Line:
    def __init__(self, content, author, time):
        self.content = content
        self.author = author
        self.time = time

    def check_violation(self):
        return False