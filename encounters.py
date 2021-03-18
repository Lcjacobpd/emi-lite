import re
import os
import csv

import utilities

from os import path
from creatures import conditions
from creatures import Creature
from creatures import Monster
from creatures import Player
from maps import Map

class Encounter:
    '''
    Collections of monsters that players enter
    '''
    def __init__(self, name, monsters=[]):
        self.name = name
        self.monsters = monsters
        self.players = []
        self.friends = []
        self.everyone = []
        self.cursor = 0

        self.map = None

        print(F'Encounter: {self.name}')
        for monster in monsters:
            self.everyone.append(monster)
            monster.display()

    def readfile(self, filename):
        '''
        Interpret local file as encounter
        '''
        self.name = filename[10:]
        self.monsters = []

        # Validate file path/name
        try: path.isfile(filename)
        except: print(F'ERROR: File {filename} not found!')

        with open(filename) as csv_file:
            reader = csv.reader(csv_file)

            next(reader)  # Discard header
            for row in reader:
                self.monsters.append(Monster(
                    char_name=row[0],
                    char_class=row[1],
                    status=row[2],
                    hp=int(row[3]),
                    ac=row[4],
                    mods=row[5:11],
                    dice=row[11].split(' '),
                    res=row[12].split(' ')
                ))


    def enter(self, players, friends=[]):
        '''
        Collect & display Players and NPCs to start the encounter
        '''
        # Try to load optional map file
        if path.isfile('templates/' + self.name[:-4] + '.png'):
            self.map = Map.readfile('templates/' + self.name[:-4] + '.png')

        self.players = players
        self.friends = friends
        self.everyone = []

        print('Entering encounter...')
        for player in players:
            self.everyone.append(player)
            player.display()

        for friend in friends:
            self.everyone.append(friend)
            friend.display()

        for monster in self.monsters:
            self.everyone.append(monster)
            monster.display()

        print('---')

    def sort(self):
        '''
        Take initiatives & organize encounter combatants
        '''
        print('Roll initiative!')
        paired_order = []
        rolls = []
        for creature in self.everyone:
            while True:
                initiative = input(F'{creature.char_name}: ')
                try:
                    initiative = int(initiative)
                    if initiative in rolls:
                        print('No duplicates!')
                        continue

                    # Roll is a valid entry
                    rolls.append(initiative)
                    break
                except:
                    print('Initiative must be integer!')

            paired_order.append((int(initiative), creature))
        paired_order.sort(reverse=True)

        order = []
        for pair in paired_order:
            order.append(pair[1])
        self.everyone = order

        print('---')

    def display(self):
        utilities.clear()

        # Show map if applicable
        if self.map != None:
            self.map.display()

        # Display combatants, highlight active entity
        for position, creature in enumerate(self.everyone):
            if position == self.cursor:
                utilities.yellow()
                print('>>> ', end='')
            else: print('    ', end='')
            creature.display()

    def next(self, repeat=False):
        '''
        Update active combatant cursor
        '''
        if repeat != True:
            self.cursor += 1

        # Reset cursor position
        if self.cursor >= len(self.everyone):
            self.cursor = 0

        # Skip dead Creatures
        while self.everyone[self.cursor].status == conditions.index('dead'):
            self.cursor += 1
            if self.cursor >= len(self.everyone):
                self.cursor = 0

        # Check for end of encounter conditions
        no_monsters = True
        for monster in self.monsters:
            if monster.status != conditions.index('dead'):
                no_monsters = False

        no_players = True
        for player in self.players:
            if player.status != conditions.index('dead'):
                no_players = False

        self.display()  # display current iteration

        if no_players or no_monsters:
            return True  # isOver -> True

        return False  # isOver -> False
