

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

export const addMarker = (places) => {
    places.forEach((place) => {
        const marker = L.marker(place.coords).addTo(map);
        marker.bindPopup(`
            <b>${place.name}</b><br>
        `);
    });
}

export const handleNavigation = () => {
    let hash = window.location.hash || "#homepage";
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");

    if (hash.startsWith("#dettaglio_")) {
        let id = hash.replace("#dettaglio_", "");
        console.log("Detail ID:", id); // Debug ID
        showDetail(id);
        document.getElementById("dettaglio").style.display = "block";
    } else {
        document.querySelector(hash).style.display = "block";
    }
};

export const showDetail = (id) => {
    console.log("ID ricevuto:", id); 
    // Recupera la lista dei luoghi dal localStorage (se già salvati)
    const places = JSON.parse(localStorage.getItem('places')) || [];
    console.log("Luoghi salvati:", places);  // Log dei luoghi per il debug

    // Trova il luogo che corrisponde all'ID
    const place = places.find(p => p.id === id);
    console.log("Luogo trovato:", place);
    if (place) {
        document.getElementById('detailName').innerText = place.name;
        document.getElementById('detailDescription').innerText = place.description;
    } else {
        document.getElementById('detailName').innerText = 'Luogo non trovato';
        document.getElementById('detailDescription').innerText = 'Impossibile trovare i dettagli per questo luogo.';
    }
};

export function login_fetch(username, password) {
    return new Promise((resolve, reject) => {
        // Leggi il token dal file conf.json
        fetch("conf.json")
            .then(r => r.json())
            .then(confData => {
                if (!confData.token) {
                    throw new Error("Token non trovato in conf.json");
                }

                // Esegui la richiesta di login usando il token
                return fetch("http://ws.cipiaceinfo.it/credential/login", { 
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "key": confData.token // Usa il token letto da conf.json
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
            })
            .then(r => r.json())
            .then(r => resolve(r.result)) // Restituisci il risultato della richiesta
            .catch(reject); // Gestisci eventuali errori
    });
}
// Funzione per aggiungere il nuovo luogo alla tabella
export const addNewPlaceToTable = (place) => {
    const container = document.getElementById('tableAdmin').querySelector('tbody');
    container.innerHTML += `
        <tr>
            <td>${place.id}</td>
            <td><a href="#dettaglio_${place.id}" class="detail-link">${place.name}</a></td>
            <td>${place.description}</td>
            <td><img class="imgAdmin" src="${place.img}" alt="${place.name}" /></td>
        </tr>
    `;
};

// Funzione per aggiungere il nuovo luogo alla mappa
export const addNewPlaceToMap = (place) => {
    const marker = L.marker([place.coords[0], place.coords[1]]).addTo(map);
    marker.bindPopup(`
        <b>${place.name}</b><br>${place.description}
    `);
};



// Funzione per creare e salvare un luogo con un ID unico persistente
export const createPlace = (name, description, coords, img) => {
    // Recupera i luoghi dal localStorage (o inizializza come array vuoto se non esistono)
    const places = JSON.parse(localStorage.getItem('places')) || [];

    // Verifica se il luogo esiste già, altrimenti crea un nuovo luogo
    const existingPlace = places.find(place => place.name === name);
    
    let place;
    
    if (existingPlace) {
        // Usa l'ID esistente se il luogo esiste già
        place = { 
            ...existingPlace, 
            name, 
            description, 
            coords, 
            img 
        };
    } else {
        // Crea un nuovo luogo con ID unico solo la prima volta
        place = { 
            id: uuid.v4(), // Genera un ID unico solo quando il luogo è nuovo
            name, 
            description, 
            coords, 
            img 
        };
        
        // Aggiungi il nuovo luogo all'array dei luoghi
        places.push(place);
    }

    // Salva i luoghi nel localStorage
    localStorage.setItem('places', JSON.stringify(places));

    // Aggiungi il nuovo luogo alla tabella e mappa
    addNewPlaceToTable(place);
    addNewPlaceToMap(place);
};

export function loadConfig() {
    return fetch('conf.json')
      .then(response => response.json())
      .then(config => config.tokenMap) // Restituisce il tokenMap
      .catch(error => {
        console.error("Errore nel caricamento del file di configurazione:", error);
        throw error;  // Propaga l'errore per gestirlo in seguito
      });
  }

