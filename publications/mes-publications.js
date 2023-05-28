const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication`)
const mesPublications = await reponse.json();

const userId = localStorage.getItem('userId');

async function afficherMesPublications(mesPublications) {
    mesPublications.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    let compteur = 0;

    for (let i = 0; i < mesPublications.length; i++) {
        if (mesPublications[i].userId === userId) {
            compteur++;
            const post = mesPublications[i];
            const sectionPublications = document.querySelector(".mesPublications");
            const publicationElement = document.createElement("post");
            publicationElement.dataset.id = mesPublications[i]._id;
            
            const deleteElement = document.createElement("img");
            deleteElement.classList.add("deleteElement");

            // Définir l'attribut src de l'image avec l'URL de l'image
            deleteElement.src = "../images/bin2.png";


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
            publicationElement.appendChild(deleteElement);
            publicationElement.appendChild(pseudoElement);
            publicationElement.appendChild(dateElement);
            publicationElement.appendChild(commentaireElement);
        }
    }
    if (compteur === 0) {
        const sectionPublications = document.querySelector(".mesPublications");
        const publicationElement = document.createElement("post");
        const commentaireElement = document.createElement("p");
        commentaireElement.innerText = "Vous n'avez pas encore publié de post";
        sectionPublications.appendChild(publicationElement);
        publicationElement.appendChild(commentaireElement);
    } else {
        const sectionPublications = document.querySelector(".mesPublications");
        const publicationElement = document.createElement("post");
        const commentaireElement = document.createElement("p");
        commentaireElement.innerText = "Vous avez publié " + compteur + " post(s)";
        sectionPublications.appendChild(publicationElement);
        publicationElement.appendChild(commentaireElement);
    }
};

afficherMesPublications(mesPublications);

// Supprimer une publication
const sectionPublications = document.querySelector(".mesPublications");

sectionPublications.addEventListener("click", async function(event) {
    if (event.target.classList.contains("deleteElement")) {
        event.preventDefault();
        
        const deleteElement = event.target;
        console.log(deleteElement);
        const publicationElement = deleteElement.parentElement;
        const postId = publicationElement.dataset.id;
        console.log(postId);

        const response = await fetch(`https://surfmate-backend.onrender.com/api/publication/${postId}`, {
            method: "DELETE",
            headers: {
                //Bearer token
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        if (response.ok) {
            window.location.href = "mes-publications.html";
        } else {
            alert(body.message);
        }
    }
});
