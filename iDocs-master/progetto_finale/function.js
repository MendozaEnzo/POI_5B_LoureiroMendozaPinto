export const getCoordinates = (luogo) => {
    console.log(luogo);
    return new Promise((resolve)=>{
        fetch("conf.json").then(r => r.json()).then(confData => {
            fetch(confData.geoUrl.replace("$LUOGO", luogo[0])).then(r => r.json()).then(data => {
                let object = {name:luogo[0],coords:[data[0].lat,data[0].lon]};
                console.log(object);
                resolve(object);
            })
        })
    })
}
export const addMarker = (places) =>{
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
        showDetail(id);
        document.getElementById("dettaglio").style.display = "block";
    } else {
        document.querySelector(hash).style.display = "block";
    }
};

export const showDetail = (id) => {
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
};



