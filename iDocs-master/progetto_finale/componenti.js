// Componente Mappa
let places = [
    {
       name: "Piazza del Duomo",
       coords: [45.4639102, 9.1906426]
    },
    {
       name: "Darsena",
       coords: [45.4536286, 9.1755852]
    },
    {
       name: "Parco Lambro",
       coords: [45.4968296, 9.2505173]
    },
    {
       name: "Stazione Centrale",
       coords: [45.48760768, 9.2038215]
    }
 ];
 let zoom = 12;
 let maxZoom = 19;
 let map = L.map('map').setView(places[0].coords, zoom);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 }).addTo(map);
 places.forEach((place) => {
    const marker = L.marker(place.coords).addTo(map);
    marker.bindPopup(`<b>${place.name}</b>`);
 });
 


 //componte tabella dinamica 
// Componente tabella dinamica
function createTable() {
    const container = document.getElementById('table');

    const places = [
        { id: 1, name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...' },
        { id: 2, name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...' },
        { id: 3, name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...' }
    ];

    container.innerHTML = `
      <input type="text" id="FiltroInput" placeholder="Cerca per luogo">
      <table class="table table-striped">
        <thead>
          <tr><th>Luogo</th></tr>
        </thead>
        <tbody>
          ${places.map(place => `
            <tr>
              <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    let filtroInput = document.getElementById('FiltroInput');

    filtroInput.oninput = function() {
        let filtro = this.value.toLowerCase();
        document.querySelectorAll('tbody tr').forEach(riga => {
            if (riga.textContent.toLowerCase().includes(filtro)) {
                riga.style.display = '';
            } else {
                riga.style.display = 'none';
            }
        });
    };

    window.onhashchange = handleNavigation;
}

createTable();


// Funzione per gestire la navigazione tra le pagine
function handleNavigation() {
    let hash = window.location.hash || "#homepage";
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");

    if (hash.startsWith("#dettaglio_")) {
        let id = hash.replace("#dettaglio_", "");
        showDetail(id);
        document.getElementById("dettaglio").style.display = "block";
    } else {
        document.querySelector(hash).style.display = "block";
    }
}

// Funzione per mostrare il dettaglio
function showDetail(id) {
    const places = [
        { id: 1, name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...' },
        { id: 2, name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...' },
        { id: 3, name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...' }
    ];
    
    let place = places.find(p => p.id == id);
    if (place) {
        document.getElementById("dettaglio").innerHTML = `
            <nav class="flex-container">
                <div>
                    <a href="#homepage"><button class="btn btn-danger">Home</button></a>
                </div>
            </nav>
            <div class="container">
                <h1>${place.name}</h1>
                <p>${place.description}</p>
            </div>
        `;
    }
}

createTable();
handleNavigation();