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

// Pega o SKU direto da URL (?sku=12345)
const urlParams = new URLSearchParams(window.location.search);
const sku = urlParams.get("sku");

// Carrossel de fotos
let fotoIndex = 0;
let fotos = [];

function mostrarFoto(index) {
  const img = document.getElementById('foto-barco');
  if (fotos.length > 0) {
    img.classList.remove('visible');
    setTimeout(() => {
      img.src = fotos[index];
      img.onload = () => img.classList.add('visible');
    }, 200);
  }
}

function mudarFoto(direcao) {
  fotoIndex += direcao;
  if (fotoIndex < 0) fotoIndex = fotos.length - 1;
  else if (fotoIndex >= fotos.length) fotoIndex = 0;
  mostrarFoto(fotoIndex);
}

// Busca os dados da embarcação
fetch("../data/embarcacoes.json")
  .then(res => res.json())
  .then(dados => {
    const barco = dados.find(b => b.sku === sku);
    if (!barco) {
      document.body.innerHTML = "<h1>Barco não encontrado</h1>";
      return;
    }

    document.getElementById("titulo-barco").innerText = barco.anuncio;
    document.getElementById("sku").innerText = `SKU ${barco.sku}`;
    document.getElementById("modelo").innerText = barco.modelo;
    document.getElementById("ano").innerText = barco.ano;
    document.getElementById("tamanho").innerText = barco.tamanho;
    document.getElementById("estilo").innerText = barco.estilo;
    document.getElementById("combustivel").innerText = barco.combustivel;
    document.getElementById("motor").innerText = barco.motor;
    document.getElementById("horas").innerText = barco.horas;
    document.getElementById("valor").innerText = barco.valor;

    document.querySelector('.seta-esquerda').title = `SKU ${barco.sku}`;
    document.querySelector('.seta-direita').title = `SKU ${barco.sku}`;

    fotos = barco.fotos;
    console.log(fotos);

    mostrarFoto(fotoIndex);

    const acessoriosContainer = document.getElementById('acessorios');
    const metade = Math.ceil(barco.acessorios.length / 2);
    const ul1 = document.createElement('ul');
    const ul2 = document.createElement('ul');

    barco.acessorios.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;
      index < metade ? ul1.appendChild(li) : ul2.appendChild(li);
    });

    acessoriosContainer.appendChild(ul1);
    acessoriosContainer.appendChild(ul2);
  })
  .catch(err => console.error("Erro ao carregar JSON:", err));
