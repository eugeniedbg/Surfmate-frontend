// export function redirectToPreviousPage() {
//     // Récupérer l'URL précédente à partir de l'historique du navigateur
//     var previousPage = document.referrer;
//     console.log(previousPage);
  
//     // Rediriger vers l'URL précédente
//     window.location.href = previousPage;
// }

export function redirectToPreviousPage() {
    // Récupérer l'URL précédente à partir du stockage local
    var previousPage = localStorage.getItem("previousPage");
    console.log(previousPage);
  
    // Rediriger vers l'URL précédente ou une page par défaut si le stockage local est vide
    if (previousPage) {
      window.location.href = previousPage;
    } else {
      window.location.href = "/default-page";
    }
  }
  
  // Stocker l'URL précédente dans le stockage local avant de passer à la page de connexion
export function storePreviousPage() {
    var currentPage = window.location.href;
    localStorage.setItem("previousPage", currentPage);
  }
  


export function afficherNavBarBoutons() {
    const token = localStorage.getItem('token');
    if (token) {
        const boutons = document.querySelector('.nav-buttons-list');

        const boutonMonCompte = document.createElement('a');
        boutonMonCompte.href = '../user/profil.html';
        boutonMonCompte.innerText = 'Mon Compte';

        const listItemMonCompte = document.createElement('li');
        listItemMonCompte.appendChild(boutonMonCompte); 

        const boutonDeconnexion = document.createElement('a');
        boutonDeconnexion.href = '../principale/principale.html';
        boutonDeconnexion.innerText = 'Déconnexion';

        boutonDeconnexion.addEventListener("click", function (event) {
            localStorage.clear();
        }, { passive: true });

        const listItemDeconnexion = document.createElement('li');
        listItemDeconnexion.appendChild(boutonDeconnexion);

        boutons.appendChild(listItemMonCompte);
        boutons.appendChild(listItemDeconnexion);
    } else { 
        const boutons = document.querySelector('.nav-buttons-list');

        const boutonConnexion = document.createElement('button');
        boutonConnexion.className = 'btn';
        boutonConnexion.id = 'displayform';
        boutonConnexion.innerText = 'Connexion';

        const listItemConnexion = document.createElement('li');
        listItemConnexion.appendChild(boutonConnexion); 

        boutonConnexion.addEventListener('click', function() {
            storePreviousPage();
            window.location.href = '../user/Connexion-Inscription.html';
        });

        boutons.appendChild(listItemConnexion);

    }
}

export function responsiveNavBar() {
    const menuHamburger = document.querySelector(".menu-hamburger")
    const navLinks = document.querySelector(".nav-links")
    const body = document.querySelector("body")
    let active = false
    menuHamburger.addEventListener('click',()=>{
        navLinks.classList.toggle('mobile-menu')
        if (active == false){
            body.style.overflow = "hidden"
            active = true
        }else{
            body.style.overflow = "auto"
            active = false
        }

    }) 
}

// Fonction pour vérifier si le token a expiré
export function isTokenExpired() {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; // Convertir la date d'expiration en millisecondes
        const currentTime = new Date().getTime();
        return currentTime > expirationTime;
      }
    }
    return true; // Si le token est manquant ou invalide, considérer qu'il a expiré
  }
  
  // Fonction pour gérer l'expiration du token
export function handleTokenExpiration() {
    // Effacer le token et effectuer d'autres actions nécessaires (déconnexion, redirection, etc.)
    localStorage.clear();
    // Rediriger l'utilisateur vers la page de connexion ou effectuer d'autres actions appropriées
    window.location.href = "../user/Connexion-Inscription.html";
}