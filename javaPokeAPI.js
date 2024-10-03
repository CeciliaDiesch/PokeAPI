/* Ohne promise funktion

async function fetchPokeJson() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=5&offset=2";
    const response = await fetch(url);
    const responseAsJson = await response.json();

    const container = document.getElementById('pokemon-container');

    responseAsJson.results.forEach(async (pokemon) => {         //responseAsJson.results ist eine Array Struktur, die von der Anfrage fetch(url) zurückgegeben wird. Jedes Elem im Array repräsentiert ein Pokemon 
        const detailsResponse = await fetch(pokemon.url);
        const detailsJson = await detailsResponse.json();

        const speciesResponse = await fetch(detailsJson.species.url);
        const speciesJson = await speciesResponse.json();

        // Erstellen eines Kartencontainers für jedes Pokémon
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        
        // ID des Pokémon oben rechts auf der Karte
        const idSpan = document.createElement('span');
        idSpan.textContent = `# ${detailsJson.id}`;
        idSpan.className = 'pokemon-id';  // CSS-Klasse für Styling
        card.appendChild(idSpan);

        // Name des Pokémon als Überschrift über das Bild
        const nameHeader = document.createElement('h3');
        nameHeader.textContent = pokemon.name;
        card.appendChild(nameHeader);

        // Typen des Pokémon
        const typeContainer = document.createElement('div');
        typeContainer.className = 'pokemon-types';
        detailsJson.types.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type.type.name;
            typeSpan.className = 'type-badge';  // CSS-Klasse für Styling
            typeContainer.appendChild(typeSpan);
        });
        card.appendChild(typeContainer);

        // Bild des Pokémon
        const image = document.createElement('img');
        image.src = detailsJson.sprites.front_default;
        image.style.width = "50%"; // Bild nimmt die Hälfte der Karte ein
        card.appendChild(image);

        // Tabelle direkt unter dem Bild jedes Pokémon
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>About</th><th>Breeding</th><th>Base Stats</th>`;
        thead.appendChild(headerRow);
        table.appendChild(thead);
        card.appendChild(table);

        // Grundinformationen über das Pokémon
        const pokemonCell = document.createElement('div');
        pokemonCell.className = 'pokemon-info';
        pokemonCell.innerHTML = `
            <table>
                <tr><td>Height:</td><td>${detailsJson.height / 10} m</td></tr>
                <tr><td>Weight:</td><td>${detailsJson.weight / 10} kg</td></tr>
                <tr><td>Base Exp.:</td><td>${detailsJson.base_experience}</td></tr>
                <tr><td>Skills:</td><td>${detailsJson.abilities.map(a => a.ability.name).join(', ')}</td></tr>
                </table>
        `;
        pokemonCell.style.display = ''; // Verstecken der Zelle initial
        card.appendChild(pokemonCell);

        // Zuchtinformationen
        const breedingCell = document.createElement('div');
        breedingCell.className ='pokemon-info';
        breedingCell.innerHTML = `
            <table>
                <tr><td>Gender Ratio:</td><td>${speciesJson.gender_rate >= 0 ? (speciesJson.gender_rate * 12.5) + '% female' : 'Unknown'}</td></tr>
                <tr><td>Egg Groups:</td><td>${speciesJson.egg_groups.map(group => group.name).join(', ')}</td></tr>
                <tr><td>Egg Cycle:</td><td>${speciesJson.hatch_counter}</td></tr>
            </table>
        `;
        breedingCell.style.display = 'none'; // Verstecken der Zelle initial
        card.appendChild(breedingCell);

        // Fähigkeiteninformationen
        const abilitiesCell = document.createElement('div');
        abilitiesCell.className = 'pokemon-info';
        abilitiesCell.innerHTML = `
            <table>
                <tr><td>HP:</td><td>${detailsJson.stats[0].base_stat}</td></tr>
                <tr><td>Attack:</td><td>${detailsJson.stats[1].base_stat}</td></tr>
                <tr><td>Defense:</td><td>${detailsJson.stats[2].base_stat}</td></tr>
                <tr><td>Sp. Atk:</td><td>${detailsJson.stats[3].base_stat}</td></tr>
                <tr><td>Sp. Def:</td><td>${detailsJson.stats[4].base_stat}</td></tr>
                <tr><td>Speed:</td><td>${detailsJson.stats[5].base_stat}</td></tr>
                <tr><td>Total:</td><td>${detailsJson.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</td></tr>
            </table>
        `;
        abilitiesCell.style.display = 'none'; // Verstecken der Zelle initial
        card.appendChild(abilitiesCell);

        //tbody.appendChild(row);
        //table.appendChild(tbody);
        container.appendChild(card);

        // Event-Listener für die Überschriften
        headerRow.children[0].addEventListener('click', () => toggleDisplay(pokemonCell));
        headerRow.children[1].addEventListener('click', () => toggleDisplay(breedingCell));
        headerRow.children[2].addEventListener('click', () => toggleDisplay(abilitiesCell));
    });

    function toggleDisplay(element) {
        // Elemente der gleichen Reihe ausblenden
        element.parentNode.querySelectorAll('.pokemon-info').forEach(cell => {
            cell.style.display = 'none';
        });
        // Angeklicktes Element einblenden
        element.style.display = element.style.display === 'none' ? '' : 'none';
    }
}

*/
/*
function toggleDisplay(element) {
    const allInfos = element.parentNode.querySelectorAll('.pokemon-info');
    const headers = element.parentNode.parentNode.querySelector('thead tr').children; // Zugriff auf alle Th-Elemente
    // Alle Elemente ausblenden und Header-Hintergrund entfernen
    allInfos.forEach((cell, index) => {
        cell.style.display = 'none';
        headers[index].style.backgroundColor = ''; // Hintergrund entfernen
    });
    // Angeklicktes Element einblenden und Header-Hintergrund setzen
    element.style.display = element.style.display === 'none' ? '' : 'none';
    if (element.style.display === '') {
        const idx = Array.from(allInfos).indexOf(element); // Index des aktuellen Elements finden
        headers[idx].style.backgroundColor = 'grey'; // Hintergrund des entsprechenden Headers setzen
    }
}
    und im css th.active-header {
    background-color: grey;
}
    */

async function fetchPokeJson() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=5&offset=2";
    const response = await fetch(url);
    const responseAsJson = await response.json();

    const container = document.getElementById('pokemon-container');


 // Erstellen eines Promises für jeden Detailaufruf und zusätzliche Abfrage der Species-Informationen
    const detailPromises = responseAsJson.results.map(async pokemon => {
        const detailsResponse = await fetch(pokemon.url);
        const detailsJson = await detailsResponse.json();
        const speciesResponse = await fetch(detailsJson.species.url);
        const speciesJson = await speciesResponse.json();
        return { detailsJson, speciesJson };
    });

    // Warten auf alle Promises, bevor mit der Verarbeitung fortgefahren wird
    const detailsResults = await Promise.all(detailPromises);
    // Sortieren der Ergebnisse nach Pokémon-ID
    detailsResults.sort((a, b) => a.detailsJson.id - b.detailsJson.id);

    // Iteration über jedes Pokémon, jetzt sortiert nach ID
    detailsResults.forEach(({ detailsJson, speciesJson }) => {

    // Erstellen eines Kartencontainers für jedes Pokémon
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Typabhängige Hintergrundfarbe einstellen
    const type = detailsJson.types[0].type.name; // Zugriff auf den primären Typ
     switch (type) {
        case 'grass':
            card.classList.add('bc_green');
            break;
        case 'fire':
            card.classList.add('bc_red');
            break;
        case 'water':
            card.classList.add('bc_blue');
            break;
    }

        
        // ID des Pokémon oben rechts auf der Karte
        const idSpan = document.createElement('span');
        idSpan.textContent = `# ${detailsJson.id}`;
        idSpan.className = 'pokemon-id';  // CSS-Klasse für Styling
        card.appendChild(idSpan);

        // Name des Pokémon als Überschrift über das Bild
        const nameHeader = document.createElement('h3');
        nameHeader.textContent = detailsJson.name.charAt(0).toUpperCase() + detailsJson.name.slice(1).toLowerCase();
        card.appendChild(nameHeader);

        // Typen des Pokémon
        const typeContainer = document.createElement('div');
        typeContainer.className = 'pokemon-types';
        detailsJson.types.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type.type.name;
            typeSpan.className = 'type-badge';  // CSS-Klasse für Styling
            typeContainer.appendChild(typeSpan);
        });
        card.appendChild(typeContainer);

        // Bild des Pokémon
        const image = document.createElement('img');
        image.src = detailsJson.sprites.front_default;
        image.style.width = "50%"; // Bild nimmt die Hälfte der Karte ein
        card.appendChild(image);

        // Tabelle direkt unter dem Bild jedes Pokémon
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>About</th><th>Breeding</th><th>Base Stats</th>`;
        headerRow.children[0].classList.add('active-tab'); // Markiere den About-Tab als aktiv
        thead.appendChild(headerRow);
        table.appendChild(thead);
        card.appendChild(table);

      

        // Grundinformationen über das Pokémon
        const pokemonCell = document.createElement('div');
        pokemonCell.className = 'pokemon-info';
        pokemonCell.innerHTML = `
            <table>
                <tr><td>Height:</td><td>${detailsJson.height / 10} m</td></tr>
                <tr><td>Weight:</td><td>${detailsJson.weight / 10} kg</td></tr>
                <tr><td>Base Exp.:</td><td>${detailsJson.base_experience}</td></tr>
                <tr><td>Skills:</td><td>${detailsJson.abilities.map(a => a.ability.name).join(', ')}</td></tr>
                </table>
        `;
        pokemonCell.style.display = ''; // Verstecken der Zelle initial
        card.appendChild(pokemonCell);

        // Zuchtinformationen
        const breedingCell = document.createElement('div');
        breedingCell.className ='pokemon-info';
        breedingCell.innerHTML = `
            <table>
                <tr><td>Gender Ratio:</td><td>${speciesJson.gender_rate >= 0 ? (speciesJson.gender_rate * 12.5) + '% female' : 'Unknown'}</td></tr>
                <tr><td>Egg Groups:</td><td>${speciesJson.egg_groups.map(group => group.name).join(', ')}</td></tr>
                <tr><td>Egg Cycle:</td><td>${speciesJson.hatch_counter}</td></tr>
            </table>
        `;
        breedingCell.style.display = 'none'; // Verstecken der Zelle initial
        card.appendChild(breedingCell);

        // Fähigkeiteninformationen
        const abilitiesCell = document.createElement('div');
        abilitiesCell.className = 'pokemon-info';
        abilitiesCell.innerHTML = `
            <table>
                <tr><td>HP:</td><td>${detailsJson.stats[0].base_stat}</td></tr>
                <tr><td>Attack:</td><td>${detailsJson.stats[1].base_stat}</td></tr>
                <tr><td>Defense:</td><td>${detailsJson.stats[2].base_stat}</td></tr>
                <tr><td>Sp. Atk:</td><td>${detailsJson.stats[3].base_stat}</td></tr>
                <tr><td>Sp. Def:</td><td>${detailsJson.stats[4].base_stat}</td></tr>
                <tr><td>Speed:</td><td>${detailsJson.stats[5].base_stat}</td></tr>
                <tr><td>Total:</td><td>${detailsJson.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</td></tr>
            </table>
        `;
        abilitiesCell.style.display = 'none'; // Verstecken der Zelle initial
        card.appendChild(abilitiesCell);

        //tbody.appendChild(row);
        //table.appendChild(tbody);
        container.appendChild(card);

        // Event-Listener für die Überschriften
        const headers = Array.from(headerRow.children); // Konvertieren der HTMLCollection in ein Array
        headerRow.children[0].addEventListener('click', () => toggleDisplay(pokemonCell, headers, 0));
        headerRow.children[1].addEventListener('click', () => toggleDisplay(breedingCell, headers, 1));
        headerRow.children[2].addEventListener('click', () => toggleDisplay(abilitiesCell, headers, 2));
    });

    function toggleDisplay(element, headers, index) {
        // Elemente der gleichen Reihe ausblenden
        element.parentNode.querySelectorAll('.pokemon-info').forEach(cell => {
            cell.style.display = 'none';
    
        });
    
        // Entfernen der active-tab Klasse von allen Headers und Hinzufügen zu dem aktuellen
        headers.forEach((header, idx) => {
            if (index === idx) {
                header.classList.add('active-tab');
            } else {
                header.classList.remove('active-tab');
            }
        });
    
        // Angeklicktes Element einblenden oder ausblenden
        element.style.display = element.style.display === 'none' ? '' : 'none';
    }
    
}


