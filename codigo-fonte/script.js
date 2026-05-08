document.getElementById('BtnLogin').addEventListener('click', function(event) {
    event.preventDefault();

    const usuarioDigitado = document.getElementById('username').value;
    const senhaDigitada = document.getElementById('pwd').value;

    // 1. Busca a lista do localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // 2. SE não existir nada no localStorage, cria o admin padrão
    if (usuarios) {
        usuarios = 
        [
            { "id": 1, "usuario": "eng", "senha": "eng", "categoria": "Administrador" }
        ];
        // Salva o admin padrão para que ele exista nas próximas consultas
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // --- Caso esqueça a senha, basta utilizar o código abaixo ---
    // console.log("Digitado:", { usuario: usuarioDigitado, senha: senhaDigitada });
    // console.log("Lista no LocalStorage:", usuarios);

    // 3. Agora procura o usuário na lista (seja na padrão ou na que você cadastrou)
    const usuarioEncontrado = usuarios.find(u => 
        u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );

    if (usuarioEncontrado) 
    {
        // Salva os dados da sessão
        localStorage.setItem('usuarioNome', usuarioEncontrado.usuario);
        localStorage.setItem('usuarioCat', usuarioEncontrado.categoria);
        
        // Redireciona
        window.location.href = "Principal/principal.html";
    } else {
        document.getElementById('username').value = "";
        document.getElementById('pwd').value = "";
        alert('⚠️ Usuário ou senha incorretos.');
    }
});