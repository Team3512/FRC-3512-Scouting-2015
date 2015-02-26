var fieldNames = {'f_matchNumber':'', 'f_teamNumber':'', 'f_numAutoZone':'0', 'f_numStageBin':'0', 'f_numStepBin':'0', 'f_robotAuton':'', 'f_toteAuton':'', 'f_numOnStep':'0', 'f_numOnTop':'0', 'f_fouls':'0', 'f_stacks':'0', 'f_dead':'', 'f_tipped':'', 'f_tippedOtherRobot':'', 'f_morePlayerStation':'false', 'f_notes':''};

function marshalData() {
    var map = {};

    for(var key in fieldNames) {
        if(fieldNames.hasOwnProperty(key)) {
            map[key] = document.getElementById(key).value;
        }
    }

    map['timestamp'] = Date.now();
    /* map['f_matchNumber'] = document.getElementById('f_matchNumber').value;
    map['f_teamNumber'] = document.getElementById('f_teamNumber').value;
    map['f_numAutoZone'] = document.getElementById('f_numAutoZone').value;
    map['f_numStageBin'] = document.getElementById('f_numStageBin').value;
    map['f_numStepBin'] = document.getElementById('f_numStepBin').value;
    map['f_robotAuton'] = document.getElementById('f_robotAuton').value;
    map['f_toteAuton'] = document.getElementById('f_toteAuton').value;
    map['f_numOnStep'] = document.getElementById('f_numOnStep').value;
    map['f_numOnTop'] = document.getElementById('f_numOnTop').value; */
    for(i = 1; i < 6; i++) {
        map['f_' + i + '_litter'] = document.getElementById('f_' + i + '_litter').value;
        map['f_' + i + '_can'] = document.getElementById('f_' + i + '_can').value;
        map['f_' + i + '_ntotes'] = document.getElementById('f_' + i + '_ntotes').value;
    }
    /* map['f_fouls'] = document.getElementById('f_fouls').value;
    map['f_stacks'] = document.getElementById('f_stacks').value;
    map['f_dead'] = document.getElementById('f_dead').value;
    map['f_tipped'] = document.getElementById('f_tipped').value;
    map['f_tippedOtherRobot'] = document.getElementById('f_tippedOtherRobot').value;
    map['f_morePlayerStation'] = document.getElementById('f_morePlayerStation').value;
    map['f_notes'] = document.getElementById('f_notes').value; */
    map['f_scoutName'] = document.getElementById('f_scoutName').value;
    return map;
}

function clearFields() {
    for(var key in fieldNames) {
        if(fieldNames.hasOwnProperty(key)) {
            if(document.getElementById(key).type == 'text'
                || document.getElementById(key).type == 'textarea') {
                document.getElementById(key).value = fieldNames[key];
            } else if (document.getElementById(key).type == 'checkbox'
                || document.getElementById(key).type == 'radio') {
                document.getElementById(key).checked = fieldNames[key];
            }
        }
    }

    for(i = 1; i < 6; i++) {
        document.getElementById('f_' + i + '_litter').checked = '';
        document.getElementById('f_' + i + '_can').checked = '';
        document.getElementById('f_' + i + '_ntotes').value = '0';
    }
}

function procForm() {
    var arr;
    try {
        arr = JSON.parse(localStorage.getItem("scoutingData3512"));
    }catch(e){
        arr = ["magic v0.1"];
    }
    if(Array.isArray(arr)) {
        if(arr[0] !== "magic v0.1") {
            arr = ["magic v0.1"];
        }
    }else{
        arr = ["magic v0.1"];
    }

    data = marshalData();
    arr.push(data);
    localStorage.setItem("scoutingData3512", JSON.stringify(arr));
    clearFields();

    document.getElementById('statusText').innerHTML = "Data recorded";
}

function resetLocalStorage() {
    localStorage.setItem("scoutingData3512", "");
}

function submitData(str) {
    document.getElementById('statusText').innerHTML = "Sending ...";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200 && xmlhttp.responseText == 'OK\n') {
                document.getElementById('statusText').innerHTML = "Data sent!";
                resetLocalStorage();                
            } else {
                document.getElementById('statusText').innerHTML = "Sending failed";
            }
        }
    }
    xmlhttp.open("POST", "/write", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(str);
}

function displayJSON() {
    nwin=window.open();
    ndoc=nwin.document;
    ndoc.write("<pre>" + localStorage.getItem('scoutingData3512') + "</pre>");
    ndoc.close();
}

function onLoad() {
    clearFields();
}
