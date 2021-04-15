GENERIC_STYLE = "color: #b9bbbe; border-left: 4px solid #b9bbbe";
ACTIVE_STYLE = "color: #43b581; border-left: 8px solid #43b581";
KO_STYLE = "border-left: 4px solid #faa61a";
DEAD_STYLE = "border-left: 4px solid #f04747";
CURRENT = 0;

/**********************
 * Run Encounter
 *********************/

 function status_box(id) {
    return '\
        <select id="st' +id+ '" type="text"> \
            <option value="normal">normal</option> \
            <option value="blinded">blinded</option> \
            <option value="charmed">charmed</option> \
            <option value="deafened">deafened</option> \
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
            <option value="exhausted">exhausted</option> \
            <option value="dead">dead</option> \
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

        element.innerHTML += "<input type='number' id='roll"+m+"' placeholder='roll'/>";
        document.getElementById("people").appendChild(element)
    }
}

function loadFight() {
    for(var m = 0; m < Mobs.length; m++) {
        var element = document.createElement("box");
        var details = Mobs[m].split(',');

        var name = document.createElement("P")
        var hp = document.createElement("input");
        var stat = document.createElement("st");

        stat.innerHTML = status_box(m);

        if (details[0] == "NPC") {
            var mon = getMonster(details[1])

            name.style = "display: flex;"
            name.innerHTML = mon[0] + "<p style='width: 1rem; margin-left: 4rem;'>"+mon[2]+"</p>";
            name.innerHTML += "<p style='margin-top: -0.75rem; margin-left: 0.75rem; width:10rem;'>" + mon.slice(4, 10).join(", ") +"</p>";
            hp.value = mon[3];
            
        } else {
            var perp = getPlayer(details[0])

            name.innerHTML = perp[1] +" "+ perp[2];
            hp.value = perp[3];
        }

        element.appendChild(name);
        element.appendChild(hp);
        element.appendChild(stat);

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
        Mobs.push(Players[p].slice(0,3).join().replace(/\s/g, ''));

    var row = getEncounterID(name);
    var creeps = Encounters[row][2].replace(/\s/g, '').split(',');
    for (var c = 0; c < creeps.length; c++)
        Mobs.push("NPC," + creeps[c] + ", ");

    rollInit();
    showTab(7, 8);
}


function sortFighters() {
    cache = []
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
    while (true) {
        CURRENT++;
        if (CURRENT >= Mobs.length)
            CURRENT = 0;
        
        var stat = document.getElementById("st"+CURRENT).value;
        if (stat == "dead")
            continue;
        else
            break;
    }
    
    for (var m in Mobs) {
        document.getElementById("box"+m).style = GENERIC_STYLE;

        var stat = document.getElementById("st"+m).value;
        if (stat == "dead")
            document.getElementById("box"+m).style = DEAD_STYLE;
        if (stat == "unconscious")
            document.getElementById("box"+m).style = KO_STYLE;
        if (m == CURRENT)
            document.getElementById("box"+m).style = ACTIVE_STYLE;
            
    }
}