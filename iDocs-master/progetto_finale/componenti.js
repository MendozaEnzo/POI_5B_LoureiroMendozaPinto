// Funzioni per la gestione della visibilità
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

// Componente Navigatore
export const createNavigator = (parentElement) => {
    const pages = Array.from(parentElement.querySelectorAll(".page"));

    const render = () => {
        const url = new URL(document.location.href);
        const pageName = location.hash.replace("#", "") || "pagina1"; 
        const selected = pages.find((page) => page.id === pageName) || pages[0];

        hide(pages); 
        show(selected); 
    };

    window.addEventListener("hashchange", render); 
    render();
};

// Componente Mappa
let map = L.map('map').setView([45.4654219, 9.1859243], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
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
    }).catch(console.error);
};

// Componente Login
/*const createLogin = () => {
    const inputName = document.querySelector("#name");
    const inputPassword = document.querySelector("#password");
    const loginButton = document.querySelector("#login");
    const divPrivate = document.querySelector("#private");
    const divLogin = document.querySelector("#login-container");

    let isLogged = sessionStorage.getItem("Logged") === "true";

    const updateUI = () => {
        if (isLogged) {
            divPrivate.classList.remove("hidden");
            divLogin.classList.add("hidden");
        } else {
            divPrivate.classList.add("hidden");
            divLogin.classList.remove("hidden");
        }
    };

    updateUI();

    const login = async (username, password) => {
        try {
            const response = await fetch("http://ws.cipiaceinfo.it/credential/login", { 
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": token
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Errore nel login:", error);
            return false;
        }
    };

    loginButton.onclick = async () => {
        const username = inputName.value.trim();
        const password = inputPassword.value.trim();

        if (!username || !password) {
            alert("Inserisci nome utente e password.");
            return;
        }

        const result = await login(username, password);
        if (result) {
            isLogged = true;
            sessionStorage.setItem("Logged", "true");
            updateUI();
        } else {
            alert("Credenziali errate!");
        }
    };

    return {
        isLogged: () => isLogged
    };
};*/

export { renderMap, createLogin, createNavigator };
