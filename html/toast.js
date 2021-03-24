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


function showToast(num) {
    if (num == 1) {
        // hide option popup
        document.getElementById("option-popup").style.visibility = "hidden";
        
        
        // toggle contact popup
        var popup = document.getElementById("contact-popup");
        if (popup.style.visibility == "hidden") {
            popup.style.visibility = "visible";
        } else {
            popup.style.visibility = "hidden";
        }
    }
    else {
        // hide contact popup
        document.getElementById("contact-popup").style.visibility = "hidden";

        // toggle option popup
        var popup = document.getElementById("option-popup");
        if (popup.style.visibility == "hidden") {
            popup.style.visibility = "visible";
        } else {
            popup.style.visibility = "hidden";
        }
    }
}