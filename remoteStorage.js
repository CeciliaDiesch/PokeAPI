function onloadFunc(){
    console.log("test");
    //loadData("");          // mit "/Name" in dem Aufruf kann man eine Verschachtelung tiefer anzeigen lassen, wenn nichts drin steht, zeigt es das gesamte json an
    postData("", {"Klaus": "0175332422"});   // banana : rama wird in die datenbank hinzugefügt, geht auch in eine Untergruppe "/Name" zb. ansonsten lässte man die ersten"" einfach leer (den Path leer lassen). Es bildet sich ein eigener URL daneben wenn man POST ausführt
    //deleteData("/name/-O6v_nlv0OrfRx31FQJV");   //hier den path reingeben, deren dateien man löschen will
    putData("", {"Klaus": "0175332422"});
}

const BASE_URL = "https://remotestorage-33806-default-rtdb.europe-west1.firebasedatabase.app/";


async function loadData(path=""){
   let response = await fetch(BASE_URL + path + ".json");  //man braucht unbedingt + ".json"
   let responseToJson = await response.json();
   console.log(responseToJson);
   // return responseToJson;
}

async function postData(path="", data={}) {                     //die Daten die wir hochladen wollen hinzufügen in Klammer, und ein leeres json vordefinieren, um sicherzugehen, dass etwas vorhanden ist
    let response = await fetch(BASE_URL + path + ".json",{      //um etwas hinzufügen zu können, übergibt man noch mehr Inforsmatonn Header,...
        method: "POST",                                         // statt get wollen wir jetzt posten( etwas hinzufügen)
        header: {
            "Content-Type": "application/json",                 // wir sende ein json mit, was die datenbank wissen muss
        },
        body: JSON.stringify(data)                              //so wird es perfekt an die datenbank weitergegeben
    });
    return responseToJson = await response.json();
}

async function deleteData(path="") {                            //unbedingt darauf achten ob man einen leeren path übergeben will, dann könnte ungewollt viel gelöscht werden
    let response = await fetch(BASE_URL + path + ".json",{
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

async function putData(path="", data={}){                       //Die HTTP-Methode PUT wird üblicherweise verwendet, um Daten in Firebase Realtime Database zu aktualisieren
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",                                              //überschreibt, im Vergleich zu post, da fügt man hinzu. Und es wird nicht unter einem extra URL gepostet wie beim Posten, sondern direkt
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),  
    });
    return responseToJson = await response.json();
}

let users = [];

async function onloadFunc2(){
    let userResponse = await getAllUsers("namen");

    let UserKeysArray = Object.keys(userResponse);       // Object.entries(userResponse); zeigt das ganze Array, etwas unübersichtlich

    for (let index = 0; index < UserKeysArray.length; index++) {
        users.push(
            {
               id : UserKeysArray[index], 
               user : userResponse[UserKeysArray[index]],
            }
        )
        
    }

    await addEditSingleUser(users[2].id, {name: 'Mandy'})       //ändert user mit index 2 namen zu Mandy


    console.log(UserKeysArray );
    console.log(users);                                         //objekte bestehen aus id und user

    await addEditSingleUser()
}

async function addEditSingleUser(id=12, user={name:'pola'}) {
    putData(`namen/${id}`, user);    
}

async function getAllUsers(path){
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}