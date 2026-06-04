window.onload = function () {
    // Recupera os valores do localStorage
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const catSalva = localStorage.getItem('usuarioCat');

    // Seleciona os elementos e atualiza o texto
    document.getElementById('display-user').innerText = nomeSalvo || 'Convidado';
    document.getElementById('display-category').innerText = catSalva || 'N/A';

    // Inicia na tela home
    carregarTela('homeManufatura_content');
}

// Faz a tabela se redesenhar a cada 1 segundo, atualizando os cronômetros que estão rodando
setInterval(() => {
    let EmProducao = localStorage.getItem('EmProducao');
    if (EmProducao === 'Rodando') {
        contarMinutos();
    }
}, 1000);

function carregarTela(nomeDaTela) {
    const principal = document.querySelector('.content');

    fetch(`./Content/${nomeDaTela}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Página não encontrada');
            return response.text();
        })
        .then(html => {
            principal.innerHTML = html;
            window.scrollTo(0, 0);
            atualizarHome();
        })
        .catch(err => {
            principal.innerHTML = `<p style="color:red">Erro ao carregar: ${err.message}</p>`;
        });
}

function atualizarHome() {

    let listaMaquinas = JSON.parse(localStorage.getItem('maquinas'));
    if(listaMaquinas) 
    document.getElementById('totalMaquinas').innerText = listaMaquinas.length;
    else
    document.getElementById('totalMaquinas').innerText = "0";

    let listaPedidos = JSON.parse(localStorage.getItem('pedidos'));
    if(listaPedidos)
    document.getElementById('totalPedidos').innerText = listaPedidos.length;
    else
    document.getElementById('totalPedidos').innerText = "0 Pedidos";

    let concluidos = localStorage.getItem('Concluidos');
    if(concluidos)
    document.getElementById('totalConcluido').innerText = concluidos;
    else
    document.getElementById('totalConcluido').innerText = "0 Pedidos";

    listarPedidos();
}

function listarPedidos() {
    const corpoTabela = document.getElementById('tabela-corpo');
    const lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const emProducao   = localStorage.getItem('EmProducao');
    const idEmProducao = Number(localStorage.getItem('EmProducaoId'));

    corpoTabela.innerHTML = ""; // Limpa a tabela antes de preencher

    // 1. MAPEIA O PESO DE CADA URGÊNCIA (Quanto maior o número, mais no topo fica)
    const pesoUrgencia = {
        "Critica": 4,
        "Alta": 3,
        "Média": 2,
        "Normal": 1
    };

    // 2. ORDENA A LISTA (Coloca as urgências de maior peso primeiro)
    lista.sort((a, b) => {
        const pesoA = pesoUrgencia[a.CatUrgencia] || 0;
        const pesoB = pesoUrgencia[b.CatUrgencia] || 0;
        return pesoB - pesoA; // Ordem decrescente
    });

    // 3. MAPA DE CLASSES CSS DOS BADGES
    const classesBadge = {
        "Normal": "badgeNormal",
        "Média": "badgeMedia",
        "Alta": "badgeAlta",
        "Critica": "badgeCritica"
    };

    // 4. AGORA O FOREACH RODA NA LISTA JÁ ORDENADA (Apenas 1 bloco de HTML limpo)
    lista.forEach(pedidos => {
        const badge = classesBadge[pedidos.CatUrgencia] || 'badgeNormal';
        const estaRodando = emProducao === 'Rodando' && Number(pedidos.id) === idEmProducao;

        const displayIniciar = estaRodando ? 'none'         : 'inline-block';
        const displayPausar  = estaRodando ? 'inline-block' : 'none';

        const linha = `
            <tr>
                <td>${pedidos.id}</td>
                <td>${pedidos.nomeProduto}</td>
                <td>${pedidos.numeroPedido}</td>
                <td>${pedidos.CatMaterial}</td>
                <td><span class="${badge}">${pedidos.CatUrgencia}</span></td>
                <td>${pedidos.CatMaq}</td>
                <td>
                    <button data-id="${pedidos.id}" class="btn-iniciar"
                            style="display:${displayIniciar}"
                            onclick="IniciarPedido(${pedidos.id})">▶</button>
                    <button data-id="${pedidos.id}" class="btn-pausar"
                            style="display:${displayPausar}"
                            onclick="PausarPedido(${pedidos.id})">❚❚</button>
                    <button data-id="${pedidos.id}" class="btn-finalizar"
                            onclick="FinalizarPedido(${pedidos.id})">⏹</button>
                </td>
                <td>${pedidos.horaInicio      || '--:--:--'}</td>
                <td>${pedidos.horaPausa       || '--:--:--'}</td>
                <td>${pedidos.horaFim         || '--:--:--'}</td>
                <td>${pedidos.minutosCorridos || '--:--:--'}</td>
            </tr>
        `;

        corpoTabela.innerHTML += linha;
    });
}


function IniciarPedido(id) {
    let EmProducao = localStorage.getItem('EmProducao');

    if (EmProducao === 'Finalizado' || EmProducao === 'Pausado' || EmProducao === null) {
        if (confirm("Tem certeza que deseja iniciar a produção")) {
            localStorage.setItem('EmProducao', 'Rodando');
            localStorage.setItem('EmProducaoId', id);

            const opcoes = {hour: '2-digit', minute: '2-digit', second: '2-digit'};
            const horaAtual = new Date().toLocaleTimeString('pt-BR', opcoes);
            localStorage.setItem('HoraInicio', horaAtual);

            // 1. Busca a lista atualizada do localStorage
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];

            // 2. Localiza o pedido pelo ID digitado
            const pedido = lista.find(p => Number(p.id) === Number(id));

            if (pedido) {
                 // 4. Salva a propriedade 'horaInicio' dentro do objeto deste pedido
                if(!pedido.horaInicio)
                pedido.horaInicio = horaAtual;
                // 5. Atualiza o localStorage com o dado novo
                localStorage.setItem('pedidos', JSON.stringify(lista));
                // 6. Atualiza a tabela na tela imediatamente para mostrar a hora
                listarPedidos();
            }
        }
    }
    else {
        alert("Primeiro finalize ou pause a produção da peça anterior antes de iniciar uma nova.")
    }

}

function PausarPedido(id) {

    let EmProducao = localStorage.getItem('EmProducao');

    if (EmProducao === 'Rodando') {
        if (confirm("Tem certeza que deseja pausar a produção")) {
            localStorage.setItem('EmProducao', 'Pausado');
            localStorage.setItem('EmProducaoId', id);

            const horaAtual = new Date().toLocaleTimeString('pt-BR');
            localStorage.setItem('HoraPausa', horaAtual);

            // 1. Busca a lista atualizada do localStorage
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];

            // 2. Localiza o pedido pelo ID digitado
            const pedido = lista.find(p => Number(p.id) === Number(id));

            if (pedido) {
                // 3. Captura a hora atual formatada (HH:MM:SS)
                const horaAtual = new Date().toLocaleTimeString('pt-BR');

                // 4. Salva a propriedade 'horaInicio' dentro do objeto deste pedido
                pedido.horaPausa = horaAtual;

                // 5. Atualiza o localStorage com o dado novo
                localStorage.setItem('pedidos', JSON.stringify(lista));

                // 6. Atualiza a tabela na tela imediatamente para mostrar a hora
                listarPedidos();
            }
        }
    }
    else {
        alert("Primeiro inicie a produção de uma peça antes de finalizar.")
    }
}

function FinalizarPedido(id) {
    let EmProducao = localStorage.getItem('EmProducao');

    if (EmProducao === 'Rodando') {
        if (confirm("Tem certeza que deseja finalizar a produção")) {
            localStorage.setItem('EmProducao', 'Finalizado');
            localStorage.setItem('EmProducaoId', 0);

            const horaAtual = new Date().toLocaleTimeString('pt-BR');
            localStorage.setItem('HoraFim', horaAtual);

            // 1. Busca a lista atualizada do localStorage
            let lista = JSON.parse(localStorage.getItem('pedidos')) || [];

            // 2. Localiza o pedido pelo ID digitado
            const pedido = lista.find(p => Number(p.id) === Number(id));

            if (pedido) {
                // 3. Captura a hora atual formatada (HH:MM:SS)
                const horaAtual = new Date().toLocaleTimeString('pt-BR');

                // 4. Salva a propriedade 'horaInicio' dentro do objeto deste pedido
                pedido.horaFim = horaAtual;

                // 5. Atualiza o localStorage com o dado novo
                localStorage.setItem('pedidos', JSON.stringify(lista));

                // 6. Atualiza a tabela na tela imediatamente para mostrar a hora
                excluirPedido(id);
                listarPedidos();
                atualizarHome();

                localStorage.setItem('Segundos', 0);
                localStorage.setItem('Minutos', 0);
                localStorage.setItem('Horas', 0);
            }
        }
    }
    else {
        alert("Primeiro inicie a produção de uma peça antes de finalizar.")
    }
}

function contarMinutos() {

    let id = localStorage.getItem('EmProducaoId');
    let segundos = Number(localStorage.getItem('Segundos')) || 0;
    let minutos = Number(localStorage.getItem('Minutos')) || 0;
    let horas = Number(localStorage.getItem('Horas')) || 0;

    segundos++;

    if (segundos === 60) {
        segundos = 0;
        minutos++;

        if (minutos === 60) {
            minutos = 0;
            horas++;
        }
    }

    localStorage.setItem('Segundos', segundos);
    localStorage.setItem('Minutos', minutos);
    localStorage.setItem('Horas', horas);

    const pad = num => String(num).padStart(2, '0');

    // 1. Busca a lista atualizada do localStorage
    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];

    // 2. Localiza o pedido pelo ID digitado
    const pedido = lista.find(p => Number(p.id) === Number(id));

    if (pedido) {

        // 3. Salva a propriedade 'minutosCorridos' dentro do objeto deste pedido
        pedido.minutosCorridos = `${pad(horas)} : ${pad(minutos)} : ${pad(segundos)}`;

        // 4. Atualiza o localStorage com o dado novo
        localStorage.setItem('pedidos', JSON.stringify(lista));

        // 5. Atualiza a tabela na tela imediatamente para mostrar a hora
        listarPedidos();
    }
}

function excluirPedido(id) {
    // 1. Altere de const para let para permitir a reatribuição do filtro
    let lista = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidoEncontrado = lista.find(pedido => Number(pedido.id) === Number(id));

    let concluidos = localStorage.getItem('Concluidos') || 0;

    if (pedidoEncontrado) {
        // 2. Converta ambos os IDs para Number para garantir que o filtro funcione
        lista = lista.filter(u => Number(u.id) !== Number(id));

        localStorage.setItem('pedidos', JSON.stringify(lista));
        listarPedidos(); // Recarrega a tabela

        concluidos = Number(concluidos) + 1;
        localStorage.setItem('Concluidos', concluidos);
    }
}
