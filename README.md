<img src="img/logo.svg" alt="logo" style="width: 200px;">

## Encounter Management Interface
EMI is an encounter management interface I designed for the purpose
of providing DMs with tools for creating, saving and running
encounters. Tracking order of actions by initiative, status of each
involved creature and their ability scores.

To use EMI, simply open in your browser of choice.

<br/>

## Getting Started
Setting up an encounter is fairly straightforward; first double 
check that the monsters you're going to use can be found in the
Monster Book table. If you needed to add new monsters to the book,
be sure to save over the existing ```js/vars/monsterbook.js``` with
the "Save All" button.

> Note: <br/>
> Overwriting the Monster book keeps your monsters safe from page
> refresh and must be done for your latest additions to appear in
> the tagbox when creating an encounter. You'll find similar
> functionality for both the Players and Encounters tables as well.
> Remember to save your changes regularly to preserve them for
> future use.

Continuing to encounter creation, enter a recognisable name,
descriptive notes and select some monsters monsters from the tagbox.
Each tagbox selection is a distinct monster entity. Multiple
instances of a monster can appear in an encounter. For example, if
you select "Zombie" seven times there will be seven Zombies in your
encounter.

<br/>

## Running an Encounter
Before jumping into an encounter from your list, make sure that your
players are all accounted for. Once that is settled, use the d20 icon
on a specific encounter to roll for initiative. Here you'll enter the
rolls of each player and monster before proceeding to fight.

Once everyone has been assigned an initiative value, the list of
combatants is sorted in descending order. Each turn a player or
monster will be highlighted green as the active combatant at that
time. From this point, the health and status of any creature can be
modified arbitrarily.

* Each turn is ended when the "Next" button is pressed.
* Combatants marked as "dead" will be skipped.
* The health bar at the bottom shows the health pool of all monsters
  present as a progress indicator.
* When done, simply return to the encounters list or some other tab.

<br/>

## Outside Encounters
Presently, each players health resets at the start of every encounter. As
your players level up it would be wise to edit and update each one, saving
the changes to file with the "Save All" button. 

<br/>
<br/>

-----

> ## TODO
> * Additional Functionality
>     * Awaiting feedback
> 
> * Known Bugs
>     * Editing a Player or Monster without saving deletes them
