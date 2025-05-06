// JS da Home
// Funcionalidade pra rodar os cards do seminovos
function scrollCarousel(carrosselId, direction) {
  const carousel = document.getElementById(carrosselId);
  const scrollAmount = 300; // ajuste conforme necessário
  carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// fim da funionalidade
 

//Função scroll site 

// scroll.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // ajuste se o header for fixo
        behavior: "smooth"
      });
    }
  });
});
