
//const reponse = await fetch('https://surfmate-backend.onrender.com/api/spot/');

//Vérifier que le psuedo n'est pas déjà utilisé
const pseudo = document.getElementById("pseudo");
const pseudoErreur = document.getElementById("pseudoErreur");
const pseudoValide = document.getElementById("pseudoValide");
const pseudoRegex = /^[a-zA-Z0-9_àâéèêëîïôöùûüç]{3,16}$/;
const email = document.getElementById("email");
const emailErreur = document.getElementById("emailErreur");
const emailValide = document.getElementById("emailValide");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const passwordErreur = document.getElementById("passwordErreur");


pseudo.addEventListener("input", function (event) {
    if (pseudoRegex.test(pseudo.value)) {
        pseudoErreur.style.display = "none";
        pseudoValide.style.display = "block";
    } else {
        pseudoErreur.style.display = "block";
        pseudoErreur.innerText="Le pseudo doit contenir entre 3 et 16 caractères alphanumériques, accents autorisés";
        pseudoValide.style.display = "none";
    }
}
);

pseudo.addEventListener("blur", async function (event) {
    console.log("blur");
    if (await checkPseudo()) {
        pseudoErreur.style.display = "none";
        pseudoValide.style.display = "block";
    }
    else {
        pseudoErreur.style.display = "block";
        pseudoErreur.innerText="Ce pseudo est déjà utilisé";
        pseudoValide.style.display = "none";
    }
});

//Vérifier que l'adresse mail n'est pas déjà utilisée
email.addEventListener("blur", async function (event) {
    if (await checkEmail()) {
        emailErreur.style.display = "none";
        emailValide.style.display = "block";
    }
    else {
        emailErreur.style.display = "block";
        emailErreur.innerText="Cet email est déjà utilisé";
        emailValide.style.display = "none";
    }
});
    

//Vérifier que le mot de passe est confirmé
password2.addEventListener("input", function (event) {
    if (password.value === password2.value) {
        passwordErreur.style.display = "none";
    } else {
        passwordErreur.style.display = "block";
    }
}
);

//Envoyer les données au serveur
const boutonSubmit = document.getElementById("submitSignup");
boutonSubmit.addEventListener("click", async function (event) {
    event.preventDefault();
    if (!pseudoRegex.test(pseudo.value)) {
        pseudoErreur.style.display = "block";
        pseudoErreur.innerText="Le pseudo doit contenir entre 3 et 16 caractères alphanumériques, accents autorisés";
        pseudoValide.style.display = "none";
        return;
    }
    if (!await checkPseudo()) {
        pseudoErreur.style.display = "block";
        pseudoErreur.innerText="Ce pseudo est déjà utilisé";
        pseudoValide.style.display = "none";
        return;
    }
    if (!await checkEmail()) {
        emailErreur.style.display = "block";
        emailErreur.innerText="Cet email est déjà utilisé";
        emailValide.style.display = "none";
        return;
    }
    if (password.value !== password2.value) {
        passwordErreur.style.display = "block"; 
        passwordErreur.innerText="Les mots de passe ne correspondent pas";
        return;
    }

    const data = {
        pseudo: pseudo.value,
        email: email.value,
        password: password.value
    };
    const reponse = await fetch('https://surfmate-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const resultat = await reponse.json();
    if (resultat.error) {
        alert(resultat.error);
    } else {
        alert("Votre compte a bien été créé");
        redirectToPreviousPage(); //TODO : laisser l'utilisateur connecté après l'inscription
    }
});

async function checkPseudo(){
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/signup/pseudoLibre/${pseudo.value}`);
    const pseudoLibre = await reponse.json();
    //pseudoLibre attendu : true ou false
    return pseudoLibre.message
}

async function checkEmail(){
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/signup/emailLibre/${email.value}`);
    const emailLibre = await reponse.json();
    //pseudoLibre attendu : true ou false
    return emailLibre.message
};



