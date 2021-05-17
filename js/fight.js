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
        Mobs.push(Players[p].slice(0,3).join());

    // Collect relevant monsters
    var row = getEncounterID(name);
    var creeps = Encounters[row][2].split(',');
    for (var c = 0; c < creeps.length; c++)
        Mobs.push("NPC," + creeps[c] + ", ");

    // Populate init page with combatants
    for(var m = 0; m < Mobs.length; m++) {
        var element = document.createElement("box");
        var details = Mobs[m].split(',');

        var pname = document.createElement("P");
        pname.innerText = details[0];
        element.appendChild(pname);

        var cname = document.createElement("P");
        cname.innerText = details[1];
        element.appendChild(cname);

        var cl = document.createElement("P");
        cl.innerText = details[2];
        element.appendChild(cl);

        element.innerHTML += "<input type='number' id='roll"+m+"' placeholder='roll' style='margin-right: 0;'/>";
        document.getElementById("people").appendChild(element);
    }

    // Display init page
    showTab(7, 8);
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

    // Highlight first/active combatant
    CURRENT = 0;
    document.getElementById("box0").style = ACTIVE_STYLE;
    showTab(9, 10);
}


/**********************
 * During up a Fight
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
    var width = 30.0;
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
    document.getElementById("content").style =  "overflow: scroll;";
}


function viewMonster(name) {
    var monster = getMonster(name);
            
    var form = document.getElementById("monsternotes");
    form.elements[0].value = monster[0];
    //form.elements[1].value = monster[1]; Status Not Displayed
    form.elements[1].value = monster[2];
    form.elements[2].value = monster[3];
    form.elements[3].value = monster[4];
    form.elements[4].value = monster[5];
    form.elements[5].value = monster[6];
    form.elements[6].value = monster[7];
    form.elements[7].value = monster[8];
    form.elements[8].value = monster[9];
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