export async function afficherAvis(avis, spotId) {
  const sectionAvis = document.getElementsByClassName("avis_" + spotId)[0];
  
  if (sectionAvis.childElementCount !== 0) {
    masquerAvis(spotId);
  }
  
  if (avis.length === 0) {
    const aucunAvisElement = document.createElement("p");
    aucunAvisElement.innerText = "Aucun avis pour le moment";
    sectionAvis.appendChild(aucunAvisElement);
    return;
  }
  
  // Trier les avis par date (du plus récent au plus ancien)
  avis.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  for (const avisObj of avis) {
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
    const date = new Date(avisObj.date);
    avisObj.date = date.toLocaleDateString();
    dateElement.innerText = avisObj.date;
    dateElement.style.textAlign = "right";

    const ligneElement = document.createElement("hr");

    avisElement.appendChild(ligneElement);
    avisElement.appendChild(dateElement);
    avisElement.appendChild(auteurElement);
    avisElement.appendChild(noteElement);
    avisElement.appendChild(commentaireElement);
    sectionAvis.appendChild(avisElement);
  }
}

export async function afficherAvisSpots(spots) {
  for (const spot of spots) {
    const avisReponse = await fetch(`https://surfmate-backend.onrender.com/api/avis/${spot.spotId}`);
    const avis = await avisReponse.json();
    afficherAvis(avis, spot.spotId);
  }
}

export function masquerAvis(spotId) {
  const sectionAvis = document.getElementsByClassName("avis_" + spotId)[0];
  sectionAvis.innerHTML = ""; // Supprime tous les éléments enfants de la section des avis
}

export function ajouterAvisSpot(spotId) {
  window.location.href = `./ajout-avis-spot.html?spot_id=${spotId}`;
}
