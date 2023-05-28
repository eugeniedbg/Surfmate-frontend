const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication`)
const mesPublications = await reponse.json();

const userId = localStorage.getItem('userId');

async function afficherMesPublications(mesPublications) {
    mesPublications.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    for (let i = 0; i < mesPublications.length; i++) {
        if (mesPublications[i].userId === userId) {
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
};

afficherMesPublications(mesPublications);

// Supprimer une publication
// const deleteElement = document.querySelectorAll(".deleteElement");
// for (let i = 0; i < deleteElement.length; i++) {
//     deleteElement[i].addEventListener("click", async function (event) {
//         console.log("click");
//         event.preventDefault();
//         const postId = mesPublications[i]._id;
//         const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication/${postId}`, {
//             method: "DELETE",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         const body = await reponse.json();
//         if (reponse.ok) {
//             window.location.href = "mes-publications.html";
//         } else {
//             alert(body.message);
//         }
//     });
// }

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
