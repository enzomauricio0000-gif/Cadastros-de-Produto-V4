let produtos = [];

const formProduto = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");
const areaEtiqueta = document.getElementById("area-etiqueta");
const qrcodeContainer = document.getElementById("qrcode");

// [NOVO V4] Elementos de busca e métricas
const campoBusca = document.getElementById("campo-busca");
const metricasEstoque = document.getElementById("metricas-estoque");
const mensagemFeedback = document.getElementById("mensagem-feedback");

window.onload = function() {
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
        produtos = JSON.parse(produtosSalvos);
        produtos = produtos.filter(p => p.preco > 0);
        salvarNoLocalStorage();
        renderizarTabela();
    }
};

formProduto.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const preco = parseFloat(document.getElementById("preco").value);

    if (!nome || isNaN(preco) || preco <= 0) {
        alert("Por favor, introduza um nome válido e um preço maior que zero.");
        return;
    }

    const novoProduto = {
        id: Date.now(),
        nome: nome,
        preco: preco
    };

    produtos.push(novoProduto);
    salvarNoLocalStorage();
    renderizarTabela();

    formProduto.reset();
});

// [NOVO V4] Evento de digitação em tempo real[cite: 1]
campoBusca.addEventListener("input", function() {
    renderizarTabela();
});

function salvarNoLocalStorage() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

// [NOVO V4] Função de filtro com .filter()[cite: 1, 2]
function obterProdutosFiltrados() {
    const termoBusca = campoBusca.value.toLowerCase().trim();
    return produtos.filter(produto => 
        produto.nome.toLowerCase().includes(termoBusca)
    );
}

function renderizarTabela() {
    listaProdutos.innerHTML = "";

    // Usa a lista filtrada
    const produtosFiltrados = obterProdutosFiltrados();

    // [NOVO V4] Controla a mensagem de nenhum produto encontrado[cite: 1]
    if (produtosFiltrados.length === 0) {
        mensagemFeedback.style.display = "block";
    } else {
        mensagemFeedback.style.display = "none";
    }

    produtosFiltrados.forEach((produto) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>
                <button onclick="gerarEtiqueta(${produto.id})">🏷️ Gerar QR Code</button>
                <button onclick="removerProduto(${produto.id})">❌ Eliminar</button>
            </td>
        `;

        listaProdutos.appendChild(tr);
    });

    // [NOVO V4] Atualiza métricas com .reduce()[cite: 1]
    atualizarMetricas(produtosFiltrados);
}

// [NOVO V4] Cálculo do total visível[cite: 1]
function atualizarMetricas(produtosVisiveis) {
    const totalGeral = produtosVisiveis.reduce((soma, produto) => soma + produto.preco, 0);
    metricasEstoque.innerText = `Total em Estoque (Visível): R$ ${totalGeral.toFixed(2)}`;
}

function gerarEtiqueta(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    document.getElementById("etiqueta-nome").innerText = `Produto: ${produto.nome}`;
    document.getElementById("etiqueta-preco").innerText = `Preço: R$ ${produto.preco.toFixed(2)}`;

    qrcodeContainer.innerHTML = "";

    const dadosQRCode = JSON.stringify({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco
    });

    new QRCode(qrcodeContainer, {
        text: dadosQRCode,
        width: 128,
        height: 128
    });

    areaEtiqueta.style.display = "block";
}

function imprimirEtiqueta() {
    window.print();
}

function removerProduto(id) {
    produtos = produtos.filter(p => p.id !== id);
    salvarNoLocalStorage();
    renderizarTabela();
    areaEtiqueta.style.display = "none";
}