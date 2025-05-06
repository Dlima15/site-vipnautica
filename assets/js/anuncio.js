// JS da Página de Anúncio
console.log("teste js")
// scroll header

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
  