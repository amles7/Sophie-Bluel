
// Création de la section #login
const main = document.createElement("main");
document.body.appendChild(main);

const sectionLogin = document.createElement("section");
sectionLogin.id = "login";

const h2 = document.createElement("h2");
h2.innerText = "Log In";

// Éléments du formulaire de connexion
const formLogin = document.createElement("form");
formLogin.id = "formLogIn";
formLogin.method = "POST";

const labelEmailFormLogin = document.createElement("label");
labelEmailFormLogin.textContent = "E-mail";

const inputEmailFormLogin = document.createElement("input");
inputEmailFormLogin.setAttribute("type", "email");
inputEmailFormLogin.setAttribute("id", "email");

const labelMdpFormLogin = document.createElement("label");
labelMdpFormLogin.textContent = "Mot de passe";

const inputMdpFormLogin = document.createElement("input");
inputMdpFormLogin.setAttribute("type", "password");
inputMdpFormLogin.setAttribute("id", "password");

const inputConnexionFormLogin = document.createElement("input");
inputConnexionFormLogin.type = "submit";
inputConnexionFormLogin.value = "Se connecter";

const aMdpOublieFormLogin = document.createElement("a");
aMdpOublieFormLogin.href = "#";
aMdpOublieFormLogin.textContent = "Mot de passe oublié";

main.appendChild(sectionLogin);
sectionLogin.appendChild(h2);
sectionLogin.appendChild(formLogin);

// Lier les éléments au formulaire de connexion
formLogin.appendChild(labelEmailFormLogin);
formLogin.appendChild(inputEmailFormLogin);
formLogin.appendChild(labelMdpFormLogin);
formLogin.appendChild(inputMdpFormLogin);
formLogin.appendChild(inputConnexionFormLogin);
formLogin.appendChild(aMdpOublieFormLogin);

//// Fonction pour gestion du formulaire de login
function alertInfoValidFormLogin() {
    const bodyAlert = document.querySelector("body");
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const alertContainer = document.createElement("div");
    alertContainer.className = "alertLogin";
    const alertP = document.createElement("p");
    alertP.className = "alertLoginMsgValide";
    alertP.innerText = "Connexion Réussie !";
    alertContainer.appendChild(alertP);
    overlay.appendChild(alertContainer);
    bodyAlert.appendChild(overlay);
}

function alertInfoFieldsEmptyFormLogin() {
    const bodyAlert = document.querySelector("body");
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const alertContainer = document.createElement("div");
    alertContainer.className = "alertLogin";
    const alertP = document.createElement("p");
    alertP.className = "alertLoginMsg";
    alertP.innerText = "Champs vide !";
    const btnNouvelEssai = document.createElement("button");
    btnNouvelEssai.className = "btn-alert";
    btnNouvelEssai.textContent = "Nouvel Essai";
    btnNouvelEssai.addEventListener("click", function () {
        overlay.remove();
    });
    alertContainer.appendChild(alertP);
    alertContainer.appendChild(btnNouvelEssai);
    overlay.appendChild(alertContainer);
    bodyAlert.appendChild(overlay);
}

function alertLoginMdpIncorrectFormLogin() {
    const bodyAlert = document.querySelector("body");
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const alertContainer = document.createElement("div");
    alertContainer.className = "alertLogin";
    const pAlert = document.createElement("p");
    pAlert.className = "alertLoginMsg";
    pAlert.innerText = "E-mail et/ou Mot de passe incorrect !";
    const btnNouvelEssaiAlerte = document.createElement("button");
    btnNouvelEssaiAlerte.className = "btn-alert";
    btnNouvelEssaiAlerte.textContent = "Nouvel Essai";
    btnNouvelEssaiAlerte.addEventListener("click", function () {
        overlay.remove();
    });
    alertContainer.appendChild(pAlert);
    alertContainer.appendChild(btnNouvelEssaiAlerte);
    overlay.appendChild(alertContainer);
    bodyAlert.appendChild(overlay);
}

function alertErrorFormLogin() {
    const bodyAlert = document.querySelector("body");
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const alertContainer = document.createElement("div");
    alertContainer.className = "alertLogin";
    const alertP = document.createElement("p");
    alertP.className = "alertLoginMsg";
    alertP.innerText = "Error - 404";
    const btnNouvelEssai = document.createElement("button");
    btnNouvelEssai.className = "btn-alert";
    btnNouvelEssai.textContent = "Nouvel Essai";
    btnNouvelEssai.addEventListener("click", function () {
        overlay.remove();
    });
    alertContainer.appendChild(alertP);
    alertContainer.appendChild(btnNouvelEssai);
    overlay.appendChild(alertContainer);
    bodyAlert.appendChild(overlay);
}

formLogin.addEventListener("submit", async function (SubmitEvent) {
    SubmitEvent.preventDefault();
    // Récupérer les valeurs des champs email et mot de passe
    const email = inputEmailFormLogin.value.trim(); // .trim pour supprimer les espaces avant/après 
    const password = inputMdpFormLogin.value.trim();

    try { 
        if (email === "" || password === "") {
            alertInfoFieldsEmptyFormLogin();
            console.log("Champs vide");
            return;
        }
        const swaggerLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (swaggerLogin.ok) { 
            const swaggerToken = await swaggerLogin.json(); // Récupération du token en JSON
            localStorage.setItem("token", swaggerToken.token); // Mise en mémoire du token
            inputEmailFormLogin.value = "";
            inputMdpFormLogin.value = "";
            alertInfoValidFormLogin();
            console.log("Connexion réussie !");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirection vers la page d'accueil en 1s
            }, 1000);
        } else {
            inputEmailFormLogin.value = "";
            inputMdpFormLogin.value = "";
            alertLoginMdpIncorrectFormLogin();
            console.log("E-mail et/ou Mot de passe incorrect");
        }
    } catch (error) {
        alertErrorFormLogin();
    }  
});
// Ajout du footer à la fin du body
const footer = document.querySelector("footer");
document.body.appendChild(footer);
