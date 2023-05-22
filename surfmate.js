const titreSpans = document.querySelectorAll('h1 span');
const sstitre = document.querySelector('.sous-titre');
const logo = document.querySelector('.logo');
const medias = document.querySelectorAll('.bulle');
const l1 = document.querySelector('.l1');
const l2 = document.querySelector('.l2');

window.addEventListener('load', () => {

    const TL = gsap.timeline({paused: true});

    TL
    .from(titreSpans, {duration: 1, top: -50, opacity: 0, ease: "power2.out", stagger: 0.3})
    .from(sstitre, {duration: 1, opacity: 0, ease: "power2.out"}, 1, '-=1')
    .from(l1, {duration: 1, width: 0, ease: "power2.out"}, '-=2')
    .from(l2, {duration: 1, width: 0, ease: "power2.out"}, '-=2')
    .from(logo, {duration: 0.4, transform: "scale(0)", ease: "power2.out"}, '-=2')
    .from(medias, {duration: 1, right: -200, ease: "power2.out"}, 0.3, '-=1');

    
    

    TL.play();
});