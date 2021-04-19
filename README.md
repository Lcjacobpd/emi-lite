# Dungeon Manager

Providing DMs with interfaces for prefabricating, loading and running
encounters. Tracking order of actions by initiative, status of each
involved creature and their ability scores.

To use simply open the index file in the ```html/``` directory.

<br/>

## Getting Started
Setting up an encounter is fairly straightforward; first double check that
the monsters involved can be found in the monsterbook table (Tab 5). Add
any other monsters you need before continuing to encounter creation. When
making a new encounter (Tab 3), enter a recognisable name and descriptive
notes before selecting which monsters are in the encounter from the tagbox.

<br/>

> ### Note: <br/>
> Each tagbox selection is a distinct monster entity. Multiple instances of
> a monster can appear in an encounter. Ex: If you select "Zombie" seven
> times there will be seven Zombies in your encounter.

<br/>

## Save to File
Once you're happy with your encounter, save it. You'll then find that it has
been added to the Encounter List (Tab 6). You can also click on the popup
that is displayed on a succesful save to be directed to the table. To ensure
that your encounter will be visible for later use or after page refresh,
select the "Save All" option on the encounter page. This will open up a
dialogue popup to save a file. Find the appropriate file to overwrite in
```html/vars/```. This feature is available for the Players List (Tab 4) and 
Monster Book (Tab 5) as well.

<br/>

## Entering an Encounter
Now that you've setup an encounter you may have noticed that Tabs 7 and 8
appear to be blank. This is because you need to pick an Encounter from the
table (Tab 6) and use the D20 icon. This will populate and redirect you to
Roll Initiative (Tab 7). Here you can enter the rolls of each player and
monster involved before proceeding to fight using the button at the bottom.

<br/>

## Running and Encounter
Once everyone has been assigned an initiative value, the list of combatants
is sorted in descending order. Each turn a player or monster will be
highlighted green as the active combatant at that time. However, the current
combatant has no effect on what action can be performed; regardless of who's
turn it is the health and status of any creature can be modified arbitrarily.

Each "turn" is ended when the Next button is pressed. Combatants with the
"dead" status are skipped when pressing Next. The health bar at the
bottom of the list of combatants shows the health pool of all the monsters
involved.

<br/>

> ### Note: <br/>
> There is no checks in place to detect the end of an encounter. When done,
> simply return to the Encounters List (Tab 6) or some other tab. Should you
> want to reuse an encounter, selecting to roll initiative will reset all
> combatant stats.

<br/>

## Outside Encounters
Presently, each players health resets at the start of every encounter. As
your players level up it would be wise to edit and update each one, saving
the changes to file with the "Save All" button. 

<br/>

-------------------------------------------------------------------------------

## TODO:
### Planned Functionality:
* Ability to add monster during an encounter

### Known Bugs:
* Editing a Player or Monster without saving deletes them
* Pressing Tabs 7 or 8 while already on those pages will empty them


-------------------------------------------------------------------------------
<br/>