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

/* Detailierte Card
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
*/

async function fetchPokeJson() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
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
   
    container.addEventListener('click', function(event) {
        // Überprüfe, ob das geklickte Element der Container selbst ist oder nicht
        if (event.target === container) {
            // Setze alle Karten zurück, entferne die 'active-card' Klasse
            document.querySelectorAll('.pokemon-card').forEach(c => {
                c.classList.remove('active-card');
                c.classList.remove('inactive-card');
                c.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none');
                c.querySelector('table').style.display = 'none';
                c.style.opacity = '1.0';
            });
        }
    });

    // Iteration über jedes Pokémon, jetzt sortiert nach ID
    detailsResults.forEach(({ detailsJson, speciesJson }, index) => {
        
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        card.addEventListener('click', function(event) {
            event.stopPropagation();
            if (!this.classList.contains('active-card') && !this.classList.contains('inactive-card')) {
                // Deaktiviere alle anderen Karten
                document.querySelectorAll('.pokemon-card').forEach(c => {
                    c.classList.remove('active-card');
                    c.classList.add('inactive-card');
                    c.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none'); // Verstecke alle Panels
                    c.querySelector('table').style.display = 'none'; 
                    c.style.opacity = '0.5';
                });
                // Aktiviere diese Karte
                this.classList.add('active-card');
                this.classList.remove('inactive-card');
                this.querySelectorAll('.pokemon-info')[0].style.display = 'block'; // Zeigt nur das erste Panel (About)
                this.querySelector('table').style.display = 'flex'; // Zeigt die Tabelle an
                this.style.opacity = '1.0';
            
            } else if (this.classList.contains('inactive-card')) {
                // Setze alle Karten zurück
                document.querySelectorAll('.pokemon-card').forEach(c => {
                    c.classList.remove('active-card');
                    c.classList.remove('inactive-card');
                    c.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none');
                    c.querySelector('table').style.display = 'none';
                    c.style.opacity = '1.0';
                });
            }
            // Wenn die Karte bereits die Klasse 'active-card' hat, passiert nichts

        });
        addNavigationArrows(card, index, detailsResults.length); 
 

 

        const type = detailsJson.types[0].type.name; // Zugriff auf den primären Typ
        switch (type) {
            case 'grass':
                card.classList.add('bc_green');
                break;
            case 'fire':
                card.classList.add('bc_orange');
                break;
            case 'water':
                card.classList.add('bc_blue');
                break;
            case 'bug':
                card.classList.add('bc_yellow');
                break;
            case 'poison':
                card.classList.add('bc_red');
                break;
            case 'normal':
                card.classList.add('bc_beige');
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
        image.style.width = "70%"; // Bild nimmt die Hälfte der Karte ein
        image.style.marginTop = "-16px";
        image.style.marginBottom = "-16px";
        card.appendChild(image);

        // Tabelle direkt unter dem Bild jedes Pokémon
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>About</th><th>Breeding</th><th>Base Stats</th>`;
        headerRow.children[0].classList.add('active-tab'); // Markiere den About-Tab als aktiv
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.style.display = 'none'; // Setze die Tabelle auf unsichtbar beim Laden
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
        pokemonCell.style.display = 'none'; // Verstecken der Zelle initial
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

        container.appendChild(card);    
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

    function addNavigationArrows(card, index, total) {
        const leftArrow = document.createElement('div');
        leftArrow.className = 'arrow left';
        leftArrow.innerHTML = '&#9664;'; // Unicode für linken Pfeil
        leftArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(index - 1, total);
        });
    
        const rightArrow = document.createElement('div');
        rightArrow.className = 'arrow right';
        rightArrow.innerHTML = '&#9654;'; // Unicode für rechten Pfeil
        rightArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(index + 1, total);
        });
    
        card.appendChild(leftArrow);
        card.appendChild(rightArrow);
    }
    
    function navigate(newIndex, total) {
        const cards = document.querySelectorAll('.pokemon-card');
        const index = Math.max(0, Math.min(newIndex, total - 1)); // Sicherstellen, dass der Index gültig ist
    
        // Simuliere ein Klick-Event auf der Karte an der neuen Index-Position
        activateCard(index);
    }
    
    function activateCard(index) {
        const cards = document.querySelectorAll('.pokemon-card');
        cards.forEach((card, i) => {
            card.classList.remove('active-card', 'inactive-card');
            card.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none');
            card.querySelector('table').style.display = 'none';
            card.style.opacity = '0.5';
        });
    
        const activeCard = cards[index];
        activeCard.classList.add('active-card');
        activeCard.querySelectorAll('.pokemon-info')[0].style.display = 'block'; // Zeigt nur das erste Panel (About)
        activeCard.querySelector('table').style.display = 'flex'; // Zeigt die Tabelle an
        activeCard.style.opacity = '1.0';
    }
        

   
}

