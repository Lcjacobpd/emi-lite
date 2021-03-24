/**********************
 * Player Controls
 *********************/

var players = [];

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

    players.push(player);
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
    var row;
    for (var p = 0; p < players.length; p++)
        if (players[p][0] == name) {
            player = players[p];
            row = p;
        }

    return row
}

function editPlayer(name) {
    var row = getPlayer(name);
    var player = players[row];
            
    var form = document.getElementById("playerform");
    form.elements[0].value = player[0];
    form.elements[1].value = player[1];
    form.elements[2].value = player[2];
    form.elements[3].value = player[3];

    showTab(1);
    deletePlayer(name);
}

function deletePlayer(name) {
    var row = getPlayer(name);
    document.getElementById('playerlist').deleteRow(row + 1);
    players.splice(row, 1);
}


/**********************
 * Monster Controls
 *********************/

var monsters = [];

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

    monsters.push(monster);
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
    var row;
    for (var p = 0; p < monsters.length; p++)
        if (monsters[p][0] == name) {
            monster = monsters[p];
            row = p;
        }

    return row
}

function editMonster(name) {
    var row = getMonster(name);
    var monster = monsters[row];
            
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

function deleteMonster(name) {
    var row = getMonster(name);
    document.getElementById('monsterlist').deleteRow(row + 1);
    monsters.splice(row, 1);
}