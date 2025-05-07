// JS da Página de Anúncio
console.log("teste js");

// --- Funcionalidade de Scroll Suave para Links Internos ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Impede o comportamento padrão do link

    const target = document.querySelector(this.getAttribute("href")); // Seleciona o elemento alvo pelo atributo href do link
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // Calcula a posição Y do alvo, ajustando pela altura do header fixo (se houver)
        behavior: "smooth" // Define a rolagem como suave
      });
    }
  });
});

// --- Função para Puxar e Exibir os Dados da Embarcação do JSON ---

// Pega o SKU diretamente da URL através dos parâmetros de busca (?sku=valor)
const urlParams = new URLSearchParams(window.location.search);
const sku = urlParams.get("sku");

// --- Funcionalidade do Carrossel de Fotos ---
let fotoIndex = 0; // Índice da foto atualmente exibida
let fotos = []; // Array para armazenar os caminhos das fotos da embarcação

// Função para mostrar a foto no índice fornecido
function mostrarFoto(index) {
  const img = document.getElementById('foto-barco'); // Obtém o elemento da imagem
  if (fotos.length > 0) {
    img.classList.remove('visible'); // Remove a classe para iniciar uma possível transição de fade-out
    setTimeout(() => {
      img.src = fotos[index]; // Define o novo caminho da imagem
      img.onload = () => img.classList.add('visible'); // Adiciona a classe quando a nova imagem é carregada (para possível fade-in)
    }, 200); // Pequeno delay para permitir a transição de saída
  }
}

// Função para mudar para a próxima ou anterior foto
function mudarFoto(direcao) {
  fotoIndex += direcao; // Atualiza o índice da foto com base na direção (+1 para próxima, -1 para anterior)
  if (fotoIndex < 0) fotoIndex = fotos.length - 1; // Se o índice for menor que 0, volta para a última foto
  else if (fotoIndex >= fotos.length) fotoIndex = 0; // Se o índice for maior ou igual ao número de fotos, volta para a primeira
  mostrarFoto(fotoIndex); // Chama a função para exibir a foto atualizada
}

// --- Busca os Dados da Embarcação do Arquivo JSON ---
fetch("../data/embarcacoes.json")
  .then(res => res.json()) // Converte a resposta para um objeto JSON
  .then(dados => {
    // Agora 'dados' é um objeto onde as chaves são os SKUs das embarcações
    const barco = dados[sku]; // Acessa diretamente o objeto da embarcação usando o SKU como chave

    // Verifica se a embarcação com o SKU fornecido foi encontrada
    if (!barco) {
      document.body.innerHTML = "<h1>Barco não encontrado</h1>"; // Exibe uma mensagem de erro se o barco não for encontrado
      return; // Encerra a execução da função
    }

    // Preenche os campos da página com os dados da embarcação encontrada
    document.getElementById("titulo-barco").innerText = barco.anuncio;
    document.getElementById("sku").innerText = `SKU ${sku}`; // Usa o SKU da URL, que é a chave do objeto
    document.getElementById("fabricante").innerText = barco.fabricante;
    document.getElementById("modelo").innerText = barco.modelo;
    document.getElementById("ano").innerText = barco.ano;
    document.getElementById("tamanho").innerText = barco.tamanho;
    document.getElementById("estilo").innerText = barco.estilo;
    document.getElementById("combustivel").innerText = barco.combustivel;
    document.getElementById("motor").innerText = barco.motor;
    document.getElementById("horas").innerText = barco.horas;
    document.getElementById("valor").innerText = barco.valor;

    // Define o título dos botões de navegação do carrossel com o SKU
    const btnLeft = document.querySelector('.btn-nav.left');
    const btnRight = document.querySelector('.btn-nav.right');
    if (btnLeft) btnLeft.title = `SKU ${sku}`;
    if (btnRight) btnRight.title = `SKU ${sku}`;

    fotos = barco.fotos; // Atribui o array de fotos à variável 'fotos'
    console.log("Caminhos das fotos:", fotos); // Exibe os caminhos das fotos no console para depuração
    mostrarFoto(fotoIndex); // Exibe a primeira foto ao carregar a página

    // Preenche a seção de acessórios
    const acessoriosContainer = document.getElementById('acessorios');
    const metade = Math.ceil(barco.acessorios.length / 2); // Calcula a metade do número de acessórios para dividir em duas colunas
    const ul1 = document.createElement('ul'); // Cria a primeira lista não ordenada
    const ul2 = document.createElement('ul'); // Cria a segunda lista não ordenada

    // Itera sobre o array de acessórios e os adiciona às listas
    barco.acessorios.forEach((item, index) => {
      const li = document.createElement('li'); // Cria um item de lista
      li.textContent = item; // Define o texto do item de lista como o nome do acessório
      index < metade ? ul1.appendChild(li) : ul2.appendChild(li); // Adiciona o item à primeira metade na ul1 e a segunda metade na ul2
    });

    // Adiciona as listas de acessórios ao container
    acessoriosContainer.appendChild(ul1);
    acessoriosContainer.appendChild(ul2);
  })
  .catch(err => console.error("Erro ao carregar JSON:", err)); // Captura e exibe qualquer erro ocorrido durante a busca ou processamento do JSON