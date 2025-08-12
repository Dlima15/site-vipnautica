// JS da Página de Anúncio — Strapi v5
console.log("anuncio.js carregado");

// --- Scroll suave para links internos ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
  });
});

// --- SKU da URL ---
const urlParams = new URLSearchParams(window.location.search);
const sku = (urlParams.get("sku") || "").trim();

// --- API Strapi ---
const BASE_URL = 'https://hopeful-success-7ef5924c0b.strapiapp.com'; // produção
const API = `${BASE_URL}/api/anuncios`;

// --- Carrossel ---
let fotoIndex = 0;
let fotos = [];
const PLACEHOLDER = '../assets/img/embarcacoes/placeholder.jpeg';

function mostrarFoto(index) {
  const img = document.getElementById('foto-barco');
  if (!img) return;

  if (!fotos.length) {
    img.src = PLACEHOLDER;
    return;
  }

  index = (index + fotos.length) % fotos.length;
  img.classList.remove('visible');
  setTimeout(() => {
    img.src = fotos[index];
    img.onload = () => img.classList.add('visible');
  }, 200);
  fotoIndex = index;
}

function mudarFoto(direcao) {
  if (!fotos.length) return;
  mostrarFoto(fotoIndex + direcao);
}
window.mudarFoto = mudarFoto;

// --- Helpers de mídia ---
function toAbs(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function buildImageUrls(media) {
  if (Array.isArray(media)) {
    return media.map(f => {
      const fmts = f?.formats || {};
      const u = fmts.medium?.url || fmts.large?.url || fmts.small?.url || fmts.thumbnail?.url || f?.url;
      return toAbs(u);
    }).filter(Boolean);
  }
  if (media?.url) {
    const fmts = media?.formats || {};
    const u = fmts.medium?.url || fmts.large?.url || fmts.small?.url || fmts.thumbnail?.url || media.url;
    return [toAbs(u)];
  }
  if (media?.data) {
    return (media.data || []).map(ff => {
      const fa = ff?.attributes || ff;
      const fmts = fa?.formats || {};
      const u = fmts.medium?.url || fmts.large?.url || fmts.small?.url || fmts.thumbnail?.url || fa?.url;
      return toAbs(u);
    }).filter(Boolean);
  }
  return [];
}

function normalizeItem(item) {
  const a = item?.attributes ? item.attributes : item;
  const fotosArr = buildImageUrls(a?.fotos);
  const capaArr  = buildImageUrls(a?.capa);
  const capa     = capaArr[0] || '';

  return {
    sku:         a?.sku ?? '',
    anuncio:     a?.anuncio ?? '',
    fabricante:  a?.fabricante ?? '',
    modelo:      a?.modelo ?? '',
    ano:         a?.ano ?? '',
    tamanho:     a?.tamanho ?? '',
    estilo:      a?.estilo ?? '',
    combustivel: a?.combustivel ?? '',
    motor:       a?.motor ?? '',
    horas:       (a?.horas ?? a?.horas === 0) ? a.horas : '',
    valor:       a?.valor ?? '',
    capa,
    fotos:       fotosArr,
    acessorios:  Array.isArray(a?.acessorios) ? a.acessorios : (a?.acessorios || [])
  };
}

// --- Busca no Strapi pelo SKU ---
async function fetchAnuncioBySku(sku) {
  const tryFetch = async (populateParam) => {
    const params = new URLSearchParams();
    params.set('filters[sku][$eq]', sku);
    params.set('pagination[pageSize]', '1');
    params.set('sort', 'updatedAt:desc');
    params.set('populate', populateParam);

    const url = `${API}?${params.toString()}`;
    console.log('GET', url);
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) {
      const msg = `HTTP ${res.status} - ${text.slice(0, 300)}`;
      throw new Error(msg);
    }
    const json = JSON.parse(text);
    const data = Array.isArray(json?.data) ? json.data : [];
    return data.length ? normalizeItem(data[0]) : null;
  };

  try {
    return await tryFetch('fotos,capa');
  } catch (e) {
    console.warn('Falha com populate=fotos,capa. Tentando apenas fotos...', e.message);
    return await tryFetch('fotos');
  }
}

// --- Render ---
function renderMiniaturas(arr) {
  const miniaturasContainer = document.getElementById('miniaturas');
  if (!miniaturasContainer) return;
  miniaturasContainer.innerHTML = '';
  if (!arr.length) return;

  arr.forEach((foto, index) => {
    const imgMini = document.createElement('img');
    imgMini.src = foto;
    imgMini.classList.add('miniatura');
    if (index === 0) imgMini.classList.add('ativa');

    imgMini.onclick = () => {
      mostrarFoto(index);
      document.querySelectorAll('.miniatura').forEach(el => el.classList.remove('ativa'));
      imgMini.classList.add('ativa');
    };

    miniaturasContainer.appendChild(imgMini);
  });
}

function renderAcessorios(list) {
  const acessoriosContainer = document.getElementById('acessorios');
  if (!acessoriosContainer) return;
  acessoriosContainer.innerHTML = '';

  if (!Array.isArray(list) || !list.length) {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = '—';
    ul.appendChild(li);
    acessoriosContainer.appendChild(ul);
    return;
  }

  const metade = Math.ceil(list.length / 2);
  const ul1 = document.createElement('ul');
  const ul2 = document.createElement('ul');

  list.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    (index < metade ? ul1 : ul2).appendChild(li);
  });

  acessoriosContainer.appendChild(ul1);
  acessoriosContainer.appendChild(ul2);
}

function renderItem(barco) {
  const titulo = barco.anuncio || `${barco.fabricante} ${barco.modelo} / ${barco.ano}`.trim();
  document.getElementById("titulo-barco").innerText = titulo;
  document.getElementById("sku").innerText = `SKU ${barco.sku || sku}`;

  document.getElementById("fabricante").innerText  = barco.fabricante || '';
  document.getElementById("modelo").innerText      = barco.modelo || '';
  document.getElementById("ano").innerText         = barco.ano || '';
  document.getElementById("tamanho").innerText     = barco.tamanho || '';
  document.getElementById("estilo").innerText      = barco.estilo || '';
  document.getElementById("combustivel").innerText = barco.combustivel || '';
  document.getElementById("motor").innerText       = barco.motor || '';
  document.getElementById("horas").innerText       = (barco.horas ?? '') === '' ? '' : String(barco.horas);
  document.getElementById("valor").innerText       = barco.valor || '';

  const btnLeft  = document.querySelector('.btn-nav.left');
  const btnRight = document.querySelector('.btn-nav.right');
  if (btnLeft)  btnLeft.title  = `SKU ${barco.sku || sku}`;
  if (btnRight) btnRight.title = `SKU ${barco.sku || sku}`;

  const galeria = [];
  if (barco.capa) galeria.push(barco.capa);
  (barco.fotos || []).forEach(u => { if (!galeria.includes(u)) galeria.push(u); });

  fotos = galeria.length ? galeria : [PLACEHOLDER];

  fotoIndex = 0;
  mostrarFoto(fotoIndex);
  renderMiniaturas(fotos);
  renderAcessorios(barco.acessorios);
}

// --- Boot ---
(async () => {
  try {
    if (!sku) {
      document.body.innerHTML = "<h1>Barco não encontrado (SKU ausente)</h1>";
      return;
    }

    const barco = await fetchAnuncioBySku(sku);
    if (!barco) {
      document.body.innerHTML = `<h1>Barco não encontrado</h1><p>SKU: ${sku}</p>`;
      return;
    }

    renderItem(barco);
  } catch (err) {
    console.error("Erro ao carregar dados do Strapi:", err);
    document.body.innerHTML = "<h1>Erro ao carregar dados. Tente novamente.</h1>";
  }
})();