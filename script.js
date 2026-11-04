
// LISTA DE PRODUTOS

let listaDeProdutos = JSON.parse(localStorage.getItem("produtos")) || [];

let indiceEdicao = null;


// ELEMENTOS HTML

const formulario = document.getElementById("form-produto");

const campoNome = document.getElementById("nome");

const campoPreco = document.getElementById("preco");

const campoQuantidade = document.getElementById("quantidade");

const campoBusca = document.getElementById("campo-busca");

const tabela = document.getElementById("lista-produtos");

const totalEstoque = document.getElementById("total-estoque");

const mensagemVazia = document.getElementById("mensagem-vazia");

const botaoSalvar = document.getElementById("botao-salvar");


// SALVAR PRODUTOS

function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(listaDeProdutos)
    );

}


// CADASTRAR PRODUTOS

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = campoNome.value.trim();

    const preco = Number(campoPreco.value);

    const quantidade = Number(campoQuantidade.value);

    if (
        nome === "" ||
        campoPreco.value === "" ||
        campoQuantidade.value === "" ||
        !Number.isFinite(preco) ||
        !Number.isInteger(quantidade) ||
        preco < 0 ||
        quantidade < 0
    ) {

        alert("Preencha os campos corretamente!");

        return;

    }

    const produto = {
        nome: nome,
        preco: preco,
        quantidade: quantidade
    };

    if (indiceEdicao === null) {

        listaDeProdutos.push(produto);

    } else {

        listaDeProdutos[indiceEdicao] = produto;

        indiceEdicao = null;

        botaoSalvar.textContent = "Cadastrar";

    }

    salvarProdutos();

    formulario.reset();

    renderizarProdutos();

});


// FILTRAR PRODUTOS

function obterProdutosFiltrados() {

    const pesquisa = campoBusca.value
        .trim()
        .toLowerCase();

    return listaDeProdutos.filter(function(produto) {

        return produto.nome
            .toLowerCase()
            .includes(pesquisa);

    });

}


// MOSTRAR PRODUTOS NA TELA

function renderizarProdutos() {

    tabela.innerHTML = "";

    const produtosVisiveis = obterProdutosFiltrados();

    if (produtosVisiveis.length === 0) {

        if (listaDeProdutos.length === 0) {

            mensagemVazia.textContent = "Nenhum produto cadastrado.";

        } else {

            mensagemVazia.textContent = "Produto não encontrado.";

        }

    } else {

        mensagemVazia.textContent = "";

    }


    produtosVisiveis.forEach(function(produto) {

        const indice = listaDeProdutos.indexOf(produto);

        const linha = document.createElement("tr");

        const colunaNome = document.createElement("td");

        const colunaPreco = document.createElement("td");

        const colunaQuantidade = document.createElement("td");

        const colunaAcoes = document.createElement("td");


        colunaNome.textContent = produto.nome;

        colunaPreco.textContent = produto.preco.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        colunaQuantidade.textContent = produto.quantidade;


        // BOTÃO EDITAR

        const botaoEditar = document.createElement("button");

        botaoEditar.textContent = "Editar";

        botaoEditar.className = "editar";

        botaoEditar.addEventListener("click", function() {

            editarProduto(indice);

        });


        // BOTÃO EXCLUIR

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";

        botaoExcluir.className = "excluir";

        botaoExcluir.addEventListener("click", function() {

            excluirProduto(indice);

        });


        colunaAcoes.appendChild(botaoEditar);

        colunaAcoes.appendChild(botaoExcluir);


        linha.appendChild(colunaNome);

        linha.appendChild(colunaPreco);

        linha.appendChild(colunaQuantidade);

        linha.appendChild(colunaAcoes);


        tabela.appendChild(linha);

    });


    // CALCULAR TOTAL DO ESTOQUE

    const total = produtosVisiveis.reduce(function(soma, produto) {

        return soma + produto.quantidade;

    }, 0);

    totalEstoque.textContent = "Total em Estoque: " + total;

}


// EDITAR PRODUTO

function editarProduto(indice) {

    const produto = listaDeProdutos[indice];

    campoNome.value = produto.nome;

    campoPreco.value = produto.preco;

    campoQuantidade.value = produto.quantidade;

    indiceEdicao = indice;

    botaoSalvar.textContent = "Salvar Alterações";

}


// EXCLUIR PRODUTO

function excluirProduto(indice) {

    const confirmar = confirm(
        "Deseja realmente excluir este produto?"
    );

    if (confirmar) {

        listaDeProdutos.splice(indice, 1);

        salvarProdutos();

        if (indiceEdicao === indice) {

            indiceEdicao = null;

            formulario.reset();

            botaoSalvar.textContent = "Cadastrar";

        }

        renderizarProdutos();

    }

}


// PESQUISA AUTOMÁTICA

campoBusca.addEventListener("input", function() {

    renderizarProdutos();

});


// INICIAR PROGRAMA

renderizarProdutos();
