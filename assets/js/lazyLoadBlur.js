// lazyLoadBlur.js

export function aplicarLazyLoadBlur() {
  const imagens = document.querySelectorAll("img");

  imagens.forEach(img => {
    const originalSrc = img.getAttribute("src");

    // Cria o nome da imagem em baixa qualidade (ex: 1.jpeg → 1-low.jpeg)
    const lowQualitySrc = originalSrc.replace(/(\.jpg|\.jpeg|\.png)/i, '-low$1');

    const highRes = new Image();
    highRes.src = originalSrc;

    highRes.onload = () => {
      img.src = highRes.src;
      img.style.filter = "blur(0)";
    };

    // Aplica imagem em baixa qualidade com efeito de blur
    img.src = lowQualitySrc;
    img.style.filter = "blur(20px)";
    img.style.transition = "filter 0.5s ease-out";
  });
}
