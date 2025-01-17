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
       const pageName = url.hash.replace("#", "") || "homepage"; // Imposta 'homepage' come predefinito

       // Trova la pagina da mostrare in base all'ID nell'URL hash
       const selected = pages.find((page) => page.id === pageName) || pages[0];

       // Nascondi tutte le pagine e mostra quella selezionata
       hide(pages);
       show(selected);
   };

   // Gestisce il caricamento iniziale e il cambio di hash
   window.addEventListener("hashchange", render); // Reagisci al cambio di hash
   render(); 
};

// Collegamento del navigatore
document.addEventListener("DOMContentLoaded", () => {
   const parentElement = document.body;
   createNavigator(parentElement);
});

const login = document.getElementById("login");

login.onclick = () => {
    document.getElementById("loginContainer").style.display="block";
    document.getElementById("overlay").style.display="block";
}