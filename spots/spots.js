import { afficherNavBarBoutons, responsiveNavBar } from "../app.js";
import { afficherAvis, masquerAvis } from "./avisSpot.js";


const reponse = await fetch('https://surfmate-backend.onrender.com/api/spot/');
const spots = await reponse.json();

function afficherSpots(spots) {
    for (let i = 0; i < spots.length; i++) {
        const lieu = spots[i];
        const sectionSpots = document.querySelector(".spots");

        const spotElement = document.createElement("lieu");

        const nomElement = document.createElement("h2");
        nomElement.innerText = "Spot : " + lieu.nom;

        const villeElement = document.createElement("p");
        villeElement.innerText = "ville : " + lieu.ville;

        const paysElement = document.createElement("p");
        paysElement.innerText = "pays : " + lieu.pays;

        const noteElement = document.createElement("p");
        if (lieu.noteMoyenne == null) {
            lieu.noteMoyenne = "Pas encore de note";
        } else {    
            lieu.noteMoyenne = "note moyenne : " + lieu.noteMoyenne + "/10" ;
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
            const reponse = await fetch(`http://localhost:3001/api/avis?spot_id=${spotId}`);
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
            const spotId = ajoutAvisBouton.dataset.id;
            window.location.href = `./ajout-avis.html?spot_id=${spotId}`;
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
        // spotElement.appendChild(avisBouton);
        // spotElement.appendChild(ajoutAvisBouton);
        sectionSpots.appendChild(spotElement);
    }
}

afficherSpots(spots);




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


