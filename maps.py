from PIL import Image

class Map:
    '''
    Visual representation of of an encounter environment
    '''
    def __init__(self):
        self.width = 0
        self.height = 0
        self.pixels = None

    @staticmethod
    def readfile(filename: str):
        '''
        Import map from image file
        '''
        mappy = Map()

        image = Image.open(filename, 'r')
        mappy.pixels =image.load()
        mappy.width = image.size[0]
        mappy.height = image.size[1]

        return mappy

    def display(self):
        '''
        Convert RGB image values to printed background colors
        '''
        for y in range(self.height):
            for x in range(self.width):
                red = self.pixels[x,y][0]
                green = self.pixels[x,y][1]
                blue = self.pixels[x,y][2]

                print(F'\u001b[48;2;{red};{green};{blue}m  ', end='\u001b[0m')
            print()