// Lista de produtos da loja
const produtos = [
  {
    nome: "Poção Mágica",
    descricao: "Uma poção misteriosa que brilha no escuro.",
    preco: 49.90,
    imagem: "pocao magica.jpg"
  },
  {
    nome: "Varinha Encantada",
    descricao: "Feita de madeira ancestral, canaliza magia poderosa.",
    preco: 129.90,
    imagem: "varinha encantada.jpg"
  },
  {
    nome: "Grimório Antigo",
    descricao: "Contém feitiços esquecidos por séculos.",
    preco: 199.90,
    imagem: "grimorio antigo.jpg"
  },
  {
    nome: "Erva Mata Lobos",
    descricao: "Uma erva poderosa contra lobisomens.",
    preco: 49.90,
    imagem: "erva mata lobisomen.jpg"
  }
];

// Seleciona o container dos produtos na página principal
const container = document.querySelector(".grid-produtos");

// Cria um array vazio para o carrinho de compras
let carrinho = [];

// Seleciona o contador de itens no cabeçalho
const contadorCarrinho = document.querySelector("#cart-count");

// Seleciona os elementos do modal do carrinho
const modal = document.querySelector("#modal-carrinho");
const fecharModalBtn = document.querySelector(".fechar-modal");
const carrinhoIcone = document.querySelector("#link-carrinho"); 
const itensDoCarrinhoContainer = document.querySelector("#itens-do-carrinho");
const carrinhoTotal = document.querySelector("#carrinho-total");

// Seleciona o botão de "Finalizar Compra"
const finalizarCompraBtn = document.querySelector("#finalizar-compra-btn");

// Para cada produto na lista, cria o HTML e adiciona na página
produtos.forEach(produto => {
  const card = document.createElement("div");
  card.classList.add("produto");
  
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
    <button>Adicionar ao carrinho</button>
  `;

  container.appendChild(card);
});

// Adiciona um "ouvinte" de clique no documento para pegar cliques nos botões
document.addEventListener("click", (event) => {
  // Se o clique foi em um botão dentro de um produto
  if (event.target.tagName === "BUTTON" && event.target.closest(".produto")) {
    const cardProduto = event.target.closest(".produto");
    const nomeProduto = cardProduto.querySelector("h3").textContent;
    const produtoSelecionado = produtos.find(produto => produto.nome === nomeProduto);

    if (produtoSelecionado) {
      // Procura se o item já existe no carrinho
      const itemExistente = carrinho.find(item => item.nome === nomeProduto);

      if (itemExistente) {
        // Se já existe, aumenta a quantidade
        itemExistente.quantidade++;
      } else {
        // Se não existe, adiciona o item com quantidade 1
        carrinho.push({...produtoSelecionado, quantidade: 1});
      }
      
      // Sempre atualiza o contador do carrinho com o número de produtos diferentes
      contadorCarrinho.textContent = carrinho.length;
      console.log("Carrinho:", carrinho);
    }
  }

  // Se o clique foi no botão de "Remover" dentro do modal
  if (event.target.classList.contains("remover-item")) {
    const cardItem = event.target.closest(".item-carrinho");
    const nomeItem = cardItem.getAttribute("data-nome");
    removerDoCarrinho(nomeItem);
  }

  // Lógica para os botões de quantidade
  if (event.target.classList.contains("btn-quantidade")) {
    const acao = event.target.getAttribute("data-acao");
    const cardItem = event.target.closest(".item-carrinho");
    const nomeItem = cardItem.getAttribute("data-nome");
    
    const item = carrinho.find(item => item.nome === nomeItem);

    if (item) {
      if (acao === "aumentar") {
        item.quantidade++;
      } else if (acao === "diminuir" && item.quantidade > 1) {
        item.quantidade--;
      }
      atualizarModalCarrinho();
    }
  }
});

// Adiciona um evento de clique para o botão "Finalizar Compra"
finalizarCompraBtn.addEventListener("click", () => {
    // Verifica se o carrinho não está vazio
    if (carrinho.length > 0) {
        alert("Compra finalizada com sucesso! Obrigado pela preferência.");
        
        // Esvazia o carrinho
        carrinho = [];
        
        // Atualiza a interface do carrinho
        contadorCarrinho.textContent = 0;
        atualizarModalCarrinho();
        
        // Fecha o modal
        modal.style.display = "none";
    } else {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
    }
});

// Função para abrir o modal
carrinhoIcone.addEventListener("click", (event) => {
  event.preventDefault(); 
  modal.style.display = "block";
  atualizarModalCarrinho();
});

// Função para fechar o modal
fecharModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fecha o modal se o usuário clicar fora dele
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Função para atualizar o conteúdo do modal (itens, quantidade e total)
function atualizarModalCarrinho() {
  itensDoCarrinhoContainer.innerHTML = ""; 
  let total = 0;

  if (carrinho.length === 0) {
    itensDoCarrinhoContainer.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio.</p>';
  } else {
    carrinho.forEach(item => {
      const itemHTML = `
        <div class="item-carrinho" data-nome="${item.nome}">
          <img src="${item.imagem}" alt="${item.nome}">
          <div class="item-carrinho-info">
            <h4>${item.nome}</h4>
            <p>R$ ${item.preco.toFixed(2)}</p>
          </div>
          <div class="quantidade-controle">
            <button class="btn-quantidade" data-acao="diminuir">-</button>
            <span class="quantidade-item">${item.quantidade}</span>
            <button class="btn-quantidade" data-acao="aumentar">+</button>
          </div>
          <button class="remover-item">Remover</button>
        </div>
      `;
      itensDoCarrinhoContainer.innerHTML += itemHTML;
      total += item.preco * item.quantidade;
    });
  }
  
  carrinhoTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para remover um item do carrinho
function removerDoCarrinho(nomeDoItem) {
  const index = carrinho.findIndex(item => item.nome === nomeDoItem);

  if (index > -1) {
    carrinho.splice(index, 1);
    contadorCarrinho.textContent = carrinho.length; 
    atualizarModalCarrinho();
  }
}