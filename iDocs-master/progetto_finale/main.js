
import { createNavigator } from "./componenti";


// Collegamento del navigatore
document.addEventListener("DOMContentLoaded", () => {
    const parentElement = document.body;
    createNavigator(parentElement);
});

const log = createLogin (document.getElementById("loginContainer"))
log.setLabels([["Username","text"],["Password","password"]]);
log.render();

const login = document.getElementById("login");

login.onclick = () => {
    document.getElementById("loginContainer").style.display="block";
    document.getElementById("overlay").style.display="block";
}
