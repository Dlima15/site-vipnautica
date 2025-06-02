// JS da Página de Filtros
console.log("filtro.js carregado");

// --- Variáveis Globais ---
let todasEmbarcacoes = []; // Armazena todos os dados do JSON
let embarcacoesFiltradas = []; // Armazena as embarcações após aplicar filtros e ordenação

// --- Referências a Elementos do DOM ---
const barcosContainer = document.getElementById('barcos-container');
const fabricanteFilter = document.getElementById('fabricante-filter');
const modeloFilter = document.getElementById('modelo-filter');
const tamanhoFilter = document.getElementById('tamanho-filter');
const anoFilter = document.getElementById('ano-filter');
const combustivelFilter = document.getElementById('combustivel-filter');
const limparFiltrosBtn = document.querySelector('.btn-limpar-filtros');
const ordenarRadios = document.querySelectorAll('input[name="ordenar"]');

// --- Funcionalidade de Scroll Suave para Links Internos ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});

// --- Função para Renderizar o Cabeçalho da Listagem ---
function renderizarCabecalhoListagem() {
    const headerHtml = `
        <div class="listagem-header">
            <span class="col-header"></span> <span class="col-header">Modelo</span>
            <span class="col-header">Fabricante</span>
            <span class="col-header">Tamanho</span>
            <span class="col-header">Ano</span>
            <span class="col-header">Motor</span>
            <span class="col-header">Sku</span>
        </div>
    `;
    barcosContainer.insertAdjacentHTML('afterbegin', headerHtml);
}

// --- Função para Preencher os Selects de Filtro com Opções Dinâmicas ---
function preencherOpcoesFiltro() {
    const fabricantes = new Set();
    const modelos = new Set();
    const tamanhos = new Set();
    const anos = new Set();
    const combustiveis = new Set();

    todasEmbarcacoes.forEach(barco => {
        fabricantes.add(barco.fabricante);
        modelos.add(barco.modelo);
        tamanhos.add(barco.tamanho);
        anos.add(barco.ano);
        combustiveis.add(barco.combustivel);
    });

    const addOptions = (selectElement, optionsSet) => {
        selectElement.innerHTML = '<option value="todos">Todos</option>';
        Array.from(optionsSet).sort().forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    };

    addOptions(fabricanteFilter, fabricantes);
    addOptions(modeloFilter, modelos);
    addOptions(tamanhoFilter, tamanhos);
    addOptions(anoFilter, anos);
    addOptions(combustivelFilter, combustiveis);
}

// --- Função para Renderizar os Barcos na Tela ---
function renderizarBarcos(barcosParaRenderizar) {
    barcosContainer.innerHTML = '';
    renderizarCabecalhoListagem();

    if (barcosParaRenderizar.length === 0) {
        barcosContainer.innerHTML += '<p class="no-results">Nenhuma embarcação encontrada com os filtros aplicados.</p>';
        return;
    }

    barcosParaRenderizar.forEach(barco => {
        const barcoItem = document.createElement('a');
        barcoItem.href = `anuncio.html?sku=${barco.sku}`;
        barcoItem.classList.add('barco-item');

        const fotoSrc = barco.fotos && barco.fotos.length > 0 ? barco.fotos[0] : './assets/img/embarcacoes/placeholder.jpeg';

        barcoItem.innerHTML = `
            <div class="barco-img">
                <img src="${fotoSrc}" alt="${barco.anuncio}">
            </div>
            <span class="barco-info modelo">${barco.modelo}</span>
            <span class="barco-info fabricante">${barco.fabricante}</span>
            <span class="barco-info tamanho">${barco.tamanho}</span>
            <span class="barco-info ano">${barco.ano}</span>
            <span class="barco-info motor">${barco.motor}</span>
            <span class="barco-info sku-btn">${barco.sku}</span>
        `;
        barcosContainer.appendChild(barcoItem);
    });
}

// --- Função para Aplicar Filtros e Ordenação ---
function aplicarFiltrosEOrdenar() {
    embarcacoesFiltradas = [...todasEmbarcacoes];

    const filtroFabricante = fabricanteFilter.value;
    const filtroModelo = modeloFilter.value;
    const filtroTamanho = tamanhoFilter.value;
    const filtroAno = anoFilter.value;
    const filtroCombustivel = combustivelFilter.value;

    if (filtroFabricante !== 'todos') {
        embarcacoesFiltradas = embarcacoesFiltradas.filter(barco => barco.fabricante === filtroFabricante);
    }
    if (filtroModelo !== 'todos') {
        embarcacoesFiltradas = embarcacoesFiltradas.filter(barco => barco.modelo === filtroModelo);
    }
    if (filtroTamanho !== 'todos') {
        embarcacoesFiltradas = embarcacoesFiltradas.filter(barco =>
            String(barco.tamanho).replace('’', '') === String(filtroTamanho).replace('’', '')
        );
    }
    if (filtroAno !== 'todos') {
        embarcacoesFiltradas = embarcacoesFiltradas.filter(barco => barco.ano === filtroAno);
    }
    if (filtroCombustivel !== 'todos') {
        embarcacoesFiltradas = embarcacoesFiltradas.filter(barco => barco.combustivel === filtroCombustivel);
    }

    const ordenarPor = document.querySelector('input[name="ordenar"]:checked').value;

    embarcacoesFiltradas.sort((a, b) => {
        let valA, valB;

        switch (ordenarPor) {
            case 'fabricante':
                valA = a.fabricante.toLowerCase();
                valB = b.fabricante.toLowerCase();
                break;
            case 'tamanho':
                valA = parseFloat(String(a.tamanho).replace('’', ''));
                valB = parseFloat(String(b.tamanho).replace('’', ''));
                break;
            case 'ano':
                valA = parseInt(a.ano);
                valB = parseInt(b.ano);
                break;
            case 'sku':
                valA = parseInt(a.sku);
                valB = parseInt(b.sku);
                break;
            default:
                valA = a.fabricante.toLowerCase();
                valB = b.fabricante.toLowerCase();
                break;
        }

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });

    renderizarBarcos(embarcacoesFiltradas);
    mostrarToast(); // <-- Mostra o toast após renderizar
}

// --- Event Listeners para os Filtros e Ordenação ---
fabricanteFilter.addEventListener('change', aplicarFiltrosEOrdenar);
modeloFilter.addEventListener('change', aplicarFiltrosEOrdenar);
tamanhoFilter.addEventListener('change', aplicarFiltrosEOrdenar);
anoFilter.addEventListener('change', aplicarFiltrosEOrdenar);
combustivelFilter.addEventListener('change', aplicarFiltrosEOrdenar);

ordenarRadios.forEach(radio => {
    radio.addEventListener('change', aplicarFiltrosEOrdenar);
});

// --- Event Listener para o Botão "Limpar filtros" ---
limparFiltrosBtn.addEventListener('click', () => {
    fabricanteFilter.value = 'todos';
    modeloFilter.value = 'todos';
    tamanhoFilter.value = 'todos';
    anoFilter.value = 'todos';
    combustivelFilter.value = 'todos';
    document.querySelector('input[name="ordenar"][value="fabricante"]').checked = true;
    aplicarFiltrosEOrdenar();
    mostrarToast(); // <-- Também mostra o toast ao limpar
});

// --- Inicialização: Busca os Dados do JSON ao Carregar a Página ---
fetch("../data/embarcacoes.json")
    .then(res => res.json())
    .then(dados => {
        todasEmbarcacoes = Object.keys(dados).map(skuKey => {
            return {
                sku: skuKey,
                ...dados[skuKey]
            };
        });

        preencherOpcoesFiltro();
        aplicarFiltrosEOrdenar();
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));

// --- Função para mostrar o toast ---
function mostrarToast() {
    const toast = document.getElementById("filtro-toast");
    if (!toast) return;

    toast.classList.add("visivel");
    setTimeout(() => {
        toast.classList.remove("visivel");
    }, 3000);
}
