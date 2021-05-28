/********************************************************************
 * Spell Controls
 *******************************************************************/

 function saveSpell() {
    var form = document.getElementById("spellform").elements;
    var spell = [
        form['name'].value,
        document.getElementById("classes").value,
        form['magic-type'].value,
        form['casting-time'].value,
        form['roll-type'].value,
        form['level'].value,
        form['range'].value,
        form['duration'].value,
        document.getElementById("components").value,
        form['description'].value,
        form['concentration'].value,
        form['ritual'].value
    ];

    // Ensure valid form data
    var valid = true;
    for (var i = 0; i < spell.length; i++)
        if (spell[i] == "") {
            valid = false;
            break
        }
    if (valid == false) {
        reportIncomplete();
        return;
    }

    // Form is valid, check for overwrite
    for (s in SpellBook)
        if (SpellBook[s][0] == spell[0]) {
            SpellBook[s] = spell;

            document.getElementById("spellform").reset();
            hideAddSpell()

            var table = document.getElementById('spelllist').children;
            console.log(table[0].children)
            console.log(parseInt(s))

            var row = table[0].children[1+parseInt(s)];
            row.remove()

            addSpellRow(spell);
            reportSaved("spell");
            return
        }

    // New entry: push to variable and add row to table
    SpellBook.push(spell);
    addSpellRow(spell);

    document.getElementById("spellform").reset();
    hideAddSpell()
    reportSaved("spell");
}

function addSpellRow(spell) {
    var table = document.getElementById('spelllist');
    var row = table.insertRow();

    // Populate new row
    var name = row.insertCell();
    name.innerText = spell[0];

    var classes = row.insertCell();
    classes.innerText = spell[1];

    var magictype = row.insertCell();
    magictype.innerText = spell[2];

    var rolltype = row.insertCell();
    rolltype.innerText = spell[4];

    var level = row.insertCell();
    level.innerText = spell[5];

    var range = row.insertCell();
    range.innerText = spell[6];

    var components = row.insertCell();
    components.innerText = spell[8];

    var control = row.insertCell();
    control.innerHTML = "<img src='img/edit.svg' onclick='editSpell(\"" +spell[0]+ "\")'>";
    control.innerHTML += "<img src='img/minus.svg' onclick='deleteSpell(\"" +spell[0]+ "\")'>";

}

function getSpell(name) {
    // Fetch spell by name
    for (var p = 0; p < SpellBook.length; p++)
        if (SpellBook[p][0] == name)
            return SpellBook[p];
}

function getSpellID(name) {
    // Fetch spell ID by name
    for (var p = 0; p < SpellBook.length; p++)
        if (SpellBook[p][0] == name)
            return p
}

function editSpell(name) {
    var spell = getSpell(name);
            
    var form = document.getElementById("spellform");
    form.elements[0].value = spell[0];
    form.elements[1].value = spell[1];
    form.elements[2].value = spell[2];
    form.elements[3].value = spell[3];
    form.elements[4].value = spell[4];
    form.elements[5].value = spell[5];
    form.elements[6].value = spell[6];
    form.elements[7].value = spell[7];
    form.elements[8].value = spell[8];
    form.elements[9].value = spell[9];
    form.elements[10].value = spell[10];
    form.elements[11].value = spell[11];

    showAddSpell();
}

function deleteSpell(name) {
    var row = getSpellID(name);
    
    // Delete page and variable representation
    document.getElementById('spelllist').deleteRow(row + 1);
    SpellBook.splice(row, 1);
}

function saveMBook() {
    text = 'var SpellBook = [\n'
    text += '\t// Name, Condition, AC, HP, STR, DEX, CON, INT, WIZ, CHA, Hit Dice, Resistance\n'

    for (var m = 0; m < SpellBook.length; m++) {
        text += '\t[\n';
        text += '\t\t\'' + SpellBook[m][0] + '\', \n';
        text += '\t\t\'' + SpellBook[m][1] + '\', \n';

        text += '\t\t' + SpellBook[m][2] + ', '; // AC
        text += SpellBook[m][3] + ', '; // HP

        text += SpellBook[m][4] + ', '; // STR
        text += SpellBook[m][5] + ', '; // DEX
        text += SpellBook[m][6] + ', '; // CON

        text += SpellBook[m][7] + ', '; // INT
        text += SpellBook[m][8] + ', '; // WIZ
        text += SpellBook[m][9] + ', \n'; // CHA
        
        text += '\t\t\'' + SpellBook[m][10].replace("\n", "\\n") + '\',\n'; // Attacks
        text += '\t\t\'' + SpellBook[m][11] + '\'\n\t],\n';
    }
    text += ']';

    const textToBlob = new Blob([text], {type: 'text/plain' });
    const uFileName = 'spellbook.js';

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

function searchSpells() {
    var search = document.getElementById("search").value.toUpperCase();
    var rows = document.getElementById("spelllist").rows;

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
