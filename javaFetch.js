async function fetchDataJson() {
    let response = await fetch('db.json');  //man kann in fetch ein URL oder ein Objekt
    let responseAsJson = await response.json();
    console.log(responseAsJson);    
}

/*async mit await*/
async function fetchDataText() {
    let response = await fetch('h1.txt'); 
    let responseAsText = await response.text();
    document.getElementById("content").innerHTML = responseAsText 
}

/* Alternative mit then
function fetchDataText(){
    fetch('h1.txt')
    .then((response) => response.text())
    .then(responseAsText => {
        document.getElementById("content").innerHTML = responseAsText;
    })
    .catch(error => console.log('Fehler beim Laden:', error));
}*/

/* Get fruit und log sie aus in console als json */
async function fetchPokeJsonConsole() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5&offset=2");  //man kann in fetch ein URL oder ein Objekt
    let responseAsJson = await response.json();
    console.log(responseAsJson);  
}

/*
 async function fetchFruitText() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5&offset=2");
    let responseAsText = await response.text();
    document.getElementById("content").innerHTML = responseAsText
}
    */

/*Fruit einfache Tabelle
async function fetchFruitText() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5&offset=2");
    let fruits = await response.json();  // Daten als JSON erhalten

    let table = document.getElementById("content");
    let html = "<table>";  // Start der Tabelle
    html += "<tr><th>Name</th><th>Genus</th><th>Family</th><th>Order</th></tr>";  // Kopfzeile der Tabelle

    // Jede Frucht als Zeile hinzufügen
    fruits.forEach(fruit => {
        html += `<tr>
                   <td>${fruit.name}</td>
                   <td>${fruit.genus}</td>
                   <td>${fruit.family}</td>
                   <td>${fruit.order}</td>
                 </tr>`;
    });

    html += "</table>";  // Ende der Tabelle
    table.innerHTML = html;  // HTML in das Element einfügen
}
*/

async function createDynamicTable() {
    try {
        // JSON-Daten laden
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5&offset=2");
        const jsonData = await response.json();

        // Eine neue Tabelle erstellen
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        // Kopfzeile erstellen, basierend auf Schlüsseln des ersten Objekts
        if (jsonData.length > 0) {
            const firstItemKeys = Object.keys(jsonData[0]);
            const headerRow = document.createElement('tr');
            firstItemKeys.forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
        }

        // Zeilen mit Daten hinzufügen
        jsonData.forEach(item => {
            const row = document.createElement('tr');
            Object.keys(item).forEach(key => {
                const td = document.createElement('td');
                td.textContent = item[key];
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        // Tabelle zum Dokument hinzufügen
        document.getElementById('content').appendChild(table);

    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

/*Am meisten benutzte zusätzliche Angaben beim fetch

const response = await fetch("https://example.org/post", {
  method: "Get",    //*GET, POST, PUT, DELETE, etc. wir benutzen anfangs meist Get um Daten zu bekommen
  body: JSON.stringify({ username: "example" }),    //body data type must match "Content-Type" header
  headers: myHeaders, {"Content-Type": "application/json"}
});
return response.json();
*/

