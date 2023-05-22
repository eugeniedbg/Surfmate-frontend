import { redirectToPreviousPage } from "../app.js";

const form = document.querySelector('form');
const autocomp = document.getElementById('autocomp');

const villes = ['Paris', 'Pluton', 'Montpellier'];

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

form.addEventListener('input', (event) => {
  const element = event.target;
  const value = normalizeString(element.value);
  const matches = [];

  if (value.length > 0) {
    matches.push(...villes.filter(ville => normalizeString(ville).startsWith(value)));
  }

  autocomp.innerHTML = '';
  
  matches.forEach(match => {
    const p = document.createElement('p');
    p.textContent = match;
    p.addEventListener('click', () => {
      element.value = match;
      autocomp.innerHTML = '';
    });
    autocomp.appendChild(p);
  });
});





//const reponse = await fetch('http://localhost:3001/api/spot/');

// Vérifier que la ville existe
const ville = document.getElementById("ville");
const villeErreur = document.getElementById("villeErreur");
const villeValide = document.getElementById("villeValide");

ville.addEventListener("blur", () => {
  const villeValue = ville.value;
  
  // Effectuer une requête à l'API de géocodage pour vérifier si la ville existe
  
  // Exemple avec l'API OpenCage Geocoder
  const apiKey = "6c9ff0e6d70c48c5afe5d70efe5c79c4";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(villeValue)}&key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        villeErreur.textContent = "";
        villeValide.textContent = "La ville existe.";
      } else {
        villeErreur.textContent = "La ville n'existe pas.";
        villeValide.textContent = "";
      }
    })
    .catch(error => {
      console.error("Erreur lors de la vérification de la ville :", error);
      villeErreur.textContent = "Erreur lors de la vérification de la ville.";
      villeValide.textContent = "";
    });
});

// Vérifier que le pays existe
const pays = document.getElementById("pays");
const paysErreur = document.getElementById("paysErreur");
const paysValide = document.getElementById("paysValide");

pays.addEventListener("blur", () => {
  const paysValue = pays.value;
  
  // Effectuer une requête à l'API de géocodage pour vérifier si le pays existe
  
  // Exemple avec l'API OpenCage Geocoder
  const apiKey = "6c9ff0e6d70c48c5afe5d70efe5c79c4";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(paysValue)}&key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        paysErreur.textContent = "";
        paysValide.textContent = "Le pays existe.";
      } else {
        paysErreur.textContent = "Le pays n'existe pas.";
        paysValide.textContent = "";
      }
    })
    .catch(error => {
      console.error("Erreur lors de la vérification du pays :", error);
      paysErreur.textContent = "Erreur lors de la vérification du pays.";
      paysValide.textContent = "";
    });
});




//Envoyer les données au serveur
const boutonSubmit = document.getElementById("submitSpot");
boutonSubmit.addEventListener("click", async function (event) {
    event.preventDefault();
    
    const data = {
        nom: nom.value,
        ville: ville.value,
        pays: pays.value,
        GPS: GPS?.value,
    };
    const reponse = await fetch('http://localhost:3001/api/spot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const resultat = await reponse.json();
    if (resultat.error) {
        alert(resultat.error);
    } else {
        alert("Le spot a bien été ajouté !");
        redirectToPreviousPage();//TODO : rediriger vers la page où l'utilisateur se trouvait avant de se connecter
    }
});

