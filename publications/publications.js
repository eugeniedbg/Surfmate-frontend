import { afficherNavBarBoutons, responsiveNavBar } from "../app.js";

const reponse = await fetch('http://localhost:3001/api/publication/?populate=userId')
const publications = await reponse.json();

async function afficherPublications(publications) {
    publications.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
    for (let i = 0; i < publications.length; i++) {
        const post = publications[i];
        const sectionPublications = document.querySelector(".publications");
        const publicationElement = document.createElement("post");
        
        // Obtenir le pseudo de l'utilisateur
        const reponse = await fetch(`http://localhost:3001/api/auth/${post.userId}`);
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

// afficherNavBarBoutons();


afficherNavBarBoutons();

responsiveNavBar();

const btnAjoutPublication = document.getElementById('btnAjoutPublication');
btnAjoutPublication.addEventListener('click', redirectButton);

export function redirectButton() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '../publications/ajout-publication.html';
    } else {
        window.location.href = '../user/Connexion-Inscription.html';
    }
}


