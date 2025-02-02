import { afficherNavBarBoutons, responsiveNavBar, storePreviousPage, isTokenExpired, clearToken } from "../app.js";

const reponse = fetch('https://surfmate-backend.onrender.com/api/creneau');
reponse.then(async (reponse) => {
    const creneaux = await reponse.json();
    afficherCreneaux(creneaux);
});


const toggleArchivesButton = document.getElementById('toggleArchivesButton');
const sectionCreneauxArchives = document.querySelector('.creneauxArchives');

// Cacher les créneaux passés par défaut
sectionCreneauxArchives.classList.add('hidden');

toggleArchivesButton.addEventListener('click', () => {
  sectionCreneauxArchives.classList.toggle('hidden');
  if (sectionCreneauxArchives.classList.contains('hidden')) {
    toggleArchivesButton.textContent = 'Afficher les créneaux passés';
  } else {
    toggleArchivesButton.textContent = 'Masquer les créneaux passés';
  }
});



async function afficherCreneaux(creneaux) {
    creneaux.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    const currentDate = new Date(); // Date du jour

    for (let i = 0; i < creneaux.length; i++) {
        const reservation = creneaux[i];

        const reservationDate = new Date(reservation.date);
    


        const sectionCreneaux = document.querySelector('.creneaux');
        const creneauElement = document.createElement('reservation');

        const sectionCreneauxArchives = document.querySelector('.creneauxArchives');
    

        const spotId = reservation.spotId;

        const spotReponse = await fetch(`https://surfmate-backend.onrender.com/api/spot/${spotId}`);
        const spot = await spotReponse.json();
        const spotElement = document.createElement('spot');
        spotElement.classList.add('spotSection');
        const nomElement = document.createElement('h3');
        nomElement.innerText = "Spot : " + spot.nom;
        const villeElement = document.createElement('p');
        villeElement.innerText = "ville : " + spot.ville;
        const paysElement = document.createElement('p');
        paysElement.innerText = "pays : " + spot.pays;

        const noteElement = document.createElement('p');
        //afficher la note moyenne sur 10 en rajoutant un string " / 10" et si pas de note, afficher "Pas de note"
        if (spot.noteMoyenne) {
            noteElement.innerText = "note : " + spot.noteMoyenne + " / 10";
        } else {
            noteElement.innerText = "Pas encore de note";
        };

        const userIdElement = reservation.userId;
        const userReponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/${userIdElement}`);
        const user = await userReponse.json();
        const pseudoElement = document.createElement('h3');
        pseudoElement.classList.add('pseudoSection');
        pseudoElement.innerText = user.pseudo;


        const date = new Date(reservation.date);
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        };
        const dateFormatted = date.toLocaleDateString('fr-FR', options);
        const dateElement = document.createElement('p');
        dateElement.innerText = dateFormatted;
        

        sectionCreneaux.appendChild(creneauElement);
        creneauElement.appendChild(pseudoElement);
        creneauElement.appendChild(dateElement);
        creneauElement.appendChild(spotElement);
        spotElement.appendChild(nomElement);
        spotElement.appendChild(villeElement);
        spotElement.appendChild(paysElement);
        spotElement.appendChild(noteElement);

        // Si la date de réservation est passée
        if (reservationDate < currentDate) {
            sectionCreneauxArchives.appendChild(creneauElement);
        }
    }
}

const btnAjoutCreneau = document.getElementById('btnAjoutCreneau');
btnAjoutCreneau.addEventListener('click', redirectButton);

export function redirectButton() {
    const token = localStorage.getItem('token');
    if (token) {
        if (isTokenExpired()) {
            clearToken(); // Efface le token expiré du localStorage
            storePreviousPage();
            window.location.href = '../user/Connexion-Inscription.html';
          } else {
            window.location.href = '../creneaux/Ajout-creneau.html';
          }
    } else {
        storePreviousPage();
        window.location.href = '../user/Connexion-Inscription.html';
    }
}


afficherNavBarBoutons();
responsiveNavBar();






