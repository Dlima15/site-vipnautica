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
        e.preventDefault(); // Impede o comportamento padrão do link

        const target = document.querySelector(this.getAttribute("href")); // Seleciona o elemento alvo
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Ajusta para header fixo
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
    barcosContainer.insertAdjacentHTML('afterbegin', headerHtml); // Insere o cabeçalho antes dos barcos
}

// --- Função para Preencher os Selects de Filtro com Opções Dinâmicas ---
function preencherOpcoesFiltro() {
    // Cria um Set para armazenar valores únicos
    const fabricantes = new Set();
    const modelos = new Set();
    const tamanhos = new Set();
    const anos = new Set();
    const combustiveis = new Set();

    todasEmbarcacoes.forEach(barco => {
        fabricantes.add(barco.fabricante);
        modelos.add(barco.modelo);
        tamanhos.add(barco.tamanho); // Pode ser necessário converter para string se o JSON tiver números e strings misturados
        anos.add(barco.ano);
        combustiveis.add(barco.combustivel);
    });

    // Converte Sets para Arrays, ordena e preenche os selects
    const addOptions = (selectElement, optionsSet) => {
        selectElement.innerHTML = '<option value="todos">Todos</option>'; // Opção padrão
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
    // Limpa o conteúdo atual do container (exceto o cabeçalho, se já foi inserido)
    barcosContainer.innerHTML = '';
    renderizarCabecalhoListagem(); // Re-insere o cabeçalho

    if (barcosParaRenderizar.length === 0) {
        barcosContainer.innerHTML += '<p class="no-results">Nenhuma embarcação encontrada com os filtros aplicados.</p>';
        return;
    }

    barcosParaRenderizar.forEach(barco => {
        const barcoItem = document.createElement('a');
        barcoItem.href = `anuncio.html?sku=${barco.sku}`; // Link para a página de anúncio
        barcoItem.classList.add('barco-item');

        // Usa a primeira foto como imagem de preview
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
    embarcacoesFiltradas = [...todasEmbarcacoes]; // Começa com todas as embarcações

    // --- Aplicar Filtros ---
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
        // Ajusta para lidar com tamanhos como strings ou números, removendo o '’'
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

    // --- Aplicar Ordenação ---
    const ordenarPor = document.querySelector('input[name="ordenar"]:checked').value;

    embarcacoesFiltradas.sort((a, b) => {
        let valA, valB;

        switch (ordenarPor) {
            case 'fabricante':
                valA = a.fabricante.toLowerCase();
                valB = b.fabricante.toLowerCase();
                break;
            case 'tamanho':
                // Converte o tamanho para número para ordenação correta (ex: "77’" para 77)
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
            default: // Por padrão, pode ser por fabricante
                valA = a.fabricante.toLowerCase();
                valB = b.fabricante.toLowerCase();
                break;
        }

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });

    renderizarBarcos(embarcacoesFiltradas);
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
    document.querySelector('input[name="ordenar"][value="fabricante"]').checked = true; // Volta para ordenação por fabricante
    aplicarFiltrosEOrdenar(); // Reaplica os filtros (agora zerados)
});

// --- Inicialização: Busca os Dados do JSON ao Carregar a Página ---
fetch("../data/embarcacoes.json")
    .then(res => res.json())
    .then(dados => {
        // Percorre o objeto 'dados' e cria um novo array de objetos,
        // onde cada objeto agora TEM a propriedade 'sku' baseada na chave.
        todasEmbarcacoes = Object.keys(dados).map(skuKey => {
            return {
                sku: skuKey, // Adiciona a propriedade SKU a cada objeto de barco
                ...dados[skuKey] // Copia todas as outras propriedades do objeto original
            };
        });

        preencherOpcoesFiltro(); // Preenche os selects de filtro com as opções do JSON
        aplicarFiltrosEOrdenar(); // Aplica os filtros e ordena (inicialmente sem filtros, só ordenação padrão)
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));