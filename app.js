
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
    if (isTokenExpired()) {
      clearToken(); // Utilisation de la fonction isTokenExpired() pour vérifier si le token est expiré et clearToken() pour effacer le token du localStorage si c'est le cas
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

// Fonction pour vérifier si le token est expiré
export function isTokenExpired() {
  const expirationDate = localStorage.getItem('expirationDate');
  if (!expirationDate) {
    return true; // Le token n'existe pas ou n'a pas de date d'expiration
  }
  return new Date() > new Date(expirationDate);
}

// Fonction pour effacer le token et ses informations d'expiration de localStorage
export function clearToken() {
  localStorage.clear();
}