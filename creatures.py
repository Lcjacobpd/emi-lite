import utilities

conditions = [
        'normal',
        'blinded',
        'charmed',
        'deafened',
        'frightened',
        'grappled',
        'incapacitated',
        'invisible',
        'paralyzed',
        'petrified',
        'poisoned',
        'prone',
        'restrained',
        'stunned',
        'unconscious',
        'exhaustion',
        'dead'
    ]


class Creature:
    '''
    Any living entity
    - generic NPC
    '''
    def __init__(self, name: str, HP: int, status='normal', ac=10, modifiers=[0, 0, 0, 0, 0, 0], dice=[], res=[]):
        self.char_name = name
        self.cur_HP = HP
        self.max_HP = HP
        self.initiative = 0
        self.status = conditions.index(status)

        self.AC = ac
        self.modifiers = modifiers
        self.dice = dice
        self.resistence = res

    def damage(self, ammount: int, status='normal'):
        '''
        Subtract from current health
        '''
        self.cur_HP -= ammount
        self.status = conditions.index(status)

        # Check for KO
        if self.cur_HP <= 0:
            self.cur_HP = 0

            # Mark monsters as dead rather than unconcious
            if type(self) == Monster or status == 'dead':
                self.status = conditions.index('dead')
                print(F'{self.char_name} died!')
                input('Press enter to continue...')
            else:
                self.status = conditions.index('unconscious')
                print(F'{self.char_name} is unconcious!')

        # Not KO'd, update and display status
        else:
            print(F'{self.char_name} took {ammount} points of damage ({self.cur_HP}/{self.max_HP})', end='')
            if self.status != 0:  # Show condition if changed
                print(F' and is now {conditions[self.status]}')
            else: print()

    def heal(self, ammount, effect='normal'):
        '''
        Add to current health
        '''
        self.cur_HP += ammount

        # Check for overflow
        if self.cur_HP >= self.max_HP:
            self.cur_HP = self.max_HP
            print(F'{self.char_name} is now max HP')

        # Update condition if previously unconcious
        if self.status == conditions.index('unconscious'):
            self.status = conditions.index(effect)
            print(F'{self.char_name} was revived!')

    def display(self):
        # Display Character Name, HP/Total and Status
        if self.status == conditions.index('dead'):
            utilities.gray()

        print(F'NPC | {self.char_name} ({self.cur_HP}/{self.max_HP}) {conditions[self.status]}')
        utilities.white()


class Player(Creature):
    '''
    Inherits from Creature
    - Player controlled character
    '''
    def __init__(self, irl_name: str, char_name: str, char_class: str, hp: int):
        # Additional properties
        self.irl_name = irl_name
        self.char_class = char_class

        # Use parent class initalization
        Creature.__init__(self, char_name, int(hp))

    def display(self, export=False):
        # Overwrite Creature display, include IRL name
        if self.status == conditions.index('dead'):
            utilities.gray()

        details = F'{self.irl_name} | {self.char_name}: {self.char_class} ({self.cur_HP}/{self.max_HP}) {conditions[self.status]}'
        print(details)
        utilities.white()

        # special case for exporting to file
        if export == True:
            details = F'{self.irl_name} {self.char_name} {self.char_class} {self.max_HP} {self.status}'

        return details


class Monster(Creature):
    '''
    Inherits from Creature
    - Any hostile entity
    '''
    def __init__(self, char_name: str, char_class: str, status: str, hp: int, ac: int, mods: list, dice: list, res: list):
        # Additional properties
        self.char_class = char_class

        # Initialize Parent Class
        Creature.__init__(self, char_name, hp, status, ac, mods, dice, res)

    def display(self):
        # Overwrite Creature display, include modifiers
        if self.status == conditions.index('dead'):
            utilities.gray()

        details = F'NPC | {self.char_name}: {self.char_class} ({self.cur_HP}/{self.max_HP}) {conditions[self.status]} ' + '{' + F'{self.AC}' + '}' + F' {self.modifiers}'
        print(details)
        utilities.white()
