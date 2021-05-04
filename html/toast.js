function reportSaved(type) {
    var x = document.getElementById(type + "saved");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function reportIncomplete() {
    var x = document.getElementById("formerror");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function badTab() {
    var x = document.getElementById("wrongtab");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showPop(num) {
    for (var t = 1; t < 3; t++) {
        var pop = document.getElementById('pop'+t);
        var vis = pop.style.visibility;

        // Toggle visiblity of current
        if (t == num)
            if (vis == "visible")
                pop.style.visibility = "hidden";
            else
                pop.style.visibility = "visible";

        // Hide all others
        else
            pop.style.visibility = "hidden";
    }
}