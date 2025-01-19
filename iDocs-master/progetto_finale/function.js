import { upload,download } from "./cache.js";

// crea un gruppo di marker per il clustering sulla mappa con Leaflet
var markers = L.markerClusterGroup({
    // disabilita il raggruppamento (clustering) dei marker quando la mappa è zoomata al livello di zoom 1 o inferiore
    disableClusteringAtZoom: 1
});

//modifiche/elimina/calcola coordinate/aggiunta sulla mappa
//calcola coordinate
export const getCoordinates = (luogo) => {
    console.log(luogo);
    return new Promise((resolve) => {
        fetch("conf.json").then(r => r.json()).then(confData => {
            fetch(confData.geoUrl.replace("$LUOGO", luogo[0])).then(r => r.json()).then(data => {
                let object = { name: luogo[0], coords: [data[0].lat, data[0].lon] };
                console.log(object);
                resolve(object);
            })
        })
    })
};
//carica i marker salvati in cache
export function carica_marker(map) {
    download().then((places) => {
        places = places || []; // inizializza un array vuoto se non ci sono luoghi salvati
        console.log("Luoghi salvati:", places);

        //aggiunta marker
        places.forEach((place) => {
            if (Array.isArray(place.coords) && place.coords.length === 2) {
                const [lat, lng] = place.coords;

                // aggiunta il marker solo se le coordinate sono valide
                if (!isNaN(lat) && !isNaN(lng)) {
                    const marker = L.marker([parseFloat(lat), parseFloat(lng)]);
                    marker.bindPopup(`
                        <b>${place.name}</b><br>
                        ${place.description || "Nessuna descrizione disponibile."}
                    
                    `);

                    markers.addLayer(marker)

                    map.addLayer(markers);

                } else {
                    console.error(`Coordinate non numeriche per il luogo: ${JSON.stringify(place)}`);
                }
            } else {
                console.error(`Coordinate non valide per il luogo: ${JSON.stringify(place)}`);
            }
        });
    }).catch((error) => {
        console.error("Errore durante il download dei luoghi:", error);
    });
}
//aggiungi un marker sulla mappa
export function aggiunta_marker(map, newPlace, newCoords) {
    if (Array.isArray(newCoords) && newCoords.length === 2) {
      const [lat, lng] = newCoords;
  
      // aggiungiunta il marker solo se le coordinate sono valide
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([parseFloat(lat), parseFloat(lng)]);
        marker.bindPopup(`
          <b>${newPlace.name}</b><br>
          ${newPlace.description || "Nessuna descrizione disponibile."}
        `);

        markers.addLayer(marker)

        map.addLayer(markers);

      } else {
        console.error(`Coordinate non numeriche per il luogo: ${JSON.stringify(newPlace)}`);
      }
    } else {
      console.error(`Coordinate non valide per il luogo: ${JSON.stringify(newPlace)}`);
    }
  }
// Funzione per aggiungere il nuovo luogo alla mappa
export const aggiunta_mappa = (place) => {
    const marker = L.marker([place.coords[0], place.coords[1]]);
    marker.bindPopup(`
        <b>${place.name}</b><br>${place.description}
    `);

    markers.addLayer(marker)

    map.addLayer(markers);
};
//rimuove i marker 
export const removeMarker = () => {
    markers.clearLayers();
    carica_marker(map)
} 
//modifica i marker in mappa
export const modifica_mappa = (updatedPlace) => {
    if (!inizializzazione_mappa()) return;

    const lat = parseFloat(updatedPlace.coords[0]);
    const lon = parseFloat(updatedPlace.coords[1]);

    if (isNaN(lat) || isNaN(lon)) {
        console.error('Le coordinate non sono valide:', updatedPlace.coords);
        return;
    }

    let existingMarker = null;

    // Iterazione su tutti i layer per trovare un marker corrispondente
    window.map.eachLayer(layer => {
        if (
            'getLatLng' in layer && // Verifica che il layer abbia getLatLng
            'getPopup' in layer && // Verifica che il layer abbia getPopup
            layer.getPopup()?.getContent()?.includes(updatedPlace.id) // Controlla l'ID nel popup
        ) {
            existingMarker = layer;
        }
    });

    // Se esiste un marker, aggiornalo; altrimenti, aggiungine uno nuovo
    if (existingMarker) {
        existingMarker.setLatLng([lat, lon]);
        existingMarker.getPopup().setContent(`
            <b>${updatedPlace.name}</b><br>
            ${updatedPlace.description}<br>
            <img src="${updatedPlace.img}" alt="Image" style="width:100px;">
        `);
    } else {
        const newMarker = L.marker([lat, lon]);
        newMarker.bindPopup(`
            <b>${updatedPlace.name}</b><br>
            ${updatedPlace.description}<br>
            <img src="${updatedPlace.img}" alt="Image" style="width:100px;">
        `).openPopup();
        window.map.addLayer(newMarker);
    }
};

//rimuove il luogo sull mappa
export const rimuovi_marker = (placeId) => {
    // Rimuovi il marker corrispondente
    window.map.eachLayer(layer => {
        if (layer.getLatLng && layer.getPopup().getContent().includes(placeId)) {
            window.map.removeLayer(layer);
        }
        
    });
};
//check per inizializzazione mappa
const inizializzazione_mappa = () => {
    if (!window.map) {
        console.error("La mappa non è inizializzata correttamente.");
        return false; 
    }
    return true;
}



//controllo della navigazione
export const handleNavigation = () => {
    let hash = window.location.hash || "#homepage";
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");
    // verifica se l'URL contiene un hash che inizia con "#dettaglio_",
    if (hash.startsWith("#dettaglio_")) {
        let id = hash.replace("#dettaglio_", "");
        console.log("Detail ID:", id);
        showDetail(id);
        document.getElementById("dettaglio").style.display = "block";
    } else {
        document.querySelector(hash).style.display = "block";
    }
};
//pagina che mostra i dettagli 
export const showDetail = (id) => {
    console.log("ID ricevuto:", id); 
    download().then((places) => {
        places = places || []; 
        console.log("Luoghi salvati:", places); // Debug 
        const place = places.find(p => p.id === id);

        if (place) {
            document.getElementById('detailName').innerText = place.name;
            document.getElementById('detailDescription').innerText = place.description || "Nessuna descrizione disponibile.";
            document.getElementById('detailImage').src = place.img || "placeholder.jpg"; // Mostra un'immagine di default se manca
        } else {
            // mostra un messaggio di errore
            document.getElementById('detailName').innerText = 'Luogo non trovato';
            document.getElementById('detailDescription').innerText = 'Impossibile trovare i dettagli per questo luogo.';
        }
    }).catch((error) => {
        console.error("Errore durante il recupero dei luoghi:", error);
        document.getElementById('detailName').innerText = 'Errore';
        document.getElementById('detailDescription').innerText = 'Si è verificato un errore nel caricamento dei dettagli.';
    });
};



//funzionamento login
export function login_fetch(username, password) {
    return new Promise((resolve, reject) => {
        fetch("conf.json")
            .then(r => r.json())
            .then(confData => {
                if (!confData.token) {
                    console.error("Token non trovato in conf.json");
                    return;
                }

                
                return fetch("http://ws.cipiaceinfo.it/credential/login", { 
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "key": confData.token 
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
            })
            .then(r => r.json())
            .then(r => resolve(r.result)) 
            .catch(reject); 
    });
}
//funzione per la login
export function loadConfig() {
    return fetch('conf.json')
      .then(response => response.json())
      .then(config => config.tokenMap) // rrestituisce il tokenMap
      .catch(error => {
        console.error("Errore nel caricamento del file di configurazione:", error);
      });
  }


// Funzione per aggiungere il nuovo luogo alla tabella
export const add_mappa = (place) => {
    console.log("Aggiungendo luogo alla tabella:", place);    
    const container = document.getElementById('tableAdmin').querySelector('tbody');
    container.innerHTML += `
        <tr>
            <td>${place.id}</td>
            <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
            <td>${place.description}</td>
            <td><img class="imgAdmin" src="${place.img}" alt="${place.name}" /></td>
            <td>
                <button class="btn btn-warning" onclick="editPlace('${place.id}')">Modifica</button>
                <button style="margin-top: 10px;" class="btn btn-danger" onclick="deletePlace('${place.id}')">Elimina</button>
            </td>
        </tr>
    `;
};

// Funzione per aggiungere il nuovo luogo alla tabella della homepage
export const add_mappa_tabella = (place) => {
    const container = document.getElementById('table');
    container.innerHTML += `
        <tr>
                <td>${place.id}</td>
                <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
        </tr>
    `;
};
//funzione per modificare il luogo in tabella
export const mod_luogo_tabella = (updatedPlace) => {
    const rows = document.querySelectorAll('#tableAdmin tbody tr');
    rows.forEach(row => {
        const idCell = row.cells[0].textContent;
        if (idCell === updatedPlace.id) {
            row.cells[1].innerHTML = `<a href="#dettaglio_${updatedPlace.id}" class="detail-link">${updatedPlace.name}</a>`;
            row.cells[2].textContent = updatedPlace.description;
            row.cells[3].innerHTML = `<img class="imgAdmin" src="${updatedPlace.img}" alt="${updatedPlace.name}" />`;
        }
    });
};
//rimuove il luogo nella tabella
export const rimuovi_luogo_tabella = (placeId) => {
    const rows = document.querySelectorAll('#tableAdmin tbody tr');
    rows.forEach(row => {
        const idCell = row.cells[0].textContent;
        if (idCell === placeId) {
            row.remove();
        }
    });
};
//rimuove la il punto di interesse nella tabella del homapage
export const rimuovi_punto_tabella = (placeId) =>{
    const rows = document.querySelectorAll('#table tbody tr');
    rows.forEach(row => {
        const idCell = row.cells[0].textContent;
        if (idCell === placeId) {
            row.remove();
        }
    });
}
//modifica il punto di interesse nella tabella del homepage
export const modifica_punto_tabella = (updatedPlace) => {
    const rows = document.querySelectorAll('#table tbody tr');
    rows.forEach(row => {
        const idCell = row.cells[0].textContent;
        if (idCell === updatedPlace.id) {
            row.cells[1].innerHTML = `<a href="#dettaglio_${updatedPlace.id}" class="detail-link">${updatedPlace.name}</a>`;
        }
    });
};



// Funzione per creare e salvare un luogo con un ID unico persistente
export const crea_luogo = (name, description, coords, img) => {
    download().then((places) => {
        places = places || [];

        // Verifica se il luogo esiste già altrimenti crea un nuovo luogo
        const existingPlace = places.find(place => place.name === name);
        
        let place;
        
        if (existingPlace) {
            // Usa l'ID gia esistente se il luogo esiste già
            place = { 
                ...existingPlace, 
                name, 
                description, 
                coords, 
                img 
            };
        } else {
            place = { 
                id: uuid.v4(),
                name, 
                description, 
                coords, 
                img 
            };
            
            places.push(place);
        }

       
        upload(places).then(() => {
            console.log("Luogo salvato nella cache");

            
            add_mappa(place);
            aggiunta_mappa(place);
            add_mappa_tabella(place);  
        }).catch(error => {
            console.error("Errore durante il salvataggio nella cache:", error);
        });
    }).catch(error => {
        console.error("Errore durante il recupero dei luoghi dalla cache:", error);
    });
};
//modifica il posto
  export function editPlace(placeId) {
    const editContainer = document.getElementById('edit');

    editContainer.style.display = "block";
    document.getElementById("overlay").style.display = "block";
    editContainer.innerHTML = `
      <form id="editPlace">
        <div>
          <label for="placeName">Nome Luogo</label>
        </div>
        <div>
          <input type="text" id="placeNameEdit" class="input_css" required />
        </div>
        <div>
          <label for="placeDescription">Descrizione</label>
        </div>
        <div>
          <textarea id="placeDescriptionEdit" class="input_css" required></textarea>
        </div>
        <div>
          <label for="placeImage">URL Immagine</label>
        </div>
        <div>
          <input type="url" id="placeImageEdit" class="input_css" required />
        </div>
        <div style="margin-top: 10px;">
          <div>
            <button type="button" class="btn btn-danger" id="cancelEdit">Annulla</button>
          </div>
          <div>
            <button type="button" id="saveEdit" class="btn btn-warning">Modifica Luogo</button>
          </div>
        </div>
      </form>
    `;

    const nameEdit = document.getElementById("placeNameEdit");
    const descriptionEdit = document.getElementById("placeDescriptionEdit");
    const imgEdit = document.getElementById("placeImageEdit");

    download().then((places) => {
        places = places || [];
        const place = places.find(p => p.id === placeId);
        if (place) {
            nameEdit.value = place.name;
            descriptionEdit.value = place.description;
            imgEdit.value = place.img;
        }
    }).catch((error) => {
        console.error('Errore durante il download dei luoghi:', error);
    });

    document.getElementById('cancelEdit').onclick = () => {
        editContainer.innerHTML = '';
        editContainer.style.display = "none";
        document.getElementById("overlay").style.display = "none";
    };

    document.getElementById('saveEdit').onclick = () => {
        const updatedPlace = {
            id: placeId,
            name: nameEdit.value,
            description: descriptionEdit.value,
            img: imgEdit.value,
        };

        // calcola le nuove coordinate
        getCoordinates([updatedPlace.name]).then((location) => {
            updatedPlace.coords = location.coords;

            download().then((places) => {
                places = places || [];
                const placeIndex = places.findIndex(p => p.id === placeId);
                if (placeIndex !== -1) {
                    places[placeIndex] = updatedPlace;

                    upload(places).then(() => {
                        console.log('BAka.',places);
                        mod_luogo_tabella(updatedPlace);
                        modifica_punto_tabella(updatedPlace);
                        try {
                            modifica_mappa(updatedPlace); // tentativo di aggiornamento marker
                        } catch (error) {
                            console.warn("Errore durante l'aggiornamento del marker. Il resto è stato aggiornato.");
                        }

                        editContainer.innerHTML = '';
                        editContainer.style.display = "none";
                        document.getElementById("overlay").style.display = "none";
                        alert("Luogo modificato con successo!");
                    }).catch((error) => {
                        console.error('Errore durante l\'upload dei luoghi:', error);
                    });
                }
            }).catch((error) => {
                console.error('Errore durante il download dei luoghi:', error);
            });
        }).catch((error) => {
            console.error('Errore durante il calcolo delle coordinate:', error);
            alert("Errore durante il calcolo delle coordinate. Controlla il nome del luogo.");
        });
    };
}
//rende globale
window.editPlace = editPlace;
// Elimina un punto di interesse
export function deletePlace(placeId) {
    download().then((places) => {
      places = places || [];
  
      const placeIndex = places.findIndex(place => place.id === placeId);
      if (placeIndex !== -1) {
        const deletedPlace = places.splice(placeIndex, 1)[0];
        //rimuovi_marker(deletedPlace.id);
        rimuovi_luogo_tabella(deletedPlace.id);
        rimuovi_punto_tabella(deletedPlace.id);
  
        upload(places).then(() => {
          removeMarker()
          console.log('Luogo eliminato con successo');
        }).catch((error) => {
          console.error('Errore durante l\'upload dei luoghi aggiornati:', error);
        });
      }
    }).catch((error) => {
      console.error('Errore durante il download dei luoghi:', error);
    });
  }
//rende globale
window.deletePlace = deletePlace;
