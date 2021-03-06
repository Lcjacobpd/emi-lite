/********************************************************************
 * Player Controls
 *******************************************************************/

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

    // Form is valid, check for overwrite
    for (p in Players)
        if (Players[p][0] == player[0]) {
            Players[p] = player;

            document.getElementById("playerform").reset();

            var table = document.getElementById('playerlist').children;
            var row = table[0].children[1+parseInt(p)];
            row.remove()

            addPlayerRow(player);
            reportSaved("player");
            return
        }

    // New entry, push to variable and add row to table
    Players.push(player);
    addPlayerRow(player);

    document.getElementById("playerform").reset();
    reportSaved("player");
}

function addPlayerRow(player) {
    var table = document.getElementById('playerlist');
    var row = table.insertRow();

    // Populate new row
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
}

function deletePlayer(name) {
    var row = getPlayerID(name);
    document.getElementById('playerlist').deleteRow(row + 1);
    Players.splice(row, 1);
}

function savePBook() {
    text = 'var Players = [\n'
    text += '\t// Player Name, Character Name, Class, HP\n'

    for (var p = 0; p < Players.length; p++) {
        text += '\t[`' + Players[p][0] + '`, '; // Player name
        text += '`' + Players[p][1] + '`, ';    // Character name
        text += '`' + Players[p][2] + '`, ';    // Class
        text += Players[p][3] + '], \n';         // HP
    }
    text += ']'

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

/********************************************************************
 * Monster Controls
 *******************************************************************/

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

    // Form is valid, check for overwrite
    for (m in MonsterBook)
        if (MonsterBook[m][0] == monster[0]) {
            MonsterBook[m] = monster;

            document.getElementById("monsterform").reset();

            var table = document.getElementById('monsterlist').children;
            var row = table[0].children[1+parseInt(m)];
            row.remove()

            addMonsterRow(monster);
            reportSaved("monster");
            return
        }

    // New entry, push to variable and add row to table
    MonsterBook.push(monster);
    addMonsterRow(monster);

    document.getElementById("monsterform").reset();
    reportSaved("monster");
}

function addMonsterRow(monster) {
    var table = document.getElementById('monsterlist');
    var row = table.insertRow();

    // Populate new row
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
}

function deleteMonster(name) {
    var row = getMonsterID(name);

    // Delete page and variable representation
    document.getElementById('monsterlist').deleteRow(row + 1);
    MonsterBook.splice(row, 1);
}

function saveMBook() {
    text = 'var MonsterBook = [\n'
    text += '\t// Name, Condition, AC, HP, STR, DEX, CON, INT, WIZ, CHA, Hit Dice, Resistance\n'

    for (var m = 0; m < MonsterBook.length; m++) {
        text += '\t[\n';
        text += '\t\t`' + MonsterBook[m][0] + '`, \n';
        text += '\t\t`' + MonsterBook[m][1] + '`, \n';

        text += '\t\t' + MonsterBook[m][2] + ', '; // AC
        text += MonsterBook[m][3] + ', '; // HP

        text += MonsterBook[m][4] + ', '; // STR
        text += MonsterBook[m][5] + ', '; // DEX
        text += MonsterBook[m][6] + ', '; // CON

        text += MonsterBook[m][7] + ', '; // INT
        text += MonsterBook[m][8] + ', '; // WIZ
        text += MonsterBook[m][9] + ', \n'; // CHA

        text += '\t\t`' + MonsterBook[m][10].split('\n').join('\\n') + '`,\n'; // Attacks
        text += '\t\t`' + MonsterBook[m][11] + '`\n\t],\n';
    }
    text += ']';

    console.log(text)
    

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

function searchMonsters() {
    var search = document.getElementById("search").value.toUpperCase();
    var rows = document.getElementById("monsterlist").rows;

    for (var r = 1; r < rows.length; r++) {
        var row = rows[r];
        var name = row.cells[0].innerText.toUpperCase();

        // Filter by search
        if (name.indexOf(search) > -1)
            row.style.display = "";

        else
            row.style.display = "none";
    }
}


/********************************************************************
 * Encounter Controls
 *******************************************************************/

function saveEncounter() {
    // Collect form information
    var form = document.getElementById("encounterform").elements;
    var notes = document.getElementById("encounter-notes").value;
    var monsters = document.getElementById("monster-tb").value;

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

    // Form is valid, push to variable and add row to table
    Encounters.push(encounter);
    addEncounterRow(encounter);

    document.getElementById("encounterform").reset();
    reportSaved("encounter");
}

function addEncounterRow(encounter) {
    var table = document.getElementById('encounterlist');
    var row = table.insertRow();

    // Populate new row
    var c0 = row.insertCell();
    c0.innerText = encounter[0];

    var c1 = row.insertCell();
    if (encounter[1].split("\n").length > 2) {
        var shortened = encounter[1].split("\n").slice(0,2).join("\n") + "...";
        if (shortened.length > 120)
            c1.innerText = shortened.substring(0, 117)+"..."; // Wake me when you need me
        else
            c1.innerText = shortened;
    }
    else if (encounter[1].length > 120)
        c1.innerText = encounter[1].substring(0, 117)+"..."; // Were it so easy
    else
        c1.innerText = encounter[1];

    var c2 = row.insertCell();
    c2.innerHTML = "<img src='img/roll.svg' onclick='playEncounter(\"" +encounter[0]+ "\")'><img src='img/minus.svg' onclick='deleteEncounter(\"" +encounter[0]+ "\")'>";
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

    // Delete page and variable representation
    document.getElementById('encounterlist').deleteRow(row + 1);
    Encounters.splice(row, 1);
}

function saveEBook() {
    text = 'var Encounters = [\n';
    text += '\t// Name, Notes, Monsters\n';

    for (var e = 0; e < Encounters.length; e++) {
        text += '\t[\n';
        text += '\t\t`' + Encounters[e][0] + '`,\n'; // Name

        text += '\t\t`' + Encounters[e][1].split('\n').join('\\n') + '`,\n' // Notes

        text += '\t\t`' + Encounters[e][2] + '`\n';  // Monsters
        text += '\t],\n';
    }
    text += ']';

    console.log(text)

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
