import { redirectToPreviousPage } from '../app.js';

// Affichage form
const forLogin = _('forLogin');
const loginForm = _('loginForm');
const forRegister = _('forRegister');
const registerForm = _('registerForm');
const formContainer = _('formContainer');


forLogin.addEventListener('click', () => {
    forLogin.classList.add('active');
    forRegister.classList.remove('active');
    if(loginForm.classList.contains('toggleForm')) {
        formContainer.style.transform = 'translate(0%)';
        formContainer.style.transition = 'transform .5s';
        registerForm.classList.add('toggleForm');
        loginForm.classList.remove('toggleForm');
    }
} , { passive: true });

forRegister.addEventListener('click', () => {
    forLogin.classList.remove('active');
    forRegister.classList.add('active');
    if(registerForm.classList.contains('toggleForm')) {
        formContainer.style.transform = 'translate(-100%)';
        formContainer.style.transition = 'transform .5s';
        registerForm.classList.remove('toggleForm');
        loginForm.classList.add('toggleForm');
    }
}, { passive: true });

function _(e) {
    return document.getElementById(e);
}

function showForm() {
    document.querySelector('.form-wrapper .card').classList.toggle('show');
    document.querySelector('.sectionLoginRegister').classList.toggle('show');
}


// Connexion


const boutonConnexion = document.getElementById("submitLogin");
boutonConnexion.addEventListener("click", async function (event) {

    event.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;
    const hashedPassword = CryptoJS.SHA256(password).toString();
    try {
        const response = await fetch('https://surfmate-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, hashedPassword })
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Afficher l'erreur à l'utilisateur
            const errorElement = document.getElementById('loginErreur');
            errorElement.innerText = error.message;
            console.log(error);
        } else {
            const res = await response.json();
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.userId);
            redirectToPreviousPage();
        }
    } catch (err) {
        console.log(err);
    }
}
);

// Inscription

//const reponse = await fetch('https://surfmate-backend.onrender.com/api/spot/');

//Vérifier que le psuedo n'est pas déjà utilisé
const pseudo = document.getElementById("pseudo");
const pseudoErreur = document.getElementById("pseudoErreur");
const pseudoValide = document.getElementById("pseudoValide");
const pseudoRegex = /^[a-zA-Z0-9_àâéèêëîïôöùûüç]{3,16}$/;
const email = document.getElementById("emailSignup");
const emailErreur = document.getElementById("emailErreur");
const emailValide = document.getElementById("emailValide");
const password = document.getElementById("passwordSignup");
const password2 = document.getElementById("password2Signup");
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
const boutonInscription = document.getElementById("submitSignup");
boutonInscription.addEventListener("click", async function (event) {
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
    const hashedPassword = CryptoJS.SHA256(password.value).toString();

    const data = {
        pseudo: pseudo.value,
        email: email.value,
        password: hashedPassword
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







