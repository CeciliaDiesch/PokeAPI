document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars
        const searchString = document.getElementById('search-input').value.trim().toLowerCase();
        const buttonMore = document.getElementById('load-more');
        const container = document.getElementById('pokemon-container');
        container.innerHTML = '';
        if (searchString.length >= 3) {
            fetchPokeJsonSearch(searchString); // Ruft die angepasste Funktion auf
            buttonMore.style.display = 'none'; 
            container.style.alignItems = 'flex-start';
        } else if (searchString.length === 0) {
            fetchPokeJson(); // Lädt alle Pokémon, wenn das Suchfeld leer ist
            buttonMore.style.display = 'block';
            container.style.alignItems = 'stretch';
        } else {
            alert('Bitte geben Sie mindestens drei Buchstaben ein.');
        }
    });
});


async function fetchPokeJsonSearch(searchString) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // Erhöhen des Limits, um breitere Ergebnisse zu erhalten
    const response = await fetch(url);
    const responseAsJson = await response.json();
    const filteredResults = responseAsJson.results.filter(pokemon => pokemon.name.includes(searchString)).slice(0, 10); // Filtert und limitiert die Ergebnisse
    const detailsResults = await fetchDetails(filteredResults);
    const container = document.getElementById('pokemon-container');
    initializeContainerClick(container);
    // Iteration über jedes Pokémon, jetzt sortiert nach ID
    detailsResults.forEach((pokemonData, index) => createPokemonCard(pokemonData, index, detailsResults.length, container));
    // Kein Offset erhöhen, da keine Paginierung benötigt wird
}



let currentOffset = 0; // Globaler Offset, startet bei 0


async function fetchPokeJson(x) {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=24&offset=0";
    const response = await fetch(url);
    const responseAsJson = await response.json();
    const detailsResults = await fetchDetails(responseAsJson.results);
    const container = document.getElementById('pokemon-container');
    initializeContainerClick(container);
    // Iteration über jedes Pokémon, jetzt sortiert nach ID
    detailsResults.forEach((pokemonData, index) => createPokemonCard(pokemonData, index, detailsResults.length, container));
    currentOffset += 24; // Erhöhe den Offset für das nächste Laden
}


async function fetchDetails(results) {
    const detailPromises = results.map(async pokemon => {
        const detailsResponse = await fetch(pokemon.url);
        const detailsJson = await detailsResponse.json();
        const speciesResponse = await fetch(detailsJson.species.url);
        const speciesJson = await speciesResponse.json();
        return { detailsJson, speciesJson };
    });
    const detailsResults = await Promise.all(detailPromises);
    return detailsResults.sort((a, b) => a.detailsJson.id - b.detailsJson.id);
}

function initializeContainerClick(container) {
    container.addEventListener('click', event => {
        if (event.target === container) {
            resetAllCards();
        }
    });
}

function resetAllCards() {
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.classList.remove('active-card', 'inactive-card');
        hideDetails(card);
        card.style.opacity = '1.0';
    });
    document.body.classList.remove('no-scroll');
}

function hideDetails(card) {
    card.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none');
    card.querySelector('table').style.display = 'none';
}


function createPokemonCard({ detailsJson, speciesJson }, index, total, container) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    setupCardClick(card);
    addNavigationArrows(card, index, total); 
    addCardTypeColor(card, detailsJson);
    addCardID(card, detailsJson.id);
    addCardName(card, detailsJson.name);
    addCardType(card, detailsJson.types);
    addCardImage(card, detailsJson.sprites.front_default);
    const headerRow = addCardTable(card); // Empfängt headerRow von addCardTable
    const pokemonCell = addCardPokemonCell(card, detailsJson);
    const breedingCell = addCardBreedingCell(card, speciesJson);
    const abilitiesCell = addCardAbilitiesCell(card, detailsJson.stats);
    setupCardInfoListeners(card, headerRow, pokemonCell, breedingCell, abilitiesCell);
    
    container.appendChild(card); 
}

function setupCardClick(card) {
    card.addEventListener('click', function(event) {
        event.stopPropagation();
        if (!this.classList.contains('active-card') && !this.classList.contains('inactive-card')) {
            // Deaktiviere alle anderen Karten
            activateCard(this);      
        } else if (this.classList.contains('inactive-card')) {
            resetAllCards();
        }
    });
}


function addCardTypeColor(card, detailsJson) {
    const type = detailsJson.types[0].type.name; // Zugriff auf den primären Typ
    const typeClassMap = {
        'grass': 'bc_green',
        'fire': 'bc_orange',
        'water': 'bc_blue',
        'bug': 'bc_yellow',
        'poison': 'bc_red',
        'normal': 'bc_beige'
    };
    const typeClass = typeClassMap[type] || 'bc_default'; // Default-Klasse, falls der Typ nicht definiert ist
    card.classList.add(typeClass);
}

function addCardID(card, detailsJsonID){
        // ID des Pokémon oben rechts auf der Karte
        const idSpan = document.createElement('span');
        idSpan.textContent = `# ${detailsJsonID}`;
        idSpan.className = 'pokemon-id';  // CSS-Klasse für Styling
        card.appendChild(idSpan);
}

function addCardName(card, detailsJsonName) {
      // Name des Pokémon als Überschrift über das Bild
      const nameHeader = document.createElement('h3');
      nameHeader.textContent = detailsJsonName.charAt(0).toUpperCase() + detailsJsonName.slice(1).toLowerCase();
      card.appendChild(nameHeader);
}

function addCardType(card, detailsJsonType) {
            // Typen des Pokémon
        const typeContainer = document.createElement('div');
        typeContainer.className = 'pokemon-types';
        detailsJsonType.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type.type.name;
            typeSpan.className = 'type-badge';  // CSS-Klasse für Styling
            typeContainer.appendChild(typeSpan);
        });
        card.appendChild(typeContainer);
    
}

function addCardImage(card, imageUrl) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.style.width = "70%";
    image.style.marginTop = "-16px";
    image.style.marginBottom = "-16px";
    card.appendChild(image);
}

function addCardTable(card) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>About</th><th>Breeding</th><th>Base Stats</th>`;
    headerRow.children[0].classList.add('active-tab'); // Markiere den "About"-Tab als aktiv
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.style.display = 'none';
    card.appendChild(table);
    return headerRow;
}

function addCardPokemonCell(card, detailsJson) {
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
    pokemonCell.style.display = 'none'; // Initial verstecken
    card.appendChild(pokemonCell);
    return pokemonCell; // Gibt das erstellte Element zurück
}

function addCardBreedingCell(card, speciesJson) {
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
    return breedingCell;
}

function addCardAbilitiesCell(card, detailsJsonStats) {
        // Fähigkeiteninformationen
        const abilitiesCell = document.createElement('div');
        abilitiesCell.className = 'pokemon-info';
        abilitiesCell.innerHTML = `
            <table>
                <tr><td>HP:</td><td>${detailsJsonStats[0].base_stat}</td></tr>
                <tr><td>Attack:</td><td>${detailsJsonStats[1].base_stat}</td></tr>
                <tr><td>Defense:</td><td>${detailsJsonStats[2].base_stat}</td></tr>
                <tr><td>Sp. Atk:</td><td>${detailsJsonStats[3].base_stat}</td></tr>
                <tr><td>Sp. Def:</td><td>${detailsJsonStats[4].base_stat}</td></tr>
                <tr><td>Speed:</td><td>${detailsJsonStats[5].base_stat}</td></tr>
                <tr><td>Total:</td><td>${detailsJsonStats.reduce((sum, stat) => sum + stat.base_stat, 0)}</td></tr>
            </table>
        `;
        abilitiesCell.style.display = 'none'; // Verstecken der Zelle initial
        card.appendChild(abilitiesCell);
        return abilitiesCell;
}

function setupCardInfoListeners(card, headerRow, pokemonCell, breedingCell, abilitiesCell) {
    const headers = Array.from(headerRow.children); // Konvertieren der HTMLCollection in ein Array
    headerRow.children[0].addEventListener('click', () => toggleDisplay(pokemonCell, headers, 0));
    headerRow.children[1].addEventListener('click', () => toggleDisplay(breedingCell, headers, 1));
    headerRow.children[2].addEventListener('click', () => toggleDisplay(abilitiesCell, headers, 2));        

}




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
        const index = Math.max(0, Math.min(newIndex, total - 1)); // Sicherstellen, dass der Index gültig ist
    
        // Simuliere ein Klick-Event auf der Karte an der neuen Index-Position
        activateCard(index);
}

function activateCard(cardOrIndex) {
    const cards = document.querySelectorAll('.pokemon-card');
    const activeCard = typeof cardOrIndex === 'number' ? cards[cardOrIndex] : cardOrIndex;


    // Deaktiviere alle Karten und verstecke ihre Inhalte
    cards.forEach(card => {
        card.classList.remove('active-card');
        card.classList.add('inactive-card');
        card.querySelectorAll('.pokemon-info').forEach(info => info.style.display = 'none');
        card.querySelector('table').style.display = 'none';
        card.style.opacity = card === activeCard ? '1.0' : '0.5';
    });

    // Aktiviere die ausgewählte Karte
    activeCard.classList.add('active-card');
    activeCard.classList.remove('inactive-card');
    activeCard.querySelector('table').style.display = 'flex'; // Zeigt die Tabelle an


    activeCard.querySelectorAll('th').forEach((header, idx) => header.classList.toggle('active-tab', idx === 0));
    activeCard.querySelectorAll('.pokemon-info').forEach((info, idx) => info.style.display = idx === 0 ? '' : 'none');
    document.body.classList.add('no-scroll');
}
        

   
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('load-more').addEventListener('click', async function() {
        this.disabled = true;  // Deaktiviere den Button, um mehrfache Klicks zu verhindern
        displayLoadingScreen(true); // Zeige Ladeanzeige

        await fetchPokeJson(); // Lade die nächste Charge Pokémon basierend auf dem aktuellen Offset

        displayLoadingScreen(false); // Verberge Ladeanzeige
        this.disabled = false;  // Aktiviere den Button nach dem Laden wieder
    });
});

function displayLoadingScreen(display) {
    const loadingScreen = document.getElementById('loading-screen');
    if (display) {
        loadingScreen.style.display = 'block';
    } else {
        loadingScreen.style.display = 'none';
    }
}



