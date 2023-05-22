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

      const ligneElement = document.createElement("hr");
      ligneElement.innerText = "";


      // Ajouter chaque élément d'avis à l'élément avis
      avisElement.appendChild(ligneElement);
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
  
