GENERIC_STYLE = "color: #b9bbbe; border-left: 4px solid #b9bbbe";
ACTIVE_STYLE = "color: #43b581; border-left: 8px solid #43b581";
KO_STYLE = "border-left: 4px solid #faa61a";
DEAD_STYLE = "border-left: 4px solid #f04747";
CURRENT = 0;
MON_HP = 0;

/**********************
 * Run Encounter
 *********************/

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
    '
}

 function slayChildren(parentname) {
    var parent = document.getElementById(parentname);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function rollInit() {
    // Propogate page with combatants
    for(var m = 0; m < Mobs.length; m++) {
        var element = document.createElement("box");
        var details = Mobs[m].split(',');

        var pname = document.createElement("P");
        pname.innerText = details[0];
        element.appendChild(pname);

        var cname = document.createElement("P");
        cname.innerText = details[1];
        element.appendChild(cname)

        var cl = document.createElement("P");
        cl.innerText = details[2];
        element.appendChild(cl)

        element.innerHTML += "<input type='number' id='roll"+m+"' placeholder='roll' style='margin-right: 0;'/>";
        document.getElementById("people").appendChild(element)
    }
}

function loadFight() {
    for(var m = 0; m < Mobs.length; m++) {
        var details = Mobs[m].split(',');

        var element = document.createElement("box");
        var left = document.createElement("left")
        var right = document.createElement("right")

        var hp = document.createElement("input");
        var stat = document.createElement("st");

        stat.innerHTML = status_box(m);

        if (details[0] == "NPC") {
            var mon = getMonster(details[1]);

            left.innerHTML = "NPC " + mon[0];
            right.innerHTML = "<img src='img/detail.svg' onclick='viewMonster(\"" +mon[0]+ "\")'>";  // Details popup icon
            right.innerHTML += '<p>' + mon[2] + '</p>';     // AC
            
            hp.value = mon[3];
            hp.id = "hp"+m;
            right.appendChild(hp)

            MON_HP += mon[3];

        } else {
            var perp = getPlayer(details[0])

            left.innerHTML = perp[0] +" "+ perp[1];
            
            hp.value = perp[3];
            hp.id = "hp"+m;
            right.appendChild(hp)
        }

        element.appendChild(left);
        element.appendChild(right)
        right.appendChild(stat);

        element.id = "box"+m;
        document.getElementById("fighters").appendChild(element)

        if (details[0] == "NPC")
            document.getElementById("st"+m).value = mon[1];
    }
}

function playEncounter(name) {
    Mobs = [];
    slayChildren("people");

    // Collect relevant Monsters and Players
    for (var p = 0; p < Players.length; p++)
        Mobs.push(Players[p].slice(0,3).join());

    var row = getEncounterID(name);
    var creeps = Encounters[row][2].split(',');
    for (var c = 0; c < creeps.length; c++)
        Mobs.push("NPC," + creeps[c] + ", ");

    rollInit();
    showTab(7, 8);
}


function sortFighters() {
    cache = [];
    MON_HP = 0;
    for(var m = 0; m < Mobs.length; m++) {
        var roll = parseInt(document.getElementById("roll"+m).value);
        cache.push([roll, Mobs[m]]);
    }

    cache.sort(function(a, b){return b[0]-a[0]});
    Mobs = []
    for(item in cache) {
        Mobs.push(cache[item][1])
    }

    slayChildren("fighters");
    loadFight()
    showTab(9, 10);

    CURRENT = 0;
    
    document.getElementById("box0").style = ACTIVE_STYLE;
}

function next() {
    pos = CURRENT;
    while (true) {
        CURRENT++;
        if (CURRENT >= Mobs.length)
            CURRENT = 0;

        if (pos == CURRENT) // Prevent infinite loop
            break;
        
        var stat = document.getElementById("st"+CURRENT).value;
        var hp = document.getElementById("hp"+CURRENT).value;

        if (stat == "dead" || hp == 0)
            continue;
        else
            break;
    }
    
    var pool = 0;
    for (var m in Mobs) {
        document.getElementById("box"+m).style = GENERIC_STYLE;

        var stat = document.getElementById("st"+m).value;
        var hp = document.getElementById("hp"+m).value;

        // Death Cases
        if (stat == "dead" || hp == 0) {
            document.getElementById("box"+m).style = DEAD_STYLE;
            document.getElementById("st"+m).value = "dead";
            document.getElementById("hp"+m).value = 0;

            if (document.getElementById("box"+m).children[1].children.length != 4 && stat != "dead") {
                document.getElementById("box"+m).style = KO_STYLE;
                document.getElementById("st"+m).value = "unconscious";
            }
        }
        
            
        if (stat == "unconscious")
            document.getElementById("box"+m).style = KO_STYLE;
        if (m == CURRENT)
            document.getElementById("box"+m).style = ACTIVE_STYLE;

        if (document.getElementById("box"+m).children[1].children.length == 4)
            pool += parseInt(document.getElementById('hp'+m).value);
            
    }

    var width = 30.0;

    pool = Math.round((pool/MON_HP) * width);
    document.getElementById("hpBar").style = "border-left: " +pool+ "rem solid var(--pale-red); width:" +(width-pool) + "rem"
}


function addMonsters() {
    var challengers = document.getElementById("monster-ch").value.split(',');;
    var fighters = document.getElementById("fighters");

    for (var m in challengers) {
        var mon = getMonster(challengers[m]);
        

        var element = document.createElement("box");
        var left = document.createElement("left")
        var right = document.createElement("right")

        var hp = document.createElement("input");
        var stat = document.createElement("st");
        stat.innerHTML = status_box(m);


        left.innerHTML = "NPC " + mon[0];
        right.innerHTML = "<img src='img/detail.svg' onclick='viewMonster(\"" +mon[0]+ "\")'>";  // Details popup icon
        right.innerHTML += '<p>' + mon[2] + '</p>';     // AC
        
        hp.value = mon[3];
        hp.id = "hp"+m;
        right.appendChild(hp)

        MON_HP += mon[3];


        element.appendChild(left);
        element.appendChild(right)
        right.appendChild(stat);

        element.id = "box"+m;
        fighters.appendChild(element)

        document.getElementById("st"+m).value = mon[1];


        // Close "Add Monster" tab
        document.getElementById("challenger").style.visibility = "hidden";
    }
}