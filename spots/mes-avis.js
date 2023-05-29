import { recalculerNoteMoyenne } from '../app.js';

const reponse = await fetch(`https://surfmate-backend.onrender.com/api/avis`)
const mesAvis = await reponse.json();

const userId = localStorage.getItem('userId');

async function afficherMesAvis(mesAvis) {
    mesAvis.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    let compteur = 0;

    for (let i = 0; i < mesAvis.length; i++) {
        if (mesAvis[i].userId === userId) {
            compteur++;

            //Récupérer le spot correspondant à l'avis et afficher le nom du spot
            const reponse = await fetch(`https://surfmate-backend.onrender.com/api/spot/${mesAvis[i].spotId}`)
            const spot = await reponse.json();
            const nomSpot = spot.nom;
            console.log(nomSpot);

            //Pour chaque spot où l'utilisateur a publié un avis, afficher les infos de l'avis
            const sectionAvis = document.querySelector(".mesAvis");
            const avisElement = document.createElement("post");
            avisElement.dataset.id = mesAvis[i]._id;

            const noteElement = document.createElement("p");
            noteElement.innerText = "Note : " + mesAvis[i].noteLieu + "/10";

            const commentaireElement = document.createElement("p");
            commentaireElement.innerText = "Commentaire : " + mesAvis[i].commentaire;

            const dateElement = document.createElement("p");
            //Convertir la date en format français
            const date = new Date(mesAvis[i].date);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateFr = date.toLocaleDateString('fr-FR', options);
            mesAvis[i].date = dateFr;
            dateElement.innerText = "Date : " + mesAvis[i].date;

            const spotElement = document.createElement("p");
            spotElement.innerText = "Spot : " + nomSpot;


            const deleteElement = document.createElement("img");
            deleteElement.classList.add("deleteElement");
            deleteElement.src = "../images/bin2.png";
            

            sectionAvis.appendChild(avisElement);
            avisElement.appendChild(noteElement);
            avisElement.appendChild(commentaireElement);
            avisElement.appendChild(dateElement);
            avisElement.appendChild(spotElement);
            avisElement.appendChild(deleteElement);


        }
    }
    if (compteur === 0) {
        const sectionAvis = document.querySelector(".mesAvis");
        const avisElement = document.createElement("post");
        const messageElement = document.createElement("p");
        messageElement.innerText = "Vous n'avez pas encore publié d'avis";
        sectionAvis.appendChild(avisElement);
        avisElement.appendChild(messageElement);
    } else {
        const sectionAvis = document.querySelector(".mesAvis");
        const avisElement = document.createElement("post");
        const messageElement = document.createElement("p");
        messageElement.innerText = "Vous avez publié " + compteur + " avis";
        sectionAvis.appendChild(avisElement);
        avisElement.appendChild(messageElement);
    }
};

afficherMesAvis(mesAvis);

// Supprimer un avis
const sectionAvis = document.querySelector(".mesAvis");

sectionAvis.addEventListener("click", async function(event) {
    if (event.target.classList.contains("deleteElement")) {
        event.preventDefault();
        
        const deleteElement = event.target;
        console.log(deleteElement);
        //Récupérer l'id de l'avis
        const avisElement = deleteElement.parentElement;
        const avisId = avisElement.dataset.id;
        console.log(avisId);

        const response = await fetch(`https://surfmate-backend.onrender.com/api/avis/${avisId}`, {
            method: "DELETE",
            headers: {
                //Bearer token
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        if (response.ok) {
            // Suppression réussie de l'avis
            // Recalculer la note moyenne après la suppression
            await recalculerNoteMoyenne(mesAvis[i].spotId);
            window.location.href = "mes-avis.html";
        } else {
            alert(body.message);
        }
    }
});
