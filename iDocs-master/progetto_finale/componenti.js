import { handleNavigation,login_fetch,addNewPlaceToMap,addNewPlaceToTable,loadConfig,getCoordinates,carica_marker,deletePlace,updatePlaceInMap,updatePlaceInTable,removePlaceFromMap,removePlaceFromTable,addNewPlaceToHomepageTable,addCustomMarker } from "./function.js";
import {download,upload} from "./cache.js";
// Componente Mappa
let zoom = 5;  // Zoom per vedere l'Europa
let maxZoom = 19;
let map = L.map('map').setView([42.5, 13], zoom); // Centro sull'Europa

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
carica_marker(map)
 


 
// Componente tabella dinamica
// Funzione per creare la tabella con i dati scaricati
export function createTable() {
  const container = document.getElementById('table');

  // Recupera i dati dalla cache
  download()
    .then((places) => {
      // Inserisce i dati nella tabella
      container.innerHTML = `
        <input type="text" id="FiltroInput" placeholder="Cerca per luogo">
        <table width="50%" class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Luogo</th>
            </tr>
          </thead>
          <tbody>
            ${places
              .map(
                (place) => `
              <tr>
                <td>${place.id}</td>
                <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;

      // Aggiunge la funzionalità di filtro
      let filtroInput = document.getElementById('FiltroInput');
      filtroInput.oninput = function () {
        let filtro = this.value.toLowerCase();
        document.querySelectorAll('tbody tr').forEach((riga) => {
          if (riga.textContent.toLowerCase().includes(filtro)) {
            riga.style.display = '';
          } else {
            riga.style.display = 'none';
          }
        });
      };

      // Gestisce il cambio di hash
      window.onhashchange = handleNavigation;
    })
    .catch((error) => {
      console.error('Errore durante il download dei dati:', error);
      alert('Errore nel caricamento dei dati.');
    });
}


export function createTableAdmin() {
  const container = document.getElementById('tableAdmin');
  const isLoggedIn = Cookies.get('Username'); // Verifica se l'utente è loggato

  // Scarica i dati usando la funzione download
  download()
    .then((places) => {
      // Genera la tabella con i dati scaricati
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
            ${places
              .map(
                (place) => `
              <tr>
                <td>${place.id}</td>
                <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
                <td>${place.description}</td>
                <td><img class="imgAdmin" src="${place.img}" alt="${place.name}" /></td>
                <td class="azioni">
                  <div>
                    <button class="btn btn-warning" onclick="editPlace('${place.id}')">Modifica</button>
                  </div>
                  <div>
                    <button style="margin-top: 10px;" class="btn btn-danger" onclick="deletePlace('${place.id}')">Elimina</button>
                  </div>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;

      // Filtro per la ricerca
      let filtroInputAdmin = document.getElementById('FiltroInputAdmin');
      filtroInputAdmin.oninput = function () {
        let filtro = this.value.toLowerCase();
        document.querySelectorAll('tbody tr').forEach((riga) => {
          if (riga.textContent.toLowerCase().includes(filtro)) {
            riga.style.display = '';
          } else {
            riga.style.display = 'none';
          }
        });
      };

      window.onhashchange = handleNavigation; // Gestisce la navigazione con hash
    })
    .catch((error) => {
      console.error('Errore durante il download dei dati:', error);
      container.innerHTML = '<p>Errore nel caricamento dei dati. Riprova più tardi.</p>';
    });
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
          <input type="text" id="placeName" class="input_css" required />
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
            coords: location.coords,
          };

          // Recupera i luoghi esistenti dalla cache
          download()
            .then((places) => {
              places = places || [];  // Se non ci sono luoghi, usa un array vuoto
              places.push(newPlace);

              // Salva la lista aggiornata nella cache
              upload(places)
                .then(() => {
                  console.log("Luogo salvato nella cache con successo!");

                  // Aggiungi il luogo alla mappa
                  addCustomMarker(map, newPlace, newPlace.coords);

                  // Aggiungi il luogo alla tabella senza ricaricare la pagina
                  addNewPlaceToTable(newPlace);
                  addNewPlaceToHomepageTable(newPlace);

                  // Pulisce il form
                  formContainer.innerHTML = '';
                  formContainer.style.display = "none";
                  document.getElementById("overlay").style.display = "none";

                  alert("Luogo aggiunto con successo!");
                })
                .catch((error) => {
                  console.error("Errore durante il salvataggio nella cache:", error);
                });
            })
            .catch((error) => {
              console.error("Errore durante il recupero dei luoghi dalla cache:", error);
              alert("Si è verificato un errore. Controlla i dettagli.");
            });
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





