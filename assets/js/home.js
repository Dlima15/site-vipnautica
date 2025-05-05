// JS da Home
// Funcionalidade pra rodar os cards do seminovos
function scrollCarousel(direction) {
  const carrossel = document.getElementById("carrossel");
  const cardWidth = carrossel.querySelector(".card-barco").offsetWidth + 20;
  carrossel.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
}


// fim da funionalidade

