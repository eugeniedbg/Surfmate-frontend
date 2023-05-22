import { redirectToPreviousPage } from '../../app.js';

const boutonSubmit = document.getElementById("submitLogin");
boutonSubmit.addEventListener("click", async function (event) {

    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // const email = form.parentNode.querySelector('#email').value;
    // const password = form.parentNode.querySelector('#password').value;
    console.log(email, password);
    try {
        const response = await fetch('https://surfmate-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.log(error);
        } else {
            const res = await response.json();
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.userId);
            redirectToPreviousPage();
        }
    } catch (err) {
        console.log(err);
    }
}
);
