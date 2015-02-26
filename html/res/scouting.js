var fieldNames = {'f_matchNumber':'', 'f_teamNumber':'', 'f_numAutoZone':'0', 'f_numStageBin':'0', 'f_numStepBin':'0', 'f_robotAuton':'', 'f_toteAuton':'', 'f_numOnStep':'0', 'f_numOnTop':'0', 'f_fouls':'0', 'f_stacks':'0', 'f_dead':'', 'f_tipped':'', 'f_tippedOtherRobot':'', 'f_morePlayerStation':'false', 'f_notes':''};

function marshalData() {
    var map = {};

    map['timestamp'] = Date.now();
    for(var key in fieldNames) {
        if(fieldNames.hasOwnProperty(key)) {

            if(document.getElementsByName(key)[0].type == 'text'
                || document.getElementsByName(key)[0].type == 'textarea') {
                map[key] = document.getElementsByName(key)[0].value;
            } else if (document.getElementsByName(key)[0].type == 'checkbox') {
                map[key] = document.getElementsByName(key)[0].checked;
            } else if(document.getElementsByName(key)[0].type == 'radio') {
                elms = document.getElementsByName(key);
                for(i = 0; i < elms.length; i++) {
                    if(elms[i].checked) {
                        map[key] = elms[i].value;
                    }
                }
            }
        }
    }

    for(i = 1; i < 6; i++) {
        map['f_' + i + '_litter'] = document.getElementsByName('f_' + i + '_litter')[0].checked;
        map['f_' + i + '_can'] = document.getElementsByName('f_' + i + '_can')[0].checked;

        elms = document.getElementsByName('f_' + i + '_ntotes');
        for(n = 0; n < elms.length; n++) {
            if(elms[n].checked) {
                map['f_' + i + '_ntotes'] = elms[n].value;
            }
        }
    }

    map['f_scoutName'] = document.getElementsByName('f_scoutName')[0].value;
    return map;
}

function clearFields() {
    for(var key in fieldNames) {
        if(fieldNames.hasOwnProperty(key)) {
            if(document.getElementsByName(key)[0].type == 'text'
                || document.getElementsByName(key)[0].type == 'textarea') {
                document.getElementsByName(key)[0].value = fieldNames[key];
            } else if (document.getElementsByName(key)[0].type == 'checkbox') {
                document.getElementsByName(key)[0].checked = fieldNames[key];
            } else if (document.getElementsByName(key)[0].type == 'radio') {
                elms = document.getElementsByName(key);
                for(i = 0; i < elms.length; i++) {
                    if(fieldNames[key] == elms[i].value) {
                        elms[i].checked = true;
                    }
                }
            }
        }
    }

    for(i = 1; i < 6; i++) {
        document.getElementsByName('f_' + i + '_litter')[0].checked = '';
        document.getElementsByName('f_' + i + '_can')[0].checked = '';

        elms = document.getElementsByName('f_' + i + '_ntotes');
        for(n = 0; n < elms.length; n++) {
            if(elms[n].value == '0') {
                elms[n].checked = true;
            }
        }
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
