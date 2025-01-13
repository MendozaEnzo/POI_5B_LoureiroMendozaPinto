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

// Collegamento del navigatore
document.addEventListener("DOMContentLoaded", () => {
    const parentElement = document.body;
    createNavigator(parentElement);
});
