const reponse = await fetch(`https://surfmate-backend.onrender.com/api/creneau`)
const mesCreneaux = await reponse.json();

const userId = localStorage.getItem('userId');

async function afficherMesCreneaux(mesCreneaux) {
    mesCreneaux.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    let compteur = 0;

    for (let i = 0; i < mesCreneaux.length; i++) {
        if (mesCreneaux[i].userId === userId) {
            compteur++;
            const reservation = mesCreneaux[i];
            const sectionCreneaux = document.querySelector('.mesCreneaux');
            const creneauElement = document.createElement('div');
            creneauElement.classList.add('reservation');
            creneauElement.dataset.id = mesCreneaux[i]._id;

            const sectionActions = document.createElement('div');
            sectionActions.classList.add('actions');

            const modifyElement = document.createElement("img");
            modifyElement.classList.add("modifyElement");
            modifyElement.src = "../images/modifier.png";

            const deleteElement = document.createElement("img");
            deleteElement.classList.add("deleteElement");
            deleteElement.src = "../images/bin2.png";

            sectionActions.appendChild(modifyElement);
            sectionActions.appendChild(deleteElement);

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
            pseudoElement.classList.add('pseudo');
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
            creneauElement.appendChild(sectionActions);
            creneauElement.appendChild(pseudoElement);
            creneauElement.appendChild(dateElement);
            creneauElement.appendChild(spotElement);
            spotElement.appendChild(nomElement);
            spotElement.appendChild(villeElement);
            spotElement.appendChild(paysElement);
            spotElement.appendChild(noteElement);
            
        }
    }
    if (compteur === 0) {
        const sectionCreneaux = document.querySelector('.mesCreneaux');
        const creneauElement = document.createElement('div');
        creneauElement.classList.add('reservation');
        const messageElement = document.createElement('h3');
        messageElement.innerText = "Vous n'avez pas encore de créneau de réservé";
        sectionCreneaux.appendChild(creneauElement);
        creneauElement.appendChild(messageElement);
    } else {
        const sectionCreneaux = document.querySelector('.mesCreneaux');
        const creneauElement = document.createElement('div');
        creneauElement.classList.add('reservation');
        const messageElement = document.createElement('h3');
        messageElement.innerText = "Vous avez " + compteur + " créneau(x) de réservé(s)";
        sectionCreneaux.appendChild(creneauElement);
        creneauElement.appendChild(messageElement);
    }

}

afficherMesCreneaux(mesCreneaux);

// Supprimer un créneau
const sectionCreneaux = document.querySelector(".mesCreneaux");

sectionCreneaux.addEventListener("click", async function (event) {
    if (event.target.classList.contains("deleteElement")) {
        event.preventDefault();

        const deleteElement = event.target;
        const creneauElement = deleteElement.parentElement;
        const creneauId = creneauElement.dataset.id;

        const reponse = await fetch(`https://surfmate-backend.onrender.com/api/creneau/${creneauId}`, {
            method: "DELETE",
            headers: {
                //Bearer token
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        const body = await reponse.json();
        if (reponse.ok) {
            window.location.href = "mes-creneaux.html";
        } else {
            alert(body.message);
        }
    }
});

// Modifier un créneau
const sectionCreneaux2 = document.querySelector(".mesCreneaux");

sectionCreneaux2.addEventListener("click", async function(event) {
    if (event.target.classList.contains("modifyElement")) {
        const creneauElement = event.target.closest(".reservation");
        const creneauId = creneauElement.dataset.id;

        // Vérifier si le formulaire est déjà visible
        const existingForm = creneauElement.querySelector("form");
        if (existingForm) {
            return; // Sortir de la fonction si le formulaire est déjà visible
        }
        
        // Récupérer les informations du créneau à modifier depuis le serveur
        const reponse = await fetch(`https://surfmate-backend.onrender.com/api/creneau/${creneauId}`);
        const creneau = await reponse.json();
        
        //Récupérer la date et l'heure du créneau et la convertir dans le bon format
        
        console.log(creneau.date);
        creneau.date = creneau.date.slice(0, -5);
        console.log(creneau.date);
        
        // Créer un formulaire d'édition
        const formElement = document.createElement("form");
        formElement.innerHTML = `
            <label for="datetime">Date et heure</label>
            <input type="datetime-local" id="datetime" name="datetime" value="${creneau.date}" required>
    
            <label for="spot">Spot</label>
            <div id="selectSpot">
            <select name="spots" id="spots-liste" required>
            <option value="">--Choisissez un spot--</option>
            </select>
            <button type="button" onclick="document.location='/ajout-spot/Ajout-spot.html'">Ajouter un spot</button>
            </div>
            
            <input type="submit" value="Modifier le créneau" id="submitModif">
            <button type="button" id="cancelModif">Annuler</button>
            `;  
            
        // Ajouter le formulaire au DOM
        creneauElement.appendChild(formElement);
            
        // Récupérer la liste des spots du serveur
        const response = await fetch("https://surfmate-backend.onrender.com/api/spot/");
        const spots = await response.json();
    
        const spotsMap = new Map();
  
        for (const spot of spots) {
            spotsMap.set(spot._id, {
            nom: spot.nom,
            ville: spot.ville,
            pays: spot.pays
            });
        }
  
        // Remplir le menu déroulant avec les spots
        const selectElement = formElement.querySelector("#spots-liste");
        spotsMap.forEach((spot, key) => {
            const optionElement = document.createElement("option");
            optionElement.value = key;
            optionElement.textContent = `${spot.nom}, ${spot.ville}, ${spot.pays}`;
            selectElement.appendChild(optionElement);
        });
        
        // Pré-remplir le menu déroulant avec le spot existant
        const spotId = creneau.spotId;
        selectElement.value = spotId;
    
        // Gérer la soumission du formulaire de modification
        formElement.addEventListener("submit", async function(e) {
            e.preventDefault();
    
            const inputDate = document.getElementById("datetime").value;
            const isoDate = new Date(inputDate).toISOString();
            const spot = document.getElementById("spots-liste");
            const selectedSpot = spot.options[spot.selectedIndex];
            const idSpot = selectedSpot.value;
    
            const data = {
            date: isoDate,
            spotId: idSpot,
            userId: localStorage.getItem("userId")
        };
  
        // Envoyer les nouvelles données au serveur pour mise à jour
        const response = await fetch(`https://surfmate-backend.onrender.com/api/creneau/${creneauId}`, {
          method: "PUT",
          headers: {
            //Bearer token
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (result.error) {
          alert(result.error);
        } else {
            alert("Le créneau a bien été modifié");
            window.location.href = "mes-creneaux.html";
        }
      });
        // Gérer le bouton "Annuler"
        const cancelModifButton = formElement.querySelector("#cancelModif");
        cancelModifButton.addEventListener("click", function() {
        creneauElement.removeChild(formElement);
        });
    }
});
