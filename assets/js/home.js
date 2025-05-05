// JS da Home
// Funcionalidade pra rodar os cards do seminovos
function scrollCarousel(direction) {
  const carrossel = document.getElementById("carrossel");
  const cardWidth = carrossel.querySelector(".card-barco").offsetWidth + 20;
  carrossel.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
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
