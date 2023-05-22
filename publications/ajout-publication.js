const commentaire = document.getElementById('commentSection');
const btnEnvoyer = document.getElementById('btnEnvoyer');

import { redirectToPreviousPage } from '../app.js';

btnEnvoyer.addEventListener('click', async function(event) {
    event.preventDefault();
    const userId = localStorage.getItem('userId');

    const data = {
        userId: userId,
        commentaire: commentaire.value
    };
    console.log(data);
    console.log(localStorage.getItem('token'));

    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication/`, {
        method: 'POST',
        headers: {
            //bearer token pour authentification
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'   
        },
        body: JSON.stringify(data)
    });
    const publication = await reponse.json();
    console.log(publication);
    if (publication.error) {
        alert(publication.error);
    } else {
        alert("Votre publication a bien été ajoutée !");
        redirectToPreviousPage();//TODO : rediriger vers la page où l'utilisateur se trouvait avant de se connecter
    }
});
