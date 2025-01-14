import { afficherNavBarBoutons, responsiveNavBar, isTokenExpired, clearToken, storePreviousPage } from "../app.js";
import { afficherAvis, masquerAvis } from "./avisSpot.js";


const reponse = fetch('https://surfmate-backend.onrender.com/api/spot/');
reponse.then(async (reponse) => {
    const spots = await reponse.json();
    afficherSpots(spots);
});


async function afficherSpots(spots) {

    for (let i = 0; i < spots.length; i++) {
        const lieu = spots[i];
        const sectionSpots = document.querySelector(".spots");

        const spotElement = document.createElement("lieu");

        // Créer le bouton de suppression seulement si l'utilisateur est administrateur
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (token) {
            const isAdmin = localStorage.getItem('isAdmin');
            console.log(isAdmin);  
            if (isAdmin === 'true') {

                const deleteElement = document.createElement("img");
                deleteElement.classList.add("deleteElement");
                deleteElement.src = "../images/bin2.png";
    
                deleteElement.dataset.id = lieu._id;
                deleteElement.addEventListener("click", async () => {
                    const spotId = deleteElement.dataset.id;
                    console.log(spotId);
                    await supprimerSpot(spotId);
                });
                spotElement.appendChild(deleteElement);
                }
        }

        const nomElement = document.createElement("h2");
        nomElement.innerText = lieu.nom;

        const villeElement = document.createElement("p");
        villeElement.innerText = "ville : " + lieu.ville;

        const paysElement = document.createElement("p");
        paysElement.innerText = "pays : " + lieu.pays;

        const noteElement = document.createElement("p");
        if (lieu.noteMoyenne == null) {
            lieu.noteMoyenne = "Pas encore de note";
        } else {    
            lieu.noteMoyenne = "note moyenne : " + lieu.noteMoyenne.toFixed(1) + "/10" ;
        }
        noteElement.innerText = lieu.noteMoyenne;

        const divAvis = document.createElement("div");
        divAvis.classList.add('avis');


        const avisBouton = document.createElement("button");
        avisBouton.classList.add('blurryButton');
        avisBouton.dataset.id = lieu._id;
        avisBouton.textContent = "Afficher les avis";
        avisBouton.addEventListener("click", async () => {
            const spotId = avisBouton.dataset.id;
            const reponse = await fetch(`https://surfmate-backend.onrender.com/api/avis?spot_id=${spotId}`);
            const avis = await reponse.json();
            if (avisBouton.textContent === "Afficher les avis") {
                afficherAvis(avis, spotId);
                avisBouton.textContent = "Masquer les avis";
              } else {
                masquerAvis(spotId);
                avisBouton.textContent = "Afficher les avis";
            }
        });
        const ajoutAvisBouton = document.createElement("button");
        ajoutAvisBouton.classList.add('blurryButton');
        ajoutAvisBouton.dataset.id = lieu._id;
        ajoutAvisBouton.textContent = "Ajouter un avis";
        ajoutAvisBouton.addEventListener("click", async () => {
            //Vérifier si l'utilisateur est connecté et que le token n'est pas expiré, sinon le rediriger vers la page de connexion
            const token = localStorage.getItem('token');
            if (!token) {
                storePreviousPage();
                window.location.href = '../user/Connexion-Inscription.html';
            } else {
                if (isTokenExpired()) {
                    storePreviousPage();
                    clearToken(); // Utilisation de la fonction isTokenExpired() pour vérifier si le token est expiré et clearToken() pour effacer le token du localStorage si c'est le cas
                    window.location.href = '../user/Connexion-Inscription.html';
                  } else {
                    const spotId = ajoutAvisBouton.dataset.id;
                    window.location.href = `./ajout-avis-spot.html?spot_id=${spotId}`;
                  }
            }


        });


        
        const avis = document.createElement("div"); 
        avis.classList.add('avis_'+avisBouton.dataset.id);

        divAvis.appendChild(avisBouton);
        divAvis.appendChild(ajoutAvisBouton);
        spotElement.appendChild(nomElement);
        spotElement.appendChild(villeElement);
        spotElement.appendChild(paysElement);
        spotElement.appendChild(noteElement);
        spotElement.appendChild(avis);
        spotElement.appendChild(divAvis);
        sectionSpots.appendChild(spotElement);
    }
}






afficherNavBarBoutons();
responsiveNavBar();

export function afficherBoutonAjoutSpot() {
    const token = localStorage.getItem('token');
    if (token) {
        const boutons = document.querySelector('.boutonAlignement');

        const boutonAjouterSpot = document.createElement('button');
        boutonAjouterSpot.classList.add('blurryButton');
        boutonAjouterSpot.innerText = 'Ajouter un spot';

        boutonAjouterSpot.addEventListener('click', function() {
            window.location.href = '../ajout-spot/Ajout-spot.html';
        });

        boutons.appendChild(boutonAjouterSpot);
    } else { 
        return
    }
}

afficherBoutonAjoutSpot();

//Supprimer un spot
export async function supprimerSpot(spotId) {
    const sectionSpots = document.querySelector(".spots");

    sectionSpots.addEventListener("click", async function(event) {
        if (event.target.classList.contains("deleteElement")) {
            event.preventDefault();

            const deleteElement = event.target;
            const spotElement = deleteElement.parentElement;
            // const spotId = spotElement.dataset.id;
            const userId = localStorage.getItem('userId');
            const response = fetch(`https://surfmate-backend.onrender.com/api/auth/${userId}`);
                response.then(async (reponse) => {
                    const user = await reponse.json();
                    const isAdmin = user.isAdmin;
                    localStorage.setItem('isAdmin', isAdmin);
                });
            const isAdmin = localStorage.getItem('isAdmin');

            if (isAdmin === 'true') {
                const reponse = await fetch(`https://surfmate-backend.onrender.com/api/spot/${spotId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });
                const body = await reponse.json();
                if (reponse.ok) {
                    spotElement.remove();
                } else {
                    alert(body.message);
                }

            } else {
                return
            }


        }
    });
}



