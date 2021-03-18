import os
import re

from os import path
from encounters import Encounter
from creatures import conditions
from creatures import Creature
from creatures import Monster
from creatures import Player


class Campaign:
    '''
    Collection of encounters & player list
    '''
    def __init__(self):
        self.encounters = []
        self.players = []
        self.name = '<none>'

    @staticmethod
    def readfile(filename):
        '''
        Interpret local file as campaign
        '''
        campaign = Campaign()

        # Validate file path/name
        if not '.txt' in filename:
            filename += '.txt'

        if path.isfile(filename) == False:
            print(F'ERROR: File {filename} not found!')
            print('---')
            return campaign

        print('Importing campaign from file...')
        campaign.name = filename[10:]

        # Read from template campaign file
        with open(filename, 'r') as prefab:
            prefab.readline()  # Discard header
            lines = prefab.readlines()

            # Collect & initialize enounters from each line
            encounters = [Encounter(line[:-1]) for line in lines]

            # Populate each encounter from file
            for num, enc in enumerate(encounters):
                enc.readfile('templates/' + lines[num][:-1])
            campaign.encounters = encounters

        return campaign

    def add_player(self):
        '''
        Create a new character in the terminal
        '''
        irl_name = input('\tIRL name: ')
        char_name = input('\tCharacter name: ')
        char_class = input('\tClass: ')
        char_hp = input('\tHP: ')

        print('\t---')

        self.players.append(
            Player(
                irl_name=irl_name,
                char_name=char_name,
                char_class=char_class,
                hp=int(char_hp)
            ))

    def export_players(self):
        '''
        Write current player list to file
        '''
        print('\nWriting to file:')
        with open('players.txt', 'w') as out_file:
            for player in self.players:
                details = player.display(export=True)
                out_file.write(details + '\n')

    def import_players(self):
        '''
        Read previous player list from file
        '''
        print('\nImporting players from file...')
        self.players = []  # replace existing with import

        with open('players.txt', 'r') as in_file:
            lines = in_file.readlines()
            for line in lines:
                character = line.split(' ')
                print(F' > {character}')
                self.players.append(
                    Player(
                        irl_name=character[0],
                        char_name=character[1],
                        char_class=character[2],
                        hp=character[3]
                    ))

    def list_players(self):
        '''
        Display player controlled characters
        '''
        if len(self.players) == 0:
            print('Players: <none>\n')
            return

        print('Players:')
        for num, player in enumerate(self.players):
            print(F'P{num + 1} ', end='')
            player.display()
        print()

    def list_encounters(self):
        '''
        Display campaign encounters
        '''
        for num, battle in enumerate(self.encounters):
            print(F'\t{num}. {battle.name} - {len(battle.monsters)} mobs')

    def apply_action(self, action: list, names: list, targets: list):
        '''
        Interpret battle action
        - heal/damage character by amount
        - change condition (optional)
        '''
        # Check action syntax
        if len(action) < 3:
            print('ERROR: Invalid syntax: no effect!')
            return True  # Repeat, try again

        # Required action parameters
        target = action[0]
        operator = action[1]
        amount = 0
        try:
            amount = int(action[2])
        except:
            print('ERROR: Invalid syntax: no effect!')
            return True  # Repeat, try again

        # Optional action parameter: effect/condition
        effect = -1
        if len(action) == 4:
            effect = action[3]

        # Perform action on target if listed
        if target in names:
            for creature in targets:
                if creature.char_name == target:
                    if operator == '+':
                        creature.heal(amount)
                    else:
                        # Include effect in damage application, if present
                        if effect != -1: creature.damage(amount, effect)
                        else:creature.damage(amount)
                    return False  # Do not repeat turn

        else:  # target is not in list
            print('Error: creature not listed!')
            return True  # repeat turn

    def loop_encounter(self, battle):
        '''
        Iterate through encounter combatants
        '''
        names = []  # Collect combatant names
        for creature in battle.everyone:
            names.append(creature.char_name)

        # Roll for initiative
        battle.sort()
        battle.display()

        isOver = False
        while isOver == False:
            # Reset each iteration
            actions = []
            doRepeat = False
            cmd = input('\tAction: ')
            print()

            # Check for chained actions
            if ',' in cmd:
                actions = cmd.split(', ')
                temp = []

                for action in actions:
                    temp.append(action.split(' '))
                actions = temp

            else:  # Only one action
                actions = [cmd.split(' ')]

            # Process & apply action(s)
            for action in actions:
                doRepeat = self.apply_action(action, names, battle.everyone)
                if doRepeat == True:
                    print('Error: unlisted character; no effect!')

            print()
            isOver = battle.next(repeat=doRepeat)

        print('\nEncounter over!')
        return

    def long_rest(self):
        '''
        Fully heal all living characters & reset condition
        '''
        for player in self.players:
            if player.status != conditions.index('dead'):
                player.cur_HP = player.max_HP
                player.status = conditions.index('normal')
