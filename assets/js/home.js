// JS da Home
console.log("home.js carregado");

// --- Funcionalidade de Carrossel ---
function scrollCarousel(carrosselId, direction) {
    const carousel = document.getElementById(carrosselId);
    const scrollAmount = 300; // ajuste conforme necessário
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// --- Funcionalidade de Scroll Suave para Links Internos ---
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

// --- Funcionalidade de Clique nos Cards de Barco ---
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os cards de barco
    const cardsBarco = document.querySelectorAll('.card-barco');

    cardsBarco.forEach(card => {
        card.addEventListener('click', () => {
            // Encontra o elemento .sku dentro do card
            const skuElement = card.querySelector('.sku');
            
            if (skuElement) {
                // Extrai o texto do SKU e remove "SKU #" ou espaços em branco
                // Ex: "SKU #3550" -> "3550"
                const skuText = skuElement.textContent.replace('SKU #', '').trim();
                
                // Verifica se o SKU foi encontrado e é válido (não vazio)
                if (skuText) {
                    // Redireciona para a página de anúncio com o SKU como parâmetro
                    window.location.href = `./pages/anuncio.html?sku=${skuText}`;
                } else {
                    console.warn('SKU não encontrado ou vazio no card:', card);
                }
            } else {
                console.warn('Elemento .sku não encontrado dentro do card:', card);
            }
        });
    });
});