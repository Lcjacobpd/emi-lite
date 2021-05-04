/**********************
 * Player Controls
 *********************/

function savePlayer() {
    var form = document.getElementById("playerform").elements;
    var player = [
        form['player_name'].value,
        form['character_name'].value,
        form['class'].value,
        form['health'].value
    ];

    // Ensure valid form data
    var valid = true;
    for (var i = 0; i < player.length; i++)
        if (player[i] == "") {
            valid = false;
            break
        }
    if (valid == false) {
        reportIncomplete();
        return;
    }

    Players.push(player);
    addPlayerRow(player);

    document.getElementById("playerform").reset();
    reportSaved("player");
}

function addPlayerRow(player) {
    var table = document.getElementById('playerlist');
    var row = table.insertRow();
    for (var c = 0; c < 5; c++) {
        var cell = row.insertCell();
        if (c == 4) {
            cell.innerHTML = "<img src='img/edit.svg' onclick='editPlayer(\"" +player[0]+ "\")'><img src='img/minus.svg' onclick='deletePlayer(\"" +player[0]+ "\")'>";
            break;
        } else {
            cell.innerHTML = player[c];
        }
    }
}

function getPlayer(name) {
    // Fetch player by name
    for (var p = 0; p < Players.length; p++)
        if (Players[p][0] == name)
            return Players[p];
}

function getPlayerID(name) {
    // Fetch player ID by name
    for (var p = 0; p < Players.length; p++)
        if (Players[p][0] == name)
            return p;
}

function editPlayer(name) {
    var player = getPlayer(name);
            
    var form = document.getElementById("playerform");
    form.elements[0].value = player[0];
    form.elements[1].value = player[1];
    form.elements[2].value = player[2];
    form.elements[3].value = player[3];

    showTab(1);
    deletePlayer(name);
}

function deletePlayer(name) {
    var row = getPlayerID(name);
    document.getElementById('playerlist').deleteRow(row + 1);
    Players.splice(row, 1);
}

function savePBook() {
    text = 'var Players = [\n'
    text += '\t//Player Name,           Character Name, 	        Class,        HP\n'

    for (var p = 0; p < Players.length; p++) {
        text += '\t[';
        text += '\'' + Players[p][0] + '\', ';
        text += '\'' + Players[p][1] + '\', \t';
        
        text += '\'' + Players[p][2] + '\', '; // Class
        text += Players[p][3]; // HP
        text += '],\n';
    }
    text += ']';

    const textToBlob = new Blob([text], {type: 'text/plain' });
    const uFileName = 'players.js';

    let newLink = document.createElement("a");
    newLink.download = uFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBlob);
    } else {
        newLink.href = window.URL.createObjectURL(textToBlob);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
}


/**********************
 * Monster Controls
 *********************/

function saveMonster() {
    var form = document.getElementById("monsterform").elements;
    var monster = [
        form['name'].value,
        form['status'].value,
        form['armor'].value,
        form['health'].value,
        form['str'].value,
        form['dex'].value,
        form['con'].value,
        form['int'].value,
        form['wiz'].value,
        form['cha'].value,
        form['dice'].value,
        form['res'].value
    ];

    // Ensure valid form data
    var valid = true;
    for (var i = 0; i < monster.length; i++)
        if (monster[i] == "") {
            valid = false;
            break
        }
    if (valid == false) {
        reportIncomplete();
        return;
    }

    MonsterBook.push(monster);
    addMonsterRow(monster);

    document.getElementById("monsterform").reset();
    reportSaved("monster");
}

function addMonsterRow(monster) {
    var table = document.getElementById('monsterlist');
    var row = table.insertRow();
    for (var c = 0; c < 5; c++) {
        var cell = row.insertCell();
        if (c == 4) {
            cell.innerHTML = "<img src='img/edit.svg' onclick='editMonster(\"" +monster[0]+ "\")'><img src='img/minus.svg' onclick='deleteMonster(\"" +monster[0]+ "\")'>";
            break;
        } else {
            cell.innerHTML = monster[c];
        }
    }
}

function getMonster(name) {
    // Fetch monster by name
    for (var p = 0; p < MonsterBook.length; p++)
        if (MonsterBook[p][0] == name)
            return MonsterBook[p];

    return 'ERROR'
}

function getMonsterID(name) {
    // Fetch monster ID by name
    for (var p = 0; p < MonsterBook.length; p++)
        if (MonsterBook[p][0] == name)
            return p
}

function editMonster(name) {
    var monster = getMonster(name);
            
    var form = document.getElementById("monsterform");
    form.elements[0].value = monster[0];
    form.elements[1].value = monster[1];
    form.elements[2].value = monster[2];
    form.elements[3].value = monster[3];
    form.elements[4].value = monster[4];
    form.elements[5].value = monster[5];
    form.elements[6].value = monster[6];
    form.elements[7].value = monster[7];
    form.elements[8].value = monster[8];
    form.elements[9].value = monster[9];
    form.elements[10].value = monster[10];
    form.elements[11].value = monster[11];

    showTab(2);
    deleteMonster(name);
}

function viewMonster(name) {
    var monster = getMonster(name);
            
    var form = document.getElementById("monsternotes");
    form.elements[0].value = monster[0];
    //form.elements[1].value = monster[1];
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
}

function deleteMonster(name) {
    var row = getMonsterID(name);
    document.getElementById('monsterlist').deleteRow(row + 1);
    MonsterBook.splice(row, 1);
}

function saveMBook() {
    text = 'var MonsterBook = [\n'
    text += '\t//Name,                  Condition,\tAC, HP, \tSTR, DEX, CON,\tINT, WIZ, CHA,\tHit Dice,     Resistance\n'

    for (var m = 0; m < MonsterBook.length; m++) {
        text += '\t[';
        text += '\'' + MonsterBook[m][0] + '\', ';
        text += '\'' + MonsterBook[m][1] + '\', \t';

        text += MonsterBook[m][2] + ', '; // AC
        text += MonsterBook[m][3] + ',  \t'; // HP

        text += MonsterBook[m][4] + ', '; // STR
        text += MonsterBook[m][5] + ', '; // DEX
        text += MonsterBook[m][6] + ',  \t'; // CON

        text += MonsterBook[m][7] + ', '; // INT
        text += MonsterBook[m][8] + ', '; // WIZ
        text += MonsterBook[m][9] + ',\t\t'; // CHA
        
        text += '\'' + MonsterBook[m][10] + '\',  \t';
        text += '\'' + MonsterBook[m][11] + '\'';
        text += '],\n';
    }
    text += ']';

    const textToBlob = new Blob([text], {type: 'text/plain' });
    const uFileName = 'monsterbook.js';

    let newLink = document.createElement("a");
    newLink.download = uFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBlob);
    } else {
        newLink.href = window.URL.createObjectURL(textToBlob);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
}


/**********************
 * Encounter Controls
 *********************/

function saveEncounter() {
    var form = document.getElementById("encounterform").elements;
    var notes = document.getElementById("encounter-notes").value;
    var monsters = document.getElementById("monster-tb").value;

    monsters = monsters;

    var encounter = [
        form['name'].value,
        notes,
        monsters
    ];

    // Ensure valid form data
    var valid = true;
    for (var i = 0; i < encounter.length; i++)
        if (encounter[i] == "") {
            valid = false;
            break
        }
    if (valid == false) {
        reportIncomplete();
        return;
    }

    Encounters.push(encounter);
    addEncounterRow(encounter);

    document.getElementById("encounterform").reset(); 
    document.getElementById("monster-tb").setAttribute("value", [{}]);
    reportSaved("encounter");
}

function addEncounterRow(encounter) {
    var table = document.getElementById('encounterlist');
    var row = table.insertRow();
    for (var c = 0; c < 3; c++) {
        var cell = row.insertCell();
        if (c == 2) {
            cell.innerHTML = "<img src='img/roll.svg' onclick='playEncounter(\"" +encounter[0]+ "\")'><img src='img/minus.svg' onclick='deleteEncounter(\"" +encounter[0]+ "\")'>";
            break;
        } else {
            cell.innerHTML = encounter[c];
        }
    }
}

function getEncounter (name) {
    // Fetch encounter by name
    for (var p = 0; p < Encounters.length; p++)
        if (Encounters[p][0] == name)
            return Encounters[p];  
}

function getEncounterID (name) {
    // Fetch encounter ID by name
    for (var p = 0; p < Encounters.length; p++)
        if (Encounters[p][0] == name)
            return p
}

function deleteEncounter(name) {
    var row = getEncounterID(name);
    document.getElementById('encounterlist').deleteRow(row + 1);
    Encounters.splice(row, 1);
}

function saveEBook() {
    text = 'var Encounters = [\n'
    text += '\t//Name,                  Notes,     Monsters\n'

    for (var e = 0; e < Encounters.length; e++) {
        text += '\t[';
        text += '\'' + Encounters[e][0] + '\', ';

        text += '\'' + Encounters[e][1] + '\', \t'; // Notes
        text += '\'' + Encounters[e][2] + '\''; // Monsters
        text += '],\n';
    }
    text += ']';

    const textToBlob = new Blob([text], {type: 'text/plain' });
    const uFileName = 'encounters.js';

    let newLink = document.createElement("a");
    newLink.download = uFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBlob);
    } else {
        newLink.href = window.URL.createObjectURL(textToBlob);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
}
