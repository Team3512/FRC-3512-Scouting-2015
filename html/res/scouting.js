function marshalData() {
    var map = {};
    map['timestamp'] = Date.now();
    map['textfield'] = document.getElementById('textfield').value;
    return map;
}

function clearFields() {
    document.getElementById('textfield').value = ""; 
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
