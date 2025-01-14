//componente navigator
const hide = (elements) => {
    elements.forEach((element) => {
        element.classList.add("hidden");
        element.classList.remove("visible");
    });
};

const show = (element) => {
    element.classList.add("visible");
    element.classList.remove("hidden");
};

export const createNavigator = (parentElement) => {
    const pages = Array.from(parentElement.querySelectorAll(".page"));

    const render = () => {
        const url = new URL(document.location.href);
        const pageName = url.hash.replace("#", "") || "pagina1"; // Se non c'è hash, vai su pagina1
        const selected = pages.find((page) => page.id === pageName) || pages[0];

        hide(pages); // Nascondi tutte le pagine
        show(selected); // Mostra la pagina selezionata
    };

    // Gestisce il caricamento iniziale e il cambio di hash
    window.addEventListener("hashchange", render); // Reagisci al cambio di hash
    render(); // Esegui il rendering iniziale
};


//componente mappa
//creazione iniziale
let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView([45.4654219,9.1859243], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: maxZoom,
attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const renderMap = () => {
    download().then((places) => {
      places.forEach((place) => {
        const marker = L.marker(place.coords).addTo(map);
        marker.bindPopup(`
            <b>${place.name}</b><br>
            <b>Data:</b> ${place.date}<br>
            <b>Ora:</b> ${place.time}<br>
            <b>Feriti:</b> ${place.injured}<br>
            <b>Morti:</b> ${place.dead}`);
      });
    })
}
// Componente Login
const createLogin = () => {
    const inputName = document.querySelector("#name");
    const inputPassword = document.querySelector("#password");
    const loginButton = document.querySelector("#login");
    const divPrivate = document.querySelector("#private");
    const divLogin = document.querySelector("#login-container"); // Aggiunto un id corretto

    let isLogged = sessionStorage.getItem("Logged") === "true";

    // Imposta la visibilità iniziale
    const updateUI = () => {
        if (isLogged) {
            divPrivate.classList.remove("hidden");
            divPrivate.classList.add("visible");
            divLogin.classList.add("hidden");
        } else {
            divPrivate.classList.add("hidden");
            divPrivate.classList.remove("visible");
            divLogin.classList.remove("hidden");
        }
    };

    updateUI();

    const login = (name, password) => {
        return fetch("http://ws.cipiaceinfo.it/credential/login", { 
            method: "POST",
            headers: {
                "content-type": "application/json",
                "key": token // Assumendo che `token` sia definito altrove
            },
            body: JSON.stringify({
                username: name,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => data.result)
        .catch(error => {
            console.error("Errore nel login:", error);
            return false;
        });
    };

    loginButton.onclick = () => {
        const username = inputName.value.trim();
        const password = inputPassword.value.trim();

        if (!username || !password) {
            alert("Inserisci nome utente e password.");
            return;
        }

        login(username, password).then((result) => {
            if (result) {
                isLogged = true;
                sessionStorage.setItem("Logged", "true");
                updateUI();
            } else {
                alert("Credenziali errate!");
            }
        });
    };

    return {
        isLogged: () => isLogged
    };
};

