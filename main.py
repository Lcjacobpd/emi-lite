
import utilities
from creatures import conditions
from creatures import Creature
from creatures import Monster
from creatures import Player
from encounters import Encounter
from campaigns import Campaign


options = [
    '1. Import campaign',
    '2. Add player',
    '3. List encounters',
    '4. Long rest',
    '5. Import players',
    '6. Export players',
    'exit'
]

campaign = Campaign()
cmd = ''

while cmd != 'exit':
    utilities.title()
    print(F'Campaign: {campaign.name}')
    campaign.list_players()

    for option in options:
        print(option)
    print('---')
    cmd = input()

    if cmd == '1':  # Import Campaign
        in_file = input('\tSelect File: ')
        print()
        campaign = Campaign.readfile('templates/' + in_file)
        input('Press enter to continue...')

    if cmd == '2':  # Add Player
        campaign.add_player()

    if cmd == '3':  # List Encounters
        campaign.list_encounters()
        print('\t..\n\t---')
        cmd = input('\t')

        utilities.clear()

        while cmd != '..':
            cmd = int(cmd)
            if cmd < len(campaign.encounters):
                campaign.encounters[cmd].enter(campaign.players)
                campaign.loop_encounter(campaign.encounters[cmd])
                input('Press enter to continue...')
                break
            else:
                print('Invalid selection!')
        utilities.clear()
        continue

    if cmd == '4':  # Long Rest
        campaign.long_rest()
        print('Taking a long rest...')
        input('Press enter to continue...')

    if cmd == '5':  # Import players
        campaign.import_players()
        input('Press enter to continue...')

    if cmd == '6':  # Export players
        if len(campaign.players) == 0:
            print('No players to export!')
            input('Press enter to continue...')
            utilities.clear()
            continue

        campaign.export_players()
        input('Press enter to continue...')


    if 'P' in cmd:
        try:
            pnum = int(cmd.split('P')[1]) - 1
        except:
            utilities.clear()
            continue

        if pnum < len(campaign.players):
            pl_options = [
                '\t1. Health',
                '\t2. Remove',
                '\t3. Status',
                '\t4. Level up',
                '\t..',
                '\t---'
            ]
            player = campaign.players[pnum]
            print(F'\n\tModifying: {player.irl_name} | {player.char_name}')
            for option in pl_options:
                print(option)
            cmd = input('\t')

            try:
                if cmd == '1':
                    amount = int(input('\n\tAmount: '))
                    print()
                    if amount < 0:
                        campaign.players[pnum].damage(abs(amount))
                    else:
                        campaign.players[pnum].heal(amount)
                if cmd == '2':
                    campaign.players.remove(player)

                if cmd == '3':
                    print()
                    for i, state in enumerate(conditions):
                        print(F'\t{i}. {state}')

                    stat = int(input('\t---\n\t'))
                    if stat < len(conditions):
                        campaign.players[pnum].status = stat

                if cmd == '4':
                    hp = int(input('\n\tNew max health: '))
                    campaign.players[pnum].max_HP = hp
                    campaign.players[pnum].cur_HP = hp

                input('Press enter to continue...')

            except:
                print('Error: Invalid syntax; no effect!')
                input('Press enter to continue')
                utilities.clear()


    utilities.clear()

