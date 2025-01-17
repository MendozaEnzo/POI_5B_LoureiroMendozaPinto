import { handleNavigation,login_fetch,addNewPlaceToMap,addNewPlaceToTable,loadConfig } from "./function.js";

// Componente Mappa
let zoom = 5;  // Zoom per vedere l'Europa
let maxZoom = 19;
let map = L.map('map').setView([42.5, 13], zoom); // Centro sull'Europa

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

 


 
// Componente tabella dinamica
export function createTable() {
  const container = document.getElementById('table');

  const places = [
      { id: uuid.v4(), name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...' },
      { id: uuid.v4(), name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...' },
      { id: uuid.v4(), name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...' }
  ];

  container.innerHTML = `
    <input type="text" id="FiltroInput" placeholder="Cerca per luogo">
    <table widht="50%" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Luogo</th>
        </tr>
      </thead>
      <tbody>
        ${places.map(place => `
          <tr>
            <td>${place.id}</td>
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

export function createTableAdmin() {
  const container = document.getElementById('tableAdmin');

  const places = [
      { id: uuid.v4(), name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' },
      { id: uuid.v4(), name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' },
      { id: uuid.v4(), name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' }
  ];

  container.innerHTML = `
    <input type="text" id="FiltroInputAdmin" placeholder="Cerca per luogo">
    <table widht="50%" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Luogo</th>
          <th>Descrizione</th>
          <th>Immagine</th>
        </tr>
      </thead>
      <tbody>
        ${places.map(place => `
          <tr>
            <td>${place.id}</td>
            <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
            <td>${place.description}</td>
            <td><img class="imgAdmin" src="${place.img}" alt="${place.name}" /></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  let filtroInputAdmin = document.getElementById('FiltroInputAdmin');

  filtroInputAdmin.oninput = function() {
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

createTableAdmin();
createTable();
handleNavigation();


export const createLogin = (elem) => {
  let data;
  let element = elem;
  let callback;
  return {
      setLabels: (labels) => { data = labels; },
      setCallback: (f) => { callback = f; },
      render: () => {
          element.innerHTML = data.map(([label, type]) => {
              return `<div>${label}</div><div><input id="${label}" class="input_css" type="${type}"></div>`;
          }).join('');

          element.innerHTML += `<button style="margin-right: 10px; margin-top: 10px;" class="btn btn-danger" id="chiudi_login">Chiudi</button>`;
          element.innerHTML += `<button style="margin-top: 10px;" class="btn btn-primary" id="invia_login">Accedi</button>`;

          document.getElementById("chiudi_login").onclick = () => {
              elem.style.display = "none";
              document.getElementById("overlay").style.display = "none";
          };

          document.getElementById("invia_login").onclick = () => {
              const username = document.getElementById("Username").value;
              const password = document.getElementById("Password").value;

              login_fetch(username, password)
                  .then((isValid) => {
                      if (isValid) {
                          document.getElementById("add").style.display = "block";
                          elem.style.display = "none";
                          document.getElementById("overlay").style.display = "none";
                          console.log("Accesso riuscito!");
                          alert("Benvenuto!");

                          Cookies.set('Username',username)
                          Cookies.set('Password',password)
                          console.log(document.cookie)

                          data.forEach(([label]) => {
                              document.getElementById(label).value = "";
                          });

                      } else {
                          console.log("Accesso fallito. Credenziali errate.");
                          alert("Accesso negato. Controlla le credenziali.");
                          data.forEach(([label]) => {
                              document.getElementById(label).value = "";
                          });
                      }
                  })
                  .catch((error) => {
                      console.error("Errore durante il login:", error);
                      alert("Si è verificato un errore. Riprova più tardi.");
                  });
          };
      },
  };
};

// Componente Form di Aggiunta Luogo

export function createForm() {
  const formContainer = document.getElementById('form');
  const addButton = document.getElementById('add');

  addButton.onclick = () => {
    // Mostra il form per aggiungere il luogo
    formContainer.innerHTML = `
      <h3>Aggiungi un nuovo luogo</h3>
      <form id="addPlaceForm">
          <div>
              <label for="placeName">Nome Luogo</label>
              <input type="text" id="placeName" required />
          </div>
          <div>
              <label for="placeDescription">Descrizione</label>
              <textarea id="placeDescription" required></textarea>
          </div>
          <div>
              <label for="placeImage">URL Immagine</label>
              <input type="url" id="placeImage" required />
          </div>
          <div>
              <button type="submit" class="btn btn-success">Aggiungi Luogo</button>
              <button type="button" class="btn btn-danger" id="cancelAdd">Annulla</button>
          </div>
      </form>
    `;

    // Annulla l'aggiunta e chiudi il form
    document.getElementById('cancelAdd').onclick = () => {
        formContainer.innerHTML = '';  // Rimuove il form
    };

    // Gestisci il submit del form
    document.getElementById('addPlaceForm').onsubmit = (event) => {
        event.preventDefault();

        const name = document.getElementById('placeName').value;
        const description = document.getElementById('placeDescription').value;
        const image = document.getElementById('placeImage').value;

        // Carica il tokenMap dal file di configurazione
        loadConfig()
            .then(tokenMap => {
                if (!tokenMap) {
                    alert("Token di geocodifica mancante!");
                    return;
                }

                // Crea una promessa per geocodificare il nome del luogo
                let placeQuery = `${name}, Europa`;  // Aggiungi un paese per geocodificare meglio
                let url = `https://us1.locationiq.com/v1/search?key=${tokenMap}&q=${encodeURIComponent(placeQuery)}&format=json`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            throw new Error("Impossibile geocodificare il luogo");
                        } else {
                            const lat = data[0].lat;
                            const lon = data[0].lon;
                            return { lat, lon };
                        }
                    })
                    .then(location => {
                        // Una volta che la promessa è risolta, crea il nuovo luogo
                        const newPlace = { 
                            id: uuid.v4(), 
                            name, 
                            description, 
                            img: image,
                            coords: [location.lat, location.lon]  // Usa le coordinate ottenute
                        };

                        // Aggiungi il nuovo luogo alla tabella e mappa
                        addNewPlaceToTable(newPlace);
                        addNewPlaceToMap(newPlace);

                        // Pulisci il form dopo l'aggiunta
                        formContainer.innerHTML = '';
                        alert("Luogo aggiunto con successo!");
                    })
                    .catch(err => {
                        console.error("Errore durante l'aggiunta del luogo:", err);
                        alert("Si è verificato un errore. Controlla i dettagli.");
                    });
            })
            .catch(err => {
                console.error("Errore nel caricamento del token:", err);
            });
    };
  };
}


// Inizializza il form
createForm();
