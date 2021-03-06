// Style Constants
var GENERIC_STYLE   = "color: #b9bbbe; border-left: 4px solid #b9bbbe";
var ACTIVE_STYLE    = "color: #43b581; border-left: 8px solid #43b581";
var KO_STYLE        = "border-left: 4px solid #faa61a";
var DEAD_STYLE      = "border-left: 4px solid #f04747";

// Combatant Constants
var Mobs    = [];
var CURRENT = 0;
var MON_HP  = 0;

var Challengers = []; // Appended during fight


/**********************
 * Utility Functions
 *********************/
function slayChildren(parentname) {
    var parent = document.getElementById(parentname);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function status_box(id) {
    return '\
        <select id="st' +id+ '" type="text"> \
            <option value="normal">normal</option> \
            <option value="blinded">blinded</option> \
            <option value="charmed">charmed</option> \
            <option value="dead">dead</option> \
            <option value="deafened">deafened</option> \
            <option value="exhausted">exhausted</option> \
            <option value="frightened">frightened</option> \
            <option value="grappled">grappled</option> \
            <option value="incapacitated">incapacitated</option> \
            <option value="invisible">invisible</option> \
            <option value="paralized">paralized</option> \
            <option value="petrified">petrified</option> \
            <option value="poisoned">poisoned</option> \
            <option value="prone">prone</option> \
            <option value="restrained">restrained</option> \
            <option value="stunned">stunned</option> \
            <option value="unconscious">unconscious</option> \
        </select> \
    ';
}

function addMonFighter(m, offset=0) {
    if (offset == 0) {
        var names = Mobs[m].split(',');
        var mon = getMonster(names[1]);
    }

    else {
        var names = Challengers[m];
        var mon = getMonster(names);
    }

    var num = Number(m) + offset;


    // Setup html elements
    var element = document.createElement("box");
    var left = document.createElement("left");
    var right = document.createElement("right");

    var hp = document.createElement("input");
    var stat = document.createElement("st");
    stat.innerHTML = status_box(num);

    left.innerHTML = "NPC " + mon[0];
    right.innerHTML = "<img src='img/detail.svg' onclick='viewMonster(\"" +mon[0]+ "\")'>";  // Details popup icon
    right.innerHTML += '<p>' + mon[2] + '</p>'; // AC

    hp.value = mon[3];
    hp.id = "hp"+num;
    MON_HP += mon[3];

    // Add elements to box
    right.appendChild(hp);
    element.appendChild(left);
    element.appendChild(right);
    right.appendChild(stat);

    element.id = "box"+num;
    document.getElementById("fighters").appendChild(element);
    document.getElementById("st"+num).value = mon[1];
}

function addPlrFighter(m) {
    var details = Mobs[m].split(',');

    var element = document.createElement("box");
    var left = document.createElement("left")
    var right = document.createElement("right")

    var hp = document.createElement("input");
    var stat = document.createElement("st");
    stat.innerHTML = status_box(m);

    // Get player details
    var perp = getPlayer(details[0]);

    left.innerHTML = perp[0] +" "+ perp[1];

    hp.value = perp[3];
    hp.id = "hp"+m;
    right.appendChild(hp);

    // Add elements to box
    element.appendChild(left);
    element.appendChild(right);
    right.appendChild(stat);

    element.id = "box"+m;
    document.getElementById("fighters").appendChild(element);
}


/**********************
 * Setting up a Fight
 *********************/

function playEncounter(name) {
    // Reset global var and roll init page
    Mobs = [];
    slayChildren("people");

    // Collect players
    for (var p = 0; p < Players.length; p++)
        Mobs.push(Players[p].slice(0,2).join());

    // Collect relevant monsters
    var row = getEncounterID(name);
    var creeps = Encounters[row][2].split(',');
    for (var c = 0; c < creeps.length; c++)
        Mobs.push("NPC," + creeps[c]);

    // Populate init page with combatants
    for(var m = 0; m < Mobs.length; m++) {
        var element = document.createElement("box");
        var details = Mobs[m].split(',');

        var name = document.createElement("div");
        name.style = "display: flex; justify-content: space-between; width: 90%;"
        name.innerHTML = "<p>" +details[1]+ "</p>";

        // Allow monster details to be examined
        if (details[0] == "NPC")
            name.innerHTML += "<img src='img/detail.svg' onclick='viewMonster(\"" +details[1]+ "\")'>";  // Details popup icon

        element.appendChild(name);
        element.innerHTML += "<input type='number' id='roll"+m+"' placeholder='roll' style='margin-right: 0;'/>";
        document.getElementById("people").appendChild(element);
    }

    // Populate encounter notes
    enc = Encounters[row]
    document.getElementById("enc-title").innerText = enc[0]
    document.getElementById("enc-note").value = enc[1]

    // Display init page
    showTab(7, [9, 10]);
}

function sortFighters() {
    cache = [];
    MON_HP = 0;

    // Pair combatants with their roll
    for(var m = 0; m < Mobs.length; m++) {
        var roll = parseInt(document.getElementById("roll"+m).value);
        cache.push([roll, Mobs[m]]);
    }

    // Sort cached pair and push to global
    cache.sort(function(a, b){return b[0]-a[0]});
    Mobs = [];
    for(item in cache) {
        Mobs.push(cache[item][1]);
    }

    // Clear old fighters list
    slayChildren("fighters");

    // Populate new fighters list
    for(var m = 0; m < Mobs.length; m++) {
        var details = Mobs[m].split(',');
        if (details[0] == "NPC")
            addMonFighter(m);
        else
            addPlrFighter(m);
    }

    // Save changes to encounter notes.
    row = getEncounterID(document.getElementById("enc-title").innerText)
    Encounters[row][1] = document.getElementById("enc-note").value

    // Highlight first/active combatant
    CURRENT = 0;
    document.getElementById("box0").style = ACTIVE_STYLE;
    showTab(8, [9, 10]);
}


/**********************
 * During a Fight
 *********************/

function next() {
    // Update active combatant
    pos = CURRENT;
    while (true) {
        CURRENT++;

        // Reset on overflow
        if (CURRENT >= Mobs.length)
            CURRENT = 0;

        // Prevent infinite loop
        if (pos == CURRENT)
            break;

        // Skip if dead
        var stat = document.getElementById("st"+CURRENT).value;
        var hp = document.getElementById("hp"+CURRENT).value;
        if (stat == "dead" || hp == 0)
            continue;
        else
            break;
    }

    // Update styles by status
    var pool = 0;
    for (var m in Mobs) {
        document.getElementById("box"+m).style = GENERIC_STYLE;

        var stat = document.getElementById("st"+m).value;
        var hp = document.getElementById("hp"+m).value;

        // Death cases
        if (stat == "dead" || hp == 0) {
            document.getElementById("box"+m).style = DEAD_STYLE;
            document.getElementById("st"+m).value = "dead";
            document.getElementById("hp"+m).value = 0;

            // Player "death" -> Player unconscious
            if (document.getElementById("box"+m).children[1].children.length != 4 && stat != "dead") {
                document.getElementById("box"+m).style = KO_STYLE;
                document.getElementById("st"+m).value = "unconscious";
            }
        }

        // Unconscious case
        if (stat == "unconscious")
            document.getElementById("box"+m).style = KO_STYLE;

        // Active case
        if (m == CURRENT)
            document.getElementById("box"+m).style = ACTIVE_STYLE;

        // Calculate monster health pool
        if (document.getElementById("box"+m).children[1].children.length == 4)
            pool += parseInt(document.getElementById('hp'+m).value);

    }

    // Calculate pool percentage and update display bar
    var width = 22.0;
    pool = Math.round((pool/MON_HP) * width);

    if (pool > width)
        pool = width;

    document.getElementById("hpBar").style = "border-left: " +pool+ "rem solid var(--pale-red); width:" +(width-pool) + "rem";
}


function addMonsters() {
    var offset = document.getElementById("fighters").children.length;
    Challengers = document.getElementById("monster-ch").value.split(',');

    for (var m in Challengers) {
        Mobs.push("NPC," + Challengers[m] + ", ");
        addMonFighter(m, offset);
    }

    document.getElementById("challenger").style.visibility = "hidden";
    document.getElementById("blackout").style.visibility = "hidden";
    document.getElementById("content").style =  "overflow: scroll;";
}


function viewMonster(name) {
    var monster = getMonster(name);
    var form = document.getElementById("monsternotes");

    form.elements[0].value = monster[0];
    //form.elements[1].value = monster[1]; Status Not Displayed
    form.elements[1].value = monster[2];
    form.elements[2].value = monster[3];

    //Show ability scores with modifiers
    for (var m = 4; m < 10; m++){
        let n = m-1
        switch(monster[m]) {
            case 1:
                form.elements[n].value = monster[m] + ' (-5)';
                break;
            case 2:
            case 3:
                form.elements[n].value = monster[m] + ' (-4)';
                break;
            case 4:
            case 5:
                form.elements[n].value = monster[m] + ' (-3)';
                break;
            case 6:
            case 7:
                form.elements[n].value = monster[m] + ' (-2)';
                break;
            case 8:
            case 9:
                form.elements[n].value = monster[m] + ' (-1)';
                break;
            case 10:
            case 11:
                form.elements[n].value = monster[m] + ' (0)';
                break;
            case 12:
            case 13:
                form.elements[n].value = monster[m] + ' (+1)';
                break;
            case 14:
            case 15:
                form.elements[n].value = monster[m] + ' (+2)';
                break;
            case 16:
            case 17:
                form.elements[n].value = monster[m] + ' (+3)';
                break;
            case 18:
            case 19:
                form.elements[n].value = monster[m] + ' (+4)';
                break;
            case 20:
            case 21:
                form.elements[n].value = monster[m] + ' (+5)';
                break;
            case 22:
            case 23:
                form.elements[n].value = monster[m] + ' (+6)';
                break;
            case 24:
            case 25:
                form.elements[n].value = monster[m] + ' (+7)';
                break;
            case 26:
            case 27:
                form.elements[n].value = monster[m] + ' (+8)';
                break;
            case 28:
            case 29:
                form.elements[n].value = monster[m] + ' (+9)';
                break;
            case 30:
                form.elements[n].value = monster[m] + ' (+10)';
                break;
        }
    }
    form.elements[9].value = monster[10];
    form.elements[10].value = monster[11];

    var icon = document.getElementById("preview");
    icon.src = "./img/reset.svg";
    icon.onclick = clearPreview;
}

function clearPreview() {
    var form = document.getElementById("monsternotes");
    form.reset();

    var icon = document.getElementById("preview");
    icon.src = "./img/detail.svg";
    icon.onclick = ""
}