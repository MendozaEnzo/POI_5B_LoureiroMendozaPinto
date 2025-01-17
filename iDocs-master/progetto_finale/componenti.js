import { handleNavigation } from "./function.js";



// Componente Mappa
let zoom = 6;  // Zoom per vedere l'Europa
let maxZoom = 19;
let map = L.map('map').setView([50, 10], zoom); // Centro sull'Europa

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

 


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
          <tr>
            <th>ID</th>
            <th>Luogo</th>
            <th>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          ${places.map(place => `
            <tr>
              <td>${place.id}</td>
              <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
              <td>${place.description}</td>
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
handleNavigation();

