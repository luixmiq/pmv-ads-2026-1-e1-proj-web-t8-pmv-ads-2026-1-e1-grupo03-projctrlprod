window.onload = function () {
  // Recupera os valores do localStorage
  const nomeSalvo = localStorage.getItem("usuarioNome");
  const catSalva = localStorage.getItem("usuarioCat");

  // Seleciona os elementos e atualiza o texto
  document.getElementById("display-user").innerText = nomeSalvo || "Convidado";
  document.getElementById("display-category").innerText = catSalva || "N/A";

  // Inicia na tela home
  carregarTela("home_content");
};

function carregarTela(nomeDaTela) {
  const principal = document.querySelector(".content");

  fetch(`Content/${nomeDaTela}.html`)
    .then((response) => {
      if (!response.ok) throw new Error("Página não encontrada");
      return response.text();
    })
    .then((html) => {
      principal.innerHTML = html;
      window.scrollTo(0, 0);

      // 1. Remove a classe 'active' de TODOS os <li> dentro da árvore
      document.querySelectorAll(".project-tree li").forEach((li) => {
        li.classList.remove("active");
      });

      // 2. Adiciona a classe 'active' no <li> pai do item clicado
      if (nomeDaTela === "home_content") {
        document
          .querySelector(".file_10")
          .closest("li")
          .classList.add("active");
      } else if (nomeDaTela === "cadastrarUsuario_content") {
        document
          .querySelector(".file_20")
          .closest("li")
          .classList.add("active");
      } else if (nomeDaTela === "listaUsuarios_content") {
        document
          .querySelector(".file_30")
          .closest("li")
          .classList.add("active");
        listarUsuarios();
      }
    })
    .catch((err) => {
      principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`;
    });
}

//Recebe o evento de click do botão cadastro
function CadastrarUsuario() {
  // 1. Captura os elementos
  const usuario = document.getElementById("username").value;
  const cat = document.getElementById("usuarioCat").value;
  const senha1 = document.getElementById("pwd1").value;
  const senha2 = document.getElementById("pwd2").value;

  // 2. Lógica de Validação
  if (usuario === "" || cat === "" || senha1 === "" || senha2 === "") {
    alert("⚠️ Por favor, preencha todos os campos do formulário!");
  } else if (senha1 !== senha2) {
    alert("❌ As senhas digitadas estão diferentes!");
    document.getElementById("pwd1").value = "";
    document.getElementById("pwd2").value = "";
  } else {
    // 1. Pega a lista de usuários já salvos ou cria uma vazia se for o primeiro
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [
      { id: 1, usuario: "admin", senha: "admin", categoria: "Administrador" },
    ];

    // 2. Cria o novo objeto de usuário com ID incremental
    const novoUsuario = {
      id: listaUsuarios.length + 1,
      usuario: usuario,
      senha: senha1,
      categoria: cat,
    };

    // 3. Adiciona na lista e salva de volta no "banco" (localStorage)
    listaUsuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    // 4. Feedback e Limpeza
    alert(`✅ Usuário ${usuario} cadastrado com sucesso!`);
    document.querySelector(".cadastro-form").reset();
  }
}

function listarUsuarios() {
  const corpoTabela = document.getElementById("tabela-corpo");
  // Busca os usuários salvos no localStorage (ou uma lista vazia se não houver)
  const lista = JSON.parse(localStorage.getItem("usuarios")) || [];

  corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

  lista.forEach((user) => {
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
  const UsuarioAtivo = localStorage.getItem("usuarioNome");
  let UsuarioTabela;

  //Recupera o nome do usuário pelo ID
  const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = lista.find(
    (user) => Number(user.id) === Number(id),
  );

  if (usuarioEncontrado) {
    UsuarioTabela = usuarioEncontrado.usuario;
  }

  if (UsuarioTabela != UsuarioAtivo) {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
      // Filtra a lista removendo o ID selecionado
      lista = lista.filter((u) => u.id !== id);
      localStorage.setItem("usuarios", JSON.stringify(lista));
      listarUsuarios(); // Recarrega a tabela
    }
  } else {
    alert(
      "Você não pode excluir um usuário ativo, faça Login com outro usuário !",
    );
  }
}

// 2. Ajuste na função de SALVAR
function salvarAlteracoes() {
  const id = localStorage.getItem("usuarioId");
  const novoNome = document.getElementById("username").value;
  const novaCategoria = document.getElementById("usuarioCat").value;
  const novaSenha = document.getElementById("pwd1").value;
  const novaSenha1 = document.getElementById("pwd2").value;

  if (novaSenha === novaSenha1 && novoNome !== "") {
    let lista = JSON.parse(localStorage.getItem("usuarios")) || [];

    lista = lista.map((user) => {
      if (Number(user.id) === Number(id)) {
        // ATENÇÃO: Use 'usuario' e não 'nome' para bater com seu cadastro
        return {
          ...user,
          usuario: novoNome,
          categoria: novaCategoria,
          senha: novaSenha,
        };
      }
      return user;
    });

    localStorage.setItem("usuarios", JSON.stringify(lista));

    document.getElementById("meuPopup").close(); // Fecha o modal
    listarUsuarios(); // Atualiza a tabela
    alert("Usuário atualizado com sucesso!");
  } else {
    alert("As senhas não coincidem ou o nome está vazio.");
  }
}

function abrirModalEditar(id) {
  // Salva os dados do ID do usuário
  localStorage.setItem("usuarioId", id);

  const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = lista.find(
    (user) => Number(user.id) === Number(id),
  );

  if (usuarioEncontrado) {
    const popup = document.getElementById("meuPopup");

    document.getElementById("user").innerText = usuarioEncontrado.usuario;
    document.getElementById("username").value = usuarioEncontrado.usuario;
    document.getElementById("usuarioCat").value = usuarioEncontrado.categoria;

    popup.showModal();
  }
}

// Fechar se clicar fora do modal
document.addEventListener("click", (event) => {
  const popup = document.getElementById("meuPopup");

  // Verifica se o alvo do clique é o próprio dialog (o fundo)
  if (event.target === popup) {
    const rect = popup.getBoundingClientRect();

    // Verifica se o clique foi fora da área do conteúdo (considerando as bordas)
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (isInDialog === false) {
      popup.close();
    }
  }
});
