

const btnSupprimer = document.getElementById('supprimerCompte');

btnSupprimer.addEventListener('click', async function() {
    const userId = localStorage.getItem('userId');
    await SupprimerPublication(userId);
    await SupprimerCreneau(userId);
    await SupprimerAvis(userId);
    await SupprimerUser(userId);
    localStorage.clear();
    window.location.href = '../principale/principale.html';
});

export async function SupprimerUser(userId) {
    const token = localStorage.getItem('token');
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/auth/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const utilisateur = await reponse.json();
    console.log(utilisateur);
}

export async function SupprimerPublication(userId) {
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication/`);
    const publication = await reponse.json();
    console.log(publication);
    for (let i = 0; i < publication.length; i++) {
        if (publication[i].userId === userId) {
            const reponse = await fetch(`https://surfmate-backend.onrender.com/api/publication/${publication[i]._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
            });
            const publicationSupprimee = await reponse.json();
            console.log(publicationSupprimee);
        }
    }
}

export async function SupprimerCreneau(userId) {
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/creneau`);
    const creneau = await reponse.json();
    console.log(creneau);
    for (let i = 0; i < creneau.length; i++) {
        if (creneau[i].userId === userId) {
            const reponse = await fetch(`https://surfmate-backend.onrender.com/api/creneau/${creneau[i]._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const creneauSupprime = await reponse.json();
            console.log(creneauSupprime);
        }
    
    }
};

export async function SupprimerAvis(userId) {
    const reponse = await fetch(`https://surfmate-backend.onrender.com/api/avis`);
    const avis = await reponse.json();
    console.log(avis);
    for (let i = 0; i < avis.length; i++) {
        if (avis[i].userId === userId) {
            const reponse = await fetch(`https://surfmate-backend.onrender.com/api/avis/${avis[i]._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const avisSupprime = await reponse.json();
            console.log(avisSupprime);
        }
    }
}