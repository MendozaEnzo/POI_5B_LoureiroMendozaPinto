import { createLogin } from "./componenti.js";

const log = createLogin (document.getElementById("loginContainer"))
log.setLabels([["Username","text"],["Password","password"]]);
log.render();

const login = document.getElementById("login");

login.onclick = () => {
    document.getElementById("loginContainer").style.display="block";
    document.getElementById("overlay").style.display="block";
}

