import { afficherNavBarBoutons } from "../app.js";

// add no-corse policy
const reponse = await fetch('https://surfmate-backend.onrender.com/api/publication/?populate=userId', {
        mode: 'no-cors'
    })
const publications = await reponse.json();

async function afficherPublications(publications) {
    publications.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
    for (let i = 0; i < 4 /* publications.length */; i++) {
        const post = publications[i];
        const sectionPublications = document.querySelector(".publications");
        const publicationElement = document.createElement("post");
        
        // Obtenir le pseudo de l'utilisateur
        const reponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/${post.userId}`);
        const utilisateur = await reponse.json();
        const pseudoElement = document.createElement("h2");
        pseudoElement.innerText = utilisateur.pseudo;

        const dateElement = document.createElement("p");
        const date = new Date(post.date);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('fr-FR', options);
        dateElement.innerText = formattedDate;

        const commentaireElement = document.createElement("p");
        commentaireElement.innerText = post.commentaire;

        sectionPublications.appendChild(publicationElement);
        publicationElement.appendChild(pseudoElement);
        publicationElement.appendChild(dateElement);
        publicationElement.appendChild(commentaireElement);
    }
}

afficherPublications(publications);


afficherNavBarBoutons();




