export function afficherAvis(avis, spotId) {

  const sectionAvis = document.getElementsByClassName("avis_"+spotId)[0];

  if (sectionAvis.childElementCount != 0) {
    return masquerAvis()
  };
  
    // Boucler sur chaque avis et créer un élément HTML pour chaque avis
    avis.forEach(async (avisObj) => {

      const avisElement = document.createElement("div");
      avisElement.classList.add("avis-item");
      
      const userReponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/${avisObj.userId}`);
      const user = await userReponse.json();
      const auteurElement = document.createElement("p");
      auteurElement.innerText = "Utilisateur : " + user.pseudo;
      
      const noteElement = document.createElement("p");
      noteElement.innerText = "Note : " + avisObj.noteLieu + "/10";
  
      const commentaireElement = document.createElement("p");
      commentaireElement.innerText = "Commentaire : " + avisObj.commentaire;

      const dateElement = document.createElement("p");
      //convertir la date en format lisible 
      const date = new Date(avisObj.date);
      avisObj.date = date.toLocaleDateString();
      dateElement.innerText = avisObj.date;
      // aligner à droite la date
      dateElement.style.textAlign = "right";

      const ligneElement = document.createElement("hr");
      ligneElement.innerText = "";
      // const sautElement = document.createElement("br");
      // sautElement.innerText = "";


      // Ajouter chaque élément d'avis à l'élément avis
      avisElement.appendChild(ligneElement);
      avisElement.appendChild(dateElement);
      // avisElement.appendChild(sautElement);
      avisElement.appendChild(auteurElement);
      avisElement.appendChild(noteElement);
      avisElement.appendChild(commentaireElement);
      sectionAvis.appendChild(avisElement);
    });

    if (avis.length == 0) {
      const aucunAvisElement = document.createElement("p");
      aucunAvisElement.innerText = "Aucun avis pour le moment";
      sectionAvis.appendChild(aucunAvisElement);
    }
}
  
export function masquerAvis(spotId) {
  const sectionAvis = document.getElementsByClassName("avis_" + spotId)[0];
  sectionAvis.innerHTML = ""; // Supprime tous les éléments enfants de la section des avis
}

export function ajouterAvisSpot(spotId) {
  window.location.href = `./ajout-avis-spot.html?spot_id=${spotId}`;
}
  
export async function recalculerNoteMoyenne(spotId) {
  const reponse = await fetch(`https://surfmate-backend.onrender.com/api/spot/${spotId}/avis`);
  const avis = await reponse.json();

  // Calculer la nouvelle note moyenne
  let sommeNotes = 0;
  for (let i = 0; i < avis.length; i++) {
    sommeNotes += avis[i].noteLieu;
  }
  const nouvelleNoteMoyenne = sommeNotes / avis.length;

  // Mettre à jour la note moyenne du spot sur le serveur
  const updateResponse = await fetch(`https://surfmate-backend.onrender.com/api/spot/${spotId}`, {
    method: "PUT", // Utilisez PUT ou PATCH selon l'API
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ noteMoyenne: nouvelleNoteMoyenne }),
  });

  if (updateResponse.ok) {
    // Succès de la mise à jour de la note moyenne
    console.log("Note moyenne mise à jour avec succès !");
  } else {
    // Gestion des erreurs en cas d'échec de la mise à jour
    const errorBody = await updateResponse.json();
    console.log("Erreur lors de la mise à jour de la note moyenne :", errorBody.message);
  }
}
