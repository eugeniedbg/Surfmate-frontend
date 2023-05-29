import { redirectToPreviousPage } from "../app.js";

// Récupérer tous les spots de la base de données
const reponse = await fetch('https://surfmate-backend.onrender.com/api/spot/');
const spots = await reponse.json();


const spotsMap = new Map();

for (const spot of spots) {
  // Utilisez une propriété unique du créneau comme clé dans le dictionnaire
  spotsMap.set(spot._id, {
    nom: spot.nom,
    ville: spot.ville,
    pays: spot.pays
  });
}


// Menu déroulant avec liste des spots

// Obtenez une référence vers l'élément select dans le HTML
const selectElement = document.getElementById('spots-liste');

// Parcourez les entrées du dictionnaire spotsMap
spotsMap.forEach((spot, key) => {
  // Créez un nouvel élément d'option
  const optionElement = document.createElement('option');
  
  // Définissez la valeur et le texte de l'option en utilisant les propriétés appropriées du spot
  optionElement.value = key; // Utilisez la clé du dictionnaire comme valeur de l'option
  optionElement.textContent = spot.nom + ", " + spot.ville + ", " + spot.pays; // Utilisez la propriété 'name' (ou toute autre propriété pertinente) du créneau comme texte de l'option
  
  // Ajoutez l'option à l'élément select
  selectElement.appendChild(optionElement);
});

// Sélectionner un spot 
const spot = document.getElementById("spots-liste");


//Envoyer les données au serveur
const boutonSubmit = document.getElementById("submitCreneau");
boutonSubmit.addEventListener("click", async function (event) {

    event.preventDefault();
    const userId = localStorage.getItem('userId');

    const inputDate = document.getElementById('datetime').value;

    const isoDate = new Date(inputDate).toISOString();

    const spot = document.getElementById("spots-liste");
    const spots = spot.options[spot.selectedIndex];
    const idSpot = spots.value;

    console.log(idSpot);


    // console.log(spots);

    console.log(isoDate);
    console.log(localStorage.getItem("userId"));
    
    const data = {
        date: isoDate,
        spotId: spots.value,
        userId: userId
    };
    const reponse = await fetch('https://surfmate-backend.onrender.com/api/creneau', {
        method: 'POST',
        headers: {
          //bearer token pour authentification
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const resultat = await reponse.json();
    if (resultat.error) {
        alert(resultat.error);
    } else {
        alert("Le créneau a bien été ajouté !");
        redirectToPreviousPage();//TODO : rediriger vers la page où l'utilisateur se trouvait avant de se connecter
    }
});



