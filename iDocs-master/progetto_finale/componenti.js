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
 function createTable() {
    const container = document.getElementById('table');
    
    // Dati fittizi dei luoghi
    const places = [
      { id: 1, name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...' },
      { id: 2, name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...' },
      { id: 3, name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...' }
    ];
    
    // Crea la tabella con il filtro
    let tableHtml = `
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
    container.innerHTML = tableHtml;
  
    // Filtro
    document.getElementById('FiltroInput').addEventListener('input', function() {
      const filter = this.value.toLowerCase();
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
    
    // Gestisci il cambiamento dell'URL per il dettaglio
    window.addEventListener('hashchange', function() {
      const hash = window.location.hash;
      const id = hash.replace('#dettaglio_', '');
  
      if (id) {
        showDetail(id);
      }
    });
  
    // Mostra il dettaglio in base all'ID
    function showDetail(id) {
      const place = places.find(p => p.id == id);
      if (place) {
        const detailContainer = document.getElementById('dettaglio-container');
        detailContainer.innerHTML = `
          <h2>${place.name}</h2>
          <p>${place.description}</p>
        `;
      }
    }
  }
  
  
  createTable();
