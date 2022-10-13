from Line import Line

class Phrase:
    def __init__(self, line):
        self._content = line
        self._images = []
        self._image_generation_status = False
        self._chosen_image = None

    def get_line(self):
        return self._content

    def generate_images(self):
        return False

    def has_chosen_image(self):
        return False

    def get_images(self):
        return self._images

    def get_chosen_image(self):
        if (self._chosen_image == None):
            return None
        else:
            return self._chosen_image

    def choose_image(self, index):
        if (index > 0 and index < 4):
            self._chosen_image = self._images[index]
            return True
        else:
            return False