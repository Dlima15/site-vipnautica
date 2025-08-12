// JS da Página de Filtros - Strapi v5
console.log("filtro.js carregado");

// --- Variáveis Globais ---
let todasEmbarcacoes = [];
let embarcacoesFiltradas = [];

// --- DOM ---
const barcosContainer   = document.getElementById('barcos-container');
const fabricanteFilter  = document.getElementById('fabricante-filter');
const modeloFilter      = document.getElementById('modelo-filter');
const tamanhoFilter     = document.getElementById('tamanho-filter');
const anoFilter         = document.getElementById('ano-filter');
const combustivelFilter = document.getElementById('combustivel-filter');
const limparFiltrosBtn  = document.querySelector('.btn-limpar-filtros');
const ordenarRadios     = document.querySelectorAll('input[name="ordenar"]');

// --- API ---
const BASE_URL = 'https://hopeful-success-7ef5924c0b.strapiapp.com'; // produção
const API = `${BASE_URL}/api/anuncios`;

// Scroll suave (âncoras)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute("href"));
    if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: "smooth" });
  });
});

// Cabeçalho da tabela
function renderizarCabecalhoListagem() {
  const headerHtml = `
    <div class="listagem-header">
      <span class="col-header"></span>
      <span class="col-header">Modelo</span>
      <span class="col-header">Fabricante</span>
      <span class="col-header">Tamanho</span>
      <span class="col-header">Ano</span>
      <span class="col-header">Motor</span>
      <span class="col-header">Sku</span>
    </div>
  `;
  barcosContainer.insertAdjacentHTML('afterbegin', headerHtml);
}

// Preenche selects dos filtros
function preencherOpcoesFiltro() {
  const fabricantes  = new Set();
  const modelos      = new Set();
  const tamanhos     = new Set();
  const anos         = new Set();
  const combustiveis = new Set();

  todasEmbarcacoes.forEach(b => {
    if (b.fabricante)  fabricantes.add(b.fabricante);
    if (b.modelo)      modelos.add(b.modelo);
    if (b.tamanho)     tamanhos.add(b.tamanho);
    if (b.ano)         anos.add(b.ano);
    if (b.combustivel) combustiveis.add(b.combustivel);
  });

  const add = (select, set) => {
    select.innerHTML = '<option value="todos">Todos</option>';
    Array.from(set)
      .sort((a, b) => (''+a).localeCompare(''+b, 'pt-BR', { numeric: true }))
      .forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        select.appendChild(o);
      });
  };

  add(fabricanteFilter, fabricantes);
  add(modeloFilter, modelos);
  add(tamanhoFilter, tamanhos);
  add(anoFilter, anos);
  add(combustivelFilter, combustiveis);
}

// Render cards/lista
function renderizarBarcos(lista) {
  barcosContainer.innerHTML = '';
  renderizarCabecalhoListagem();

  if (!lista.length) {
    barcosContainer.innerHTML += '<p class="no-results">Nenhuma embarcação encontrada com os filtros aplicados.</p>';
    return;
  }

  lista.forEach(barco => {
    const a = document.createElement('a');
    a.href = `anuncio.html?sku=${encodeURIComponent(barco.sku || '')}`;
    a.classList.add('barco-item');

    const fotoSrc = (barco.fotos && barco.fotos.length)
      ? barco.fotos[0]
      : '../assets/img/embarcacoes/placeholder.jpeg';

    a.innerHTML = `
      <div class="barco-img">
        <img src="${fotoSrc}" alt="${barco.anuncio ?? ''}">
      </div>
      <span class="barco-info modelo">${barco.modelo ?? ''}</span>
      <span class="barco-info fabricante">${barco.fabricante ?? ''}</span>
      <span class="barco-info tamanho">${barco.tamanho ?? ''}</span>
      <span class="barco-info ano">${barco.ano ?? ''}</span>
      <span class="barco-info motor">${barco.motor ?? ''}</span>
      <span class="barco-info sku-btn">${barco.sku ?? ''}</span>
    `;
    barcosContainer.appendChild(a);
  });
}

// Aplicar filtros + ordenação
function aplicarFiltrosEOrdenar() {
  let lista = [...todasEmbarcacoes];

  const fFab  = fabricanteFilter.value;
  const fMod  = modeloFilter.value;
  const fTam  = tamanhoFilter.value;
  const fAno  = anoFilter.value;
  const fComb = combustivelFilter.value;

  if (fFab  !== 'todos') lista = lista.filter(b => b.fabricante  === fFab);
  if (fMod  !== 'todos') lista = lista.filter(b => b.modelo      === fMod);
  if (fTam  !== 'todos') lista = lista.filter(b => String(b.tamanho).replace('’','') === String(fTam).replace('’',''));
  if (fAno  !== 'todos') lista = lista.filter(b => b.ano         === fAno);
  if (fComb !== 'todos') lista = lista.filter(b => b.combustivel === fComb);

  const ordenarPor = document.querySelector('input[name="ordenar"]:checked').value;
  lista.sort((a, b) => {
    let A, B;
    switch (ordenarPor) {
      case 'fabricante':
        A = (a.fabricante||'').toLowerCase(); B = (b.fabricante||'').toLowerCase(); break;
      case 'tamanho':
        A = parseFloat(String(a.tamanho||'').replace('’',''))||0;
        B = parseFloat(String(b.tamanho||'').replace('’',''))||0;
        break;
      case 'ano':
        A = parseInt(a.ano)||0; B = parseInt(b.ano)||0; break;
      case 'sku':
        A = parseInt(a.sku)||0; B = parseInt(b.sku)||0; break;
      default:
        A = (a.fabricante||'').toLowerCase(); B = (b.fabricante||'').toLowerCase();
    }
    return A < B ? -1 : A > B ? 1 : 0;
  });

  embarcacoesFiltradas = lista;
  renderizarBarcos(lista);
  mostrarToast();
}

// Listeners
[fabricanteFilter, modeloFilter, tamanhoFilter, anoFilter, combustivelFilter].forEach(el => {
  el.addEventListener('change', aplicarFiltrosEOrdenar);
});
ordenarRadios.forEach(r => r.addEventListener('change', aplicarFiltrosEOrdenar));

limparFiltrosBtn.addEventListener('click', () => {
  fabricanteFilter.value  = 'todos';
  modeloFilter.value      = 'todos';
  tamanhoFilter.value     = 'todos';
  anoFilter.value         = 'todos';
  combustivelFilter.value = 'todos';
  document.querySelector('input[name="ordenar"][value="fabricante"]').checked = true;
  aplicarFiltrosEOrdenar();
  mostrarToast();
});

// --- Util: URL absoluta para imagens ---
function toAbs(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// --- Util: monta URLs de imagens (v5 múltipla/single + fallback v4) ---
function buildImageUrls(fotosField) {
  if (!fotosField) return [];

  if (Array.isArray(fotosField)) {
    return fotosField.map(f => {
      const fmts = f?.formats || {};
      const u = fmts.small?.url || fmts.medium?.url || fmts.thumbnail?.url || f?.url;
      return toAbs(u);
    }).filter(Boolean);
  }

  if (fotosField?.url) {
    const fmts = fotosField?.formats || {};
    const u = fmts.small?.url || fmts.medium?.url || fmts.thumbnail?.url || fotosField.url;
    return [toAbs(u)];
  }

  if (fotosField?.data) {
    return (fotosField.data || []).map(ff => {
      const fa = ff?.attributes || ff;
      const fmts = fa?.formats || {};
      const u = fmts.small?.url || fmts.medium?.url || fmts.thumbnail?.url || fa?.url;
      return toAbs(u);
    }).filter(Boolean);
  }

  return [];
}

// Normalização (v5 chapado + fallback v4)
function normalizeStrapiItem(item) {
  const a = item?.attributes ? item.attributes : item;
  return {
    sku:         a?.sku ?? '',
    fabricante:  a?.fabricante ?? '',
    modelo:      a?.modelo ?? '',
    tamanho:     a?.tamanho ?? '',
    ano:         a?.ano ?? '',
    estilo:      a?.estilo ?? '',
    combustivel: a?.combustivel ?? '',
    motor:       a?.motor ?? '',
    horas:       a?.horas ?? 0,
    valor:       a?.valor ?? '',
    anuncio:     a?.anuncio ?? '',
    fotos:       buildImageUrls(a?.fotos),
    acessorios:  Array.isArray(a?.acessorios) ? a.acessorios : (a?.acessorios || []),
  };
}

// ===== Carregar do Strapi v5 (com paginação) =====
async function loadAllAnuncios() {
  const pageSize = 100;
  let page = 1, pageCount = 1;
  const out = [];

  do {
    const params = new URLSearchParams();
    params.set('pagination[page]', String(page));
    params.set('pagination[pageSize]', String(pageSize));
    params.set('populate', 'fotos');

    const res = await fetch(`${API}?${params.toString()}`);
    if (!res.ok) throw new Error(await res.text());

    const json = await res.json();
    (json.data || []).forEach(it => out.push(normalizeStrapiItem(it)));
    pageCount = json?.meta?.pagination?.pageCount || 1;
    page++;
  } while (page <= pageCount);

  return out;
}

// Boot
(async () => {
  try {
    todasEmbarcacoes = await loadAllAnuncios();
    preencherOpcoesFiltro();
    aplicarFiltrosEOrdenar();
  } catch (e) {
    console.error('Erro ao carregar dados do Strapi:', e);
    barcosContainer.innerHTML = '<p class="no-results">Erro ao carregar dados. Tente novamente.</p>';
  }
})();

// Toast
function mostrarToast() {
  const toast = document.getElementById("filtro-toast");
  if (!toast) return;
  toast.classList.add("visivel");
  setTimeout(() => toast.classList.remove("visivel"), 3000);
}
