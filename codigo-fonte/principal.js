window.onload = function () {
    // Recupera os valores do localStorage
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const catSalva = localStorage.getItem('usuarioCat');

    // Seleciona os elementos e atualiza o texto
    document.getElementById('display-user').innerText = nomeSalvo || 'Convidado';
    document.getElementById('display-category').innerText = catSalva || 'N/A';

    // Inicia na tela home
    carregarTela('home_content');
}



function carregarTela(nomeDaTela) {
    const principal = document.querySelector('.content');

    fetch(`${nomeDaTela}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            principal.innerHTML = html;
            window.scrollTo(0, 0);

            // 1. Remove a classe 'active' de TODOS os <li> dentro da árvore
            document.querySelectorAll('.project-tree li').forEach(li => {
                li.classList.remove('active');
            });

            // 2. Adiciona a classe 'active' no <li> pai do item clicado
            if (nomeDaTela === "home_content") {
                document.querySelector('.file_10').closest('li').classList.add('active');
                atualizarHome();
            }
            else if (nomeDaTela === "cadastrarUsuario_content") {
                document.querySelector('.file_20').closest('li').classList.add('active');
            }
            else if (nomeDaTela === "listaUsuarios_content") {
                document.querySelector('.file_30').closest('li').classList.add('active');
                listarUsuarios();
            }
            else if (nomeDaTela === "cadastrarMaquinas_content") {
                document.querySelector('.file_40').closest('li').classList.add('active');
            }
            else if (nomeDaTela === "listamaquinas_content") {
                document.querySelector('.file_50').closest('li').classList.add('active');
                listarMaquinas();
            }
            else if (nomeDaTela === "cadastrarPedido_content") {
                document.querySelector('.file_60').closest('li').classList.add('active');
                AtualizarMaquinasPedidos();
            }
            else if (nomeDaTela === "listaPedidos_content") {
                document.querySelector('.file_70').closest('li').classList.add('active');
                listarPedidos();
            }
             else if (nomeDaTela === "dashboard_content") {
                document.querySelector('.file_80').closest('li').classList.add('active');
                listarPedidosConcluidos();
            }
        })
        .catch(err => {
            principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`;
        });
}

function atualizarHome() {

    let listaMaquinas = JSON.parse(localStorage.getItem('maquinas'));
    document.getElementById('totalMaquinas').innerText = listaMaquinas.length ?? 0;

    let listaPedidos = JSON.parse(localStorage.getItem('pedidos'));
    document.getElementById('totalPedidos').innerText = listaPedidos.length ?? 0;

    let concluidos = localStorage.getItem('Concluidos');
    document.getElementById('totalConcluido').innerText = concluidos ?? 0;
}

function AtualizarMaquinasPedidos() {
    // Busca as máquinas salvas no localStorage (ou uma lista vazia se não houver)
    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];

    // 2. Selecionar o elemento HTML
    const selectCat = document.getElementById("CatMaq");

    // 3. Limpar opções antigas (mantendo apenas a primeira que é o placeholder)
    selectCat.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';

    lista.forEach(maquinas => {
        const opcao = document.createElement("option");
        opcao.value = maquinas.maquina;
        opcao.text = maquinas.maquina;
        selectCat.appendChild(opcao);
    });
}


//Recebe o evento de click do botão cadastro
function CadastrarUsuario() {
    // 1. Captura os elementos
    const usuario = document.getElementById('username').value;
    const cat = document.getElementById('usuarioCat').value;
    const senha1 = document.getElementById('pwd1').value;
    const senha2 = document.getElementById('pwd2').value;

    // 2. Lógica de Validação
    if (usuario === "" || cat === "" || senha1 === "" || senha2 === "") {
        alert('⚠️ Por favor, preencha todos os campos do formulário!');
    }
    else if (senha1 !== senha2) {
        alert('❌ As senhas digitadas estão diferentes!');
        document.getElementById('pwd1').value = "";
        document.getElementById('pwd2').value = "";
    }
    else {
        // 1. Pega a lista de usuários já salvos ou cria uma vazia se for o primeiro
        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) ||
            [
                { "id": 1, "usuario": "eng", "senha": "eng", "categoria": "Administrador" }
            ];

        // 2. Cria o novo objeto de usuário com ID incremental
        const novoUsuario =
        {
            id: listaUsuarios.length + 1,
            usuario: usuario,
            senha: senha1,
            categoria: cat
        };

        // 3. Adiciona na lista e salva de volta no "banco" (localStorage)
        listaUsuarios.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

        // 4. Feedback e Limpeza
        alert(`✅ Usuário ${usuario} cadastrado com sucesso!`);
        document.querySelector('.cadastro-form').reset();

        //limpar o formulário
        document.querySelector('.cadastro-form').reset();
    }
}

function listarUsuarios() {
    const corpoTabela = document.getElementById('tabela-corpo');
    // Busca os usuários salvos no localStorage (ou uma lista vazia se não houver)
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

    lista.forEach(user => {
        const linha = `
            <tr>
                <td>${user.id}</td>
                <td>${user.usuario}</td>
                <td><span class="badge">${user.categoria}</span></td>
                <td>
                    <button class="btn-excluir" onclick="excluirUsuario(${user.id})">Remover</button>
                    <button class="btn-editar" onclick="abrirModalEditar(${user.id})">Editar</button>
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function excluirUsuario(id) {

    const UsuarioAtivo = localStorage.getItem('usuarioNome');
    let UsuarioTabela;

    //Recupera o nome do usuário pelo ID
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = lista.find(user => Number(user.id) === Number(id));

    if (usuarioEncontrado) {

        UsuarioTabela = usuarioEncontrado.usuario;
    }

    if (UsuarioTabela != UsuarioAtivo) {
        if (confirm("Tem certeza que deseja remover este usuário?")) {
            let lista = JSON.parse(localStorage.getItem('usuarios')) || [];
            // Filtra a lista removendo o ID selecionado
            lista = lista.filter(u => u.id !== id);
            localStorage.setItem('usuarios', JSON.stringify(lista));
            listarUsuarios(); // Recarrega a tabela
        }
    }
    else {
        alert("Você não pode excluir um usuário ativo, faça Logon com outro usuário !");
    }

}

// 2. Ajuste na função de SALVAR
function salvarAlteracoes() {
    const id = localStorage.getItem('usuarioId');
    const novoNome = document.getElementById('username').value;
    const novaCategoria = document.getElementById('usuarioCat').value;
    const novaSenha = document.getElementById('pwd1').value;
    const novaSenha1 = document.getElementById('pwd2').value;

    if (novaSenha === novaSenha1 && novoNome !== "") {
        let lista = JSON.parse(localStorage.getItem('usuarios')) || [];

        lista = lista.map(user => {
            if (Number(user.id) === Number(id)) {
                // ATENÇÃO: Use 'usuario' e não 'nome' para bater com seu cadastro
                return { ...user, usuario: novoNome, categoria: novaCategoria, senha: novaSenha };
            }
            return user;
        });

        localStorage.setItem('usuarios', JSON.stringify(lista));

        document.getElementById('meuPopup').close(); // Fecha o modal
        listarUsuarios(); // Atualiza a tabela
        alert("Usuário atualizado com sucesso!");
    } else {
        alert("As senhas não coincidem ou o nome está vazio.");
    }
}


function abrirModalEditar(id) {

    // Salva os dados do ID do usuário
    localStorage.setItem('usuarioId', id);

    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = lista.find(user => Number(user.id) === Number(id));

    if (usuarioEncontrado) {
        const popup = document.getElementById('meuPopup');

        document.getElementById('user').innerText = usuarioEncontrado.usuario;
        document.getElementById('username').value = usuarioEncontrado.usuario;
        document.getElementById('usuarioCat').value = usuarioEncontrado.categoria;

        popup.showModal();
    }
}

// Fechar se clicar fora do modal
document.addEventListener('click', (event) => {
    const popup = document.getElementById('meuPopup');
    if (event.target === popup) {
        popup.close();
    }
});




//Recebe o evento de click do botão cadastro de máquinas
function CadastrarMaquina() {
    const maquina = document.getElementById('name').value;
    const cat = document.getElementById('Cat').value;

    if (maquina === "" || cat === "") {
        alert('⚠️ Por favor, preencha todos os campos do formulário!');
        return; // Para a execução imediatamente se houver campos vazios
    }

    // CORREÇÃO 1: Começa estritamente com uma lista vazia [] se não houver dados salvos
    let listaMaquina = JSON.parse(localStorage.getItem('maquinas')) || [];

    // CORREÇÃO 2: ID incremental seguro (pega o ID do último item cadastrado e soma 1)
    const proximoId = listaMaquina.length > 0 ? listaMaquina[listaMaquina.length - 1].id + 1 : 1;

    const novaMaquina = {
        id: proximoId,
        maquina: maquina,
        categoria: cat
    };

    listaMaquina.push(novaMaquina);
    localStorage.setItem('maquinas', JSON.stringify(listaMaquina));

    alert(`✅ O equipamento ${maquina} foi cadastrado com sucesso!`);
    document.querySelector('.cadastro-form').reset();

    // Opcional: Se a função listarMaquinas existir na página, atualiza na hora
    if (typeof listarMaquinas === "function") listarMaquinas();
}

function listarMaquinas() {
    const corpoTabela = document.getElementById('tabela-corpo');
    // Busca os usuários salvos no localStorage (ou uma lista vazia se não houver)
    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

    lista.forEach(maquinas => {
        const linha = `
            <tr>
                <td>${maquinas.id}</td>
                <td>${maquinas.maquina}</td>
                <td><span class="badge">${maquinas.categoria}</span></td>
                <td>
                    <button class="btn-excluir" onclick="excluirMaquina(${maquinas.id})">Remover</button>
                    <button class="btn-editar" onclick="abrirModalEditarMaq(${maquinas.id})">Editar</button>
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function excluirMaquina(id) {
    //Recupera o nome do usuário pelo ID
    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];
    const maquinaEncontrada = lista.find(maquina => Number(maquina.id) === Number(id));


    if (confirm("Tem certeza que deseja remover está máquina?")) {
        let lista = JSON.parse(localStorage.getItem('maquinas')) || [];
        // Filtra a lista removendo o ID selecionado
        lista = lista.filter(u => u.id !== id);
        localStorage.setItem('maquinas', JSON.stringify(lista));
        listarMaquinas(); // Recarrega a tabela
    }
}

// 2. Ajuste na função de SALVAR
function salvarAlteracoesMaq() {
    const id = localStorage.getItem('maquinaId');
    const novoNome = document.getElementById('name').value;
    const novaCategoria = document.getElementById('maquinaCat').value;

    let lista = JSON.parse(localStorage.getItem('maquinas')) || [];

    lista = lista.map(item => {
        // Garante a comparação correta convertendo ambos para número
        if (Number(item.id) === Number(id)) {
            // CORREÇÃO 3: Preserva o ID original do item para não corromper o banco
            return {
                id: item.id,
                maquina: novoNome,
                categoria: novaCategoria
            };
        }
        return item;
    });

    localStorage.setItem('maquinas', JSON.stringify(lista));

    document.getElementById('meuPopupMaq').close(); // Fecha o modal

    listarMaquinas(); // Atualiza a tabela
    alert("✅ Máquina atualizada com sucesso!");
}

function abrirModalEditarMaq(id) {
    // Salva os dados do ID do usuário
    localStorage.setItem('maquinaId', id);

    const lista = JSON.parse(localStorage.getItem('maquinas')) || [];
    const maquinaEncontrada = lista.find(maquina => Number(maquina.id) === Number(id));

    if (maquinaEncontrada) {
        const popup = document.getElementById('meuPopupMaq');

        document.getElementById('name').value = maquinaEncontrada.maquina;
        document.getElementById('maquinaCat').value = maquinaEncontrada.categoria;

        popup.showModal();
    }
    else {
        alert("Maquina não encontrada");
    }
}

// Fechar se clicar fora do modal
document.addEventListener('click', (event) => {
    const popup = document.getElementById('meuPopupMaq');
    if (event.target === popup) {
        popup.close();
    }
});




//Recebe o evento de click do botão cadastro de máquinas
function CadastrarPedido() {
    const nomeProduto = document.getElementById('nomeProduto').value;
    const numeroPedido = document.getElementById('numeroPedido').value;
    const CatMaterial = document.getElementById('CatMaterial').value;
    const valorTotal = document.getElementById('valorTotal').value;
    const tempoFabricacao = document.getElementById('tempoFabricacao').value;
    const CatUrgencia = document.getElementById('CatUrgencia').value;
    const CatMaq = document.getElementById('CatMaq').value;


    if (nomeProduto === "" || numeroPedido === "" || CatMaterial === "" || valorTotal === "" || tempoFabricacao === "" || CatUrgencia === "" || CatMaq === "") {
        alert('⚠️ Por favor, preencha todos os campos do formulário!');
        return; // Para a execução imediatamente se houver campos vazios
    }

    // CORREÇÃO 1: Começa estritamente com uma lista vazia [] se não houver dados salvos
    let listaPedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    let listaHistorico = JSON.parse(localStorage.getItem('historicopedidos')) || [];

    // CORREÇÃO 2: ID incremental seguro (pega o ID do último item cadastrado e soma 1)
    const proximoId = listaPedidos.length > 0 ? listaPedidos[listaPedidos.length - 1].id + 1 : 1;
    const proximoIdHistorico = listaHistorico.length > 0 ? listaHistorico[listaHistorico.length - 1].id + 1 : 1;

    const novoPedido = {
        id: proximoId,
        nomeProduto: nomeProduto,
        numeroPedido: numeroPedido,
        CatMaterial: CatMaterial,
        valorTotal: valorTotal,
        tempoFabricacao: tempoFabricacao,
        CatUrgencia: CatUrgencia,
        CatMaq: CatMaq,
    };

    listaPedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(listaPedidos));

    listaHistorico.push(novoPedido);
    localStorage.setItem('historicopedidos', JSON.stringify(listaHistorico));

    alert(`✅ O pedido de número ${numeroPedido} e nome ${nomeProduto} foi cadastrado com sucesso!`);
    document.querySelector('.cadastro-form').reset();
}

function listarPedidos() {
    const corpoTabela = document.getElementById('tabela-corpo');
    // Busca os usuários salvos no localStorage (ou uma lista vazia se não houver)
    const lista = JSON.parse(localStorage.getItem('pedidos')) || [];

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

    lista.forEach(pedidos => {

        // Mapeia a urgência direto para a classe desejada (se não achar, usa 'badgeNormal')
        const classesBadge = {
            "Normal": "badgeNormal",
            "Média": "badgeMedia",
            "Alta": "badgeAlta",
            "Critica": "badgeCritica"
        };

        const badge = classesBadge[pedidos.CatUrgencia] || 'badgeNormal';

        const linha = `
            <tr>
                <td>${pedidos.id}</td>
                <td>${pedidos.nomeProduto}</td>
                <td>${pedidos.numeroPedido}</td>
                <td>${pedidos.CatMaterial}</td>
                <td>${pedidos.valorTotal}</td>
                <td>${pedidos.tempoFabricacao}</td>


                <td><span class="${badge}">${pedidos.CatUrgencia}</span></td>

                <td>${pedidos.CatMaq}</td>
                <td>
                    <button class="btn-excluir" onclick="excluirPedido(${pedidos.id})">Remover</button>
                    <button class="btn-editar" onclick="abrirModalEditarPedido(${pedidos.id})">Editar</button>
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function excluirPedido(id) {
    //Recupera o nome do usuário pelo ID
    const lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidoEncontrado = lista.find(pedido => Number(pedido.id) === Number(id));


    if (confirm("Tem certeza que deseja remover este pedido?")) {
        let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
        // Filtra a lista removendo o ID selecionado
        lista = lista.filter(u => u.id !== id);
        localStorage.setItem('pedidos', JSON.stringify(lista));
        listarPedidos(); // Recarrega a tabela
    }
}

// 2. Ajuste na função de SALVAR
function salvarAlteracoesPedido() {
    const id = localStorage.getItem('pedidoId');
    const nomeProduto = document.getElementById('nomeProduto').value;
    const numeroPedido = document.getElementById('numeroPedido').value;
    const CatMaterial = document.getElementById('CatMaterial').value;
    const valorTotal = document.getElementById('valorTotal').value;
    const tempoFabricacao = document.getElementById('tempoFabricacao').value;
    const CatUrgencia = document.getElementById('CatUrgencia').value;
    const CatMaq = document.getElementById('CatMaq').value;

    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];

    lista = lista.map(item => {
        // Garante a comparação correta convertendo ambos para número
        if (Number(item.id) === Number(id)) {
            // CORREÇÃO 3: Preserva o ID original do item para não corromper o banco
            return {
                id: item.id,
                nomeProduto: nomeProduto,
                numeroPedido: numeroPedido,
                CatMaterial: CatMaterial,
                valorTotal: valorTotal,
                tempoFabricacao: tempoFabricacao,
                nomeProduto: nomeProduto,
                CatUrgencia: CatUrgencia,
                CatMaq: CatMaq
            };
        }
        return item;
    });

    localStorage.setItem('pedidos', JSON.stringify(lista));

    document.getElementById('meuPopupPedido').close(); // Fecha o modal

    listarPedidos(); // Atualiza a tabela
    alert("✅ Máquina atualizada com sucesso!");
}

function abrirModalEditarPedido(id) {
    // Salva os dados do ID do usuário
    localStorage.setItem('pedidoId', id);

    AtualizarMaquinasPedidos();

    const lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidoEncontrado = lista.find(pedido => Number(pedido.id) === Number(id));

    if (pedidoEncontrado) {
        const popup = document.getElementById('meuPopupPedido');

        document.getElementById('nomeProduto').value = pedidoEncontrado.nomeProduto;
        document.getElementById('numeroPedido').value = pedidoEncontrado.numeroPedido;
        document.getElementById('CatMaterial').value = pedidoEncontrado.CatMaterial;
        document.getElementById('valorTotal').value = pedidoEncontrado.valorTotal;
        document.getElementById('tempoFabricacao').value = pedidoEncontrado.tempoFabricacao;
        document.getElementById('CatUrgencia').value = pedidoEncontrado.CatUrgencia;
        document.getElementById('CatMaq').value = pedidoEncontrado.CatMaq;

        popup.showModal();
    }
    else {
        alert("Pedido não encontrado");
    }
}

// Fechar se clicar fora do modal
document.addEventListener('click', (event) => {
    const popup = document.getElementById('meuPopupPedido');
    if (event.target === popup) {
        popup.close();
    }
});


function ZerarMarcador() {
    if (confirm("Tem certeza que deseja zerar a contagem deste marcador?")) {
        localStorage.setItem('Concluidos', 0);
        atualizarHome(); // Recarrega a ttela
    }
}



function listarPedidosConcluidos() {
    const corpoTabela = document.getElementById('tabela-corpo');
    // Busca os usuários salvos no localStorage (ou uma lista vazia se não houver)
    const lista = JSON.parse(localStorage.getItem('pedidosConcluidos')) || [];

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

    lista.forEach(pedidos => {

        // Mapeia o resultado direto para a classe desejada
        const classesBadge = {
            "Prejuizo": "badgePrejuizo",
            "Lucro": "badgeLucro"
        };

        const badge = classesBadge[pedidos.resultadoFinal] || 'badgePrejuizo';

        const linha = `
            <tr>
                <td>${pedidos.id}</td>
                <td>${pedidos.nomeProduto}</td>
                <td>${pedidos.numeroPedido}</td>
                <td>${pedidos.catMaterial}</td>
                <td>${pedidos.valorTotal}</td>
                <td>${pedidos.tempoFabricacao}</td>
                <td>${pedidos.resultadoFinalMinutos}</td>
                <td>${pedidos.CatMaq}</td>
                <td><span class="${badge}">${pedidos.resultadoFinal}</td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}
