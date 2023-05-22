const reponse = await fetch(`http://localhost:3001/api/creneau`)
const mesCreneaux = await reponse.json();

const userId = localStorage.getItem('userId');

async function afficherMesCreneaux(mesCreneaux) {
    mesCreneaux.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    for (let i = 0; i < mesCreneaux.length; i++) {
        if (mesCreneaux[i].userId === userId) {
            const reservation = mesCreneaux[i];
            const sectionCreneaux = document.querySelector('.mesCreneaux');
            const creneauElement = document.createElement('reservation');

            const spotId = reservation.spotId;

            const spotReponse = await fetch(`http://localhost:3001/api/spot/${spotId}`);
            const spot = await spotReponse.json();
            const spotElement = document.createElement('spot');
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
            const userReponse = await fetch(`http://localhost:3001/api/auth/${userIdElement}`);
            const user = await userReponse.json();
            const pseudoElement = document.createElement('h3');
            pseudoElement.innerText = user.pseudo;

            const date = new Date(reservation.date);
            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            const formattedDate = date.toLocaleDateString('fr-FR', options);
            const dateElement = document.createElement('p');
            dateElement.innerText = formattedDate;

            sectionCreneaux.appendChild(creneauElement);
            creneauElement.appendChild(spotElement);
            spotElement.appendChild(nomElement);
            spotElement.appendChild(villeElement);
            spotElement.appendChild(paysElement);
            spotElement.appendChild(noteElement);
            creneauElement.appendChild(pseudoElement);
            creneauElement.appendChild(dateElement);
            
        }
    }

}

afficherMesCreneaux(mesCreneaux);