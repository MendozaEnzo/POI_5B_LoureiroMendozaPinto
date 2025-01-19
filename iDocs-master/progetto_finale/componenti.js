import { handleNavigation,login_fetch,addNewPlaceToMap,addNewPlaceToTable,loadConfig,getCoordinates,addMarker,updatePlaceInMap,updatePlaceInTable,removePlaceFromMap,removePlaceFromTable } from "./function.js";
import {download,upload} from "./cache.js";
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
  const isLoggedIn = Cookies.get('Username'); // Verifica se l'utente è loggato

  const places = [
    { id: uuid.v4(), name: 'Piazza S. Fedele (Milano)', description: 'La chiesa di San Fedele è famosa...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' },
    { id: uuid.v4(), name: 'Colosseo (Roma)', description: 'Il Colosseo è un antico anfiteatro di Roma...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' },
    { id: uuid.v4(), name: 'Piazza del Duomo (Firenze)', description: 'La piazza del Duomo di Firenze è famosa per la cattedrale...', img: 'https://www.milanofree.it/images/stories/foto_storiche_milano/porta_venezia_1876_inaugurazione_ippovia_per_monza.jpg' }
  ];

  container.innerHTML = `
    <input type="text" id="FiltroInputAdmin" placeholder="Cerca per luogo">
    <table id="tableAdmin" width="50%" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Luogo</th>
          <th>Descrizione</th>
          <th>Immagine</th>
          <th class="azioni">Azioni</th>
        </tr>
      </thead>
      <tbody>
        ${places.map(place => `
          <tr>
            <td>${place.id}</td>
            <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
            <td>${place.description}</td>
            <td><img class="imgAdmin" src="${place.img}" alt="${place.name}" /></td>
            <td class="azioni">
                <button onclick="editPlace('${place.id}')">Modifica</button>
                <button onclick="deletePlace('${place.id}')">Elimina</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Filtro per la ricerca
  let filtroInputAdmin = document.getElementById('FiltroInputAdmin');
  filtroInputAdmin.oninput = function () {
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
                          document.querySelectorAll(".azioni").forEach(el =>
                            el.style.display = "block"
                          )
                          document.getElementById("login").style.display = "none";
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

// Componente Form di Aggiunta Luogo
export function createForm() {
  const formContainer = document.getElementById('form');
  const addButton = document.getElementById('add');

  addButton.onclick = () => {
      // Mostra il form per aggiungere il luogo
      formContainer.style.display = "block";
      document.getElementById("overlay").style.display = "block";
      formContainer.innerHTML = `
          <form id="addPlaceForm">
              <div>
                  <label for="placeName">Nome Luogo</label>
              </div>
              <div>
                  <input type="text" id="placeName" class="input_css"required />
              </div>
              <div>
                  <label for="placeDescription">Descrizione</label>
              </div>
              <div>
                  <textarea id="placeDescription" class="input_css" required></textarea>
              </div>
              <div>
                  <label for="placeImage">URL Immagine</label>
              </div>
              <div>
                  <input type="url" id="placeImage" class="input_css" required />
              </div>
              <div style="margin-top: 10px;">
                  <button type="button" class="btn btn-danger" id="cancelAdd">Annulla</button>
                  <button type="submit" class="btn btn-success">Aggiungi Luogo</button>
              </div>
          </form>
      `;

      // Gestisce l'annullamento del form
      document.getElementById('cancelAdd').onclick = () => {
          formContainer.innerHTML = ''; // Rimuove il form
          formContainer.style.display = "none";
          document.getElementById("overlay").style.display = "none";
      };

      // Gestisce il submit del form
      document.getElementById('addPlaceForm').onsubmit = (event) => {
          event.preventDefault();

          const name = document.getElementById('placeName').value;
          const description = document.getElementById('placeDescription').value;
          const img = document.getElementById('placeImage').value;

          // Ottiene le coordinate del luogo
          getCoordinates([name])
              .then((location) => {
                  // Crea l'oggetto del nuovo luogo
                  const newPlace = {
                      id: uuid.v4(),
                      name,
                      description,
                      img,
                      coords: location.coords
                  };

                  // Aggiunge il luogo alla tabella e alla mappa
                  addNewPlaceToTable(newPlace);
                  addMarker([newPlace]); // Aggiunge il marker alle mappe (homepage e admin)

                  // Recupera i luoghi dalla cache
                  download()
                      .then((cachedPlaces) => {
                          cachedPlaces = cachedPlaces || [];

                          // Aggiunge il nuovo luogo alla lista dei luoghi
                          cachedPlaces.push(newPlace);

                          // Salva i luoghi aggiornati nella cache
                          upload(cachedPlaces)
                              .then(() => {
                                  console.log("Luogo salvato nella cache con successo!");
                              })
                              .catch((error) => {
                                  console.error("Errore durante il salvataggio nella cache:", error);
                              });
                      })
                      .catch((error) => {
                          console.error("Errore durante il recupero dei luoghi dalla cache:", error);
                      });

                  // Pulisce il form
                  formContainer.innerHTML = '';
                  formContainer.style.display = "none";
                  document.getElementById("overlay").style.display = "none";

                  alert("Luogo aggiunto con successo!");
              })
              .catch((error) => {
                  console.error("Errore durante l'aggiunta del luogo:", error);
                  alert("Si è verificato un errore. Controlla i dettagli.");
              });
      };
  };
}

// Inizializza il form
createForm();



