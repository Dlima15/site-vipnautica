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
  

  // função que puxha os dados do json

  let fotoIndex = 0;
let fotos = [];

fetch('../../data/embarcacoes.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('titulo-barco').textContent = data.anuncio;
    document.getElementById('sku').textContent = `SKU ${data.sku}`;
    document.getElementById('fabricante').textContent = data.fabricante;
    document.getElementById('modelo').textContent = data.modelo;
    document.getElementById('ano').textContent = data.ano;
    document.getElementById('tamanho').textContent = data.tamanho;
    document.getElementById('estilo').textContent = data.estilo;
    document.getElementById('combustivel').textContent = data.combustivel;
    document.getElementById('motor').textContent = data.motor;
    document.getElementById('horas').textContent = data.horas;
    document.getElementById('valor').textContent = data.valor;

    // Carregar fotos
    fotos = data.fotos;
    mostrarFoto(fotoIndex);

    // Carregar acessórios (2 colunas)
    const acessoriosContainer = document.getElementById('acessorios');
    const metade = Math.ceil(data.acessorios.length / 2);
    const ul1 = document.createElement('ul');
    const ul2 = document.createElement('ul');

    data.acessorios.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;
      index < metade ? ul1.appendChild(li) : ul2.appendChild(li);
    });

    acessoriosContainer.appendChild(ul1);
    acessoriosContainer.appendChild(ul2);
  })
  .catch(err => console.error('Erro ao carregar JSON:', err));

// Função para trocar fotos


function mostrarFoto(index) {
  const img = document.getElementById('foto-barco');
  if (fotos.length > 0) {
    img.classList.remove('visible');

    setTimeout(() => {
      img.src = fotos[index];

      img.onload = () => {
        img.classList.add('visible');
      };
    }, 200);
  }
}

function mudarFoto(direcao) {
  fotoIndex += direcao;

  // Corrige ciclo infinito
  if (fotoIndex < 0) {
    fotoIndex = fotos.length - 1;
  } else if (fotoIndex >= fotos.length) {
    fotoIndex = 0;
  }

  mostrarFoto(fotoIndex);
}