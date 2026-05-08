window.onload = function() {
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
    
    fetch(`Content/${nomeDaTela}.html`)
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
            if (nomeDaTela === "home_content") 
            {
                document.querySelector('.file_10').closest('li').classList.add('active');
            } 
            else if (nomeDaTela === "cadastrarUsuario_content") 
            {
                document.querySelector('.file_20').closest('li').classList.add('active');
            }
             else if (nomeDaTela === "listaUsuarios_content") {
                document.querySelector('.file_30').closest('li').classList.add('active');
            }
            
        })
        .catch(err => {
            principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`;
        });
}


//Recebe o evento de click do botão cadastro
function CadastrarUsuario() 
{
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
    else 
    {
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
                </td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function excluirUsuario(id) {
    if(confirm("Tem certeza que deseja remover este usuário?")) {
        let lista = JSON.parse(localStorage.getItem('usuarios')) || [];
        // Filtra a lista removendo o ID selecionado
        lista = lista.filter(u => u.id !== id);
        localStorage.setItem('usuarios', JSON.stringify(lista));
        listarUsuarios(); // Recarrega a tabela
    }
}