# DM_Helper

Assits dungeon masters in managing a campaign as a series of encounters,
tracking order of actions by initiative, status of each involved creature and
their ability modifiers.

Startup the helper with:
```bash
python main.py
```

<br/>

## Getting Started
Setting up a campaign is fairly straightforward; first create some encounters.
There's an example encounter you can reference in skeleton_encounter.txt. Once
you've made a few encounter files, create a campaign file; the first line of
which is discarded as a header. Every subsequent line is interpreted as the
file names of the encounters you made. Be sure to end your campaign file
with an empty newline.

<br/>

> ### Optional Note: <br/>
> You can include a map for each encounter by creating png files sharing the
> name of the encounter txt file. (ie: skeleton_encounter.txt &
> skeleton_encounter.png) If present, the map will display at the start of
> each turn in the associated encounter. Fair warning, if you make your
> reference images too large they may not display properly.

<br/>

After your campaign is imported successfully, it's time to setup your player's
characters. For each member of your party, we'll use the "Add player" option,
entering their real & character's name, class, max health and speed. You can
backup your list of players with "Export players". In the event that our app
crashes, or you're resuming a previous campaign, you can quickly recover
your player information with "Import players".

<br/>

## Entering an Encounter
Now that you've established your campaign and players you can view the
encounters you've prepared with "List encounters". Once your players have
entered an encounter, select it by number and begin rolling initiatives.
Initiaves naturally cannot be a non integer value. Our system additionally
requires that none of the initiatives are duplicates. You'll find measures in
place to ensure validation should you accidently break either of those rules.

<br/>

Once everyone has been assigned an initiative value, the list of combatants is
sorted in descending order. Each turn a player or NPC will be highlighted as
the active character at that time. However, the current combatant has no
effect on what action can be performed; regardless of who's turn it is,
actions take the following format:
```
target operator amount effect
```

Where target is the character name of the creature to be affected, operator is
either + or - (ie: Heal or Damage) and amount is the numerical value to be
applied. Effect is an optional parameter, should the target creature be given
a status effect (ex: poisoned) this is how it would be applied. Should effect
not be specified, the "normal" condition will be assumed.

<br/>

If several creatures are effected in a single turn, actions can be chained
together with a comma like so:
```
target operator amount effect, target operator effect
```

Where each action can be applied to a distict target with unique optional
effects. (NOTE: the space after each comma is important)

<br/>

Encounters end when either all the players or all the monsters are dead. It's
important to note that players behave somewhat differently in this regard.
While a monster's status is set to "dead" when it reaches zero health, players
are marked as "unconcious" by default. If a player is killed, that must be
expressly defined:
```
bob - 15 dead
```

<br/>

## Outside Encounters
There are some notible actions that can occur outside an encounter as well.
Let's say one of your players attempts to scale a fence and fails their
acrobatics check, resulting in them taking 2 points of damage. Note the list
of players you have near the top of your display on the main menu. Using the
P# (Written with a capital 'P') of any player will bring up a few options for
changing the health, status as well as removing a player. In the example
above, dealing damage to the clumsy player would proceed as follows:
```
P2

	Modifying: Fred | Mike
	1. Health
	2. Remove
	3. Status
    4. Level up
	..
	---
	1

	Amount: -2

Mike took 2 points of damage (8/10)
Press enter to continue...
```

<br/>

-------------------------------------------------------------------------------
<br/>

## TODO:
### Planned Functionality:
* Cancel entering and encounter
* Add Creature/Monster during an encounter
    * import from file & terminal entry

### Known Bugs:
* They exist, I'm sure

-------------------------------------------------------------------------------
<br/>

## Completed:
* Import & export players from file
    * Do not export if no players are present
    * support longer campaigns

* Heal & damage Players outside encounter
    * separate from long rest
    * can also be used to remove players
    * change status of player
    * level up (increase the max health)

* Handle duplicate initiative when entering encounter
* Safely error on non-integer initiative entry
* Display Monster ability modifiers amid encounter

* Mapping support
    * import map from file
    * display map

-------------------------------------------------------------------------------
<br/>