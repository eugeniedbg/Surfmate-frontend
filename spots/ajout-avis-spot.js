import { isTokenExpired, clearToken, redirectToPreviousPage } from "../app.js";


let selectedNote = null;
const noteButtons = document.querySelectorAll(".note-button");

function setNoteValue(value) {
    if (selectedNote !== null) {
    selectedNote.classList.remove("active");
    }
    selectedNote = noteButtons[value];
    selectedNote.classList.add("active");
    document.getElementById("note").value = value;
}

export async function submitForm(event) {
    event.preventDefault();
    document.getElementById("note").removeAttribute("readonly");
    // Ajoutez ici le code pour soumettre le formulaire à votre backend

    //Récupérer le spotId
    const spotId = window.location.search.split('=')[1];
    console.log(spotId);

    //Récupérer le userId
    const userId = localStorage.getItem('userId');
    console.log(userId);

    //Récupérer la note
    const note = document.getElementById("note").value;
    console.log(note);

    //Récupérer le commentaire
    const commentaire = document.getElementById("commentaire").value;
    console.log(commentaire);

    const date = Date.now();


    //Envoyer les données au serveur
    const data = {
        spotId: spotId,
        userId: userId,
        date: date,
        noteLieu: note,
        commentaire: commentaire
    };
    console.log(localStorage.getItem('token'));
    const reponse = await fetch('https://surfmate-backend.onrender.com/api/avis', {
        method: 'POST',
        headers: {
            //Bearer token
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const resultat = await reponse.json();
    if (resultat.error) {
        alert(resultat.error);
    } else {
        alert('Votre avis a bien été ajouté');
        window.location.href = '../spots/Spots.html';
    }

}

const form = document.getElementById("avis-form");
form.addEventListener("submit", submitForm);

noteButtons.forEach(function(button) {
    button.addEventListener("click", function() {
    const value = parseInt(button.getAttribute("data-value"));
    setNoteValue(value);
    });
});
 

  
