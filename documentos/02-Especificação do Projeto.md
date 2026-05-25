# Especificação do Projeto

## Perfis de Usuários

<table>
<tbody>
<tr align=center>
<th colspan="2">Perfil 01 : Administrador </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Gerente ou organizador que supervisiona a produção</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
  1 - Saber se o orçamento está de acordo com a fabricação.
  2 - Controlar a ordem de fabricação das peças por fila e prioridade.
  3 - Identificar gaps e corrigir o processo do orçamento a fabricação.
</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Perfil 02 : Torneiro </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Colaborador responsável pela fabricação das peças</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
  1 - Entender como o sistema da empresa funciona.
  2 - Registrar o progresso e o desenvolvimento pessoal.
  3 - Exibir o desempenho individual para administração.
</td>
</tr>
</tbody>
</table>


## Histórias de Usuários

|EU COMO... `QUEM`   | QUERO/PRECISO ... `O QUE`                                       |PARA ... `PORQUE`                                                 |
|--------------------|-----------------------------------------------------------------|------------------------------------------------------------------|
| Torneiro           |Quero contabilizar o tempo e custo de produção de cada peça      | Para registrar o meu desempenho.                                 |
| Administrador      |quero acompanhar a fila de produção                              | para orientar melhor os colaboradores.                           |
| Administrador      |quero acompanhar o que já foi produzido                          | para não perder o controle e melhorar a tratativa com o cliente. |
| Administrador      |quero criar um orçamento para a produção de cada tipo de peça    | Para registrar o meu desempenho.                                 |
| Administrador      |quero entender melhor os meus custos de produção hora            | para ser mais assertivo e evitar prejuízos para empresa.         |
| Administrador      |quero analisar qual turno é mais produtivo                       | para organizar e balancear a equipe.                             |
| Administrador      |quero analisar qual máquina está produzindo mais peças           | para balancear o desgaste das máquinas.                          |
| Administrador      |quero saber quantos ciclos foram feitos em cada máquina          | para ver se uso mais a CNC ou torno.                             |
| Torneiro           |quero entender como o sistema funciona assim que entro na empresa| para começar logo o meu trabalho da maneira correta.             |
| Torneiro           |quero saber o quanto produzi no mês                              | para mostrar o meu rendimento.                                   |
| Administrador      |quero saber os custos fixos da produção                          | para ter uma visão completa dos gastos que estão acontecendo.    |
| Administrador      |Quero que os meus funcionários não acessem certas informações    | para manter a confidencialidade dessas informações.              |
| Torneiro           |quero poder registrar quando uma manutenção inesperada acontece  | para não alarmar a administração quanto ao custo de produção.    |


## Requisitos do Projeto

### Requisitos Funcionais

|ID      | Descrição                                                                                                                           | Prioridade |
|--------|-------------------------------------------------------------------------------------------------------------------------------------|------------|
| RF-01  | O sistema deve possibilitar o cadastro de novos colaboradores dos setores da produção e administração.                              | Alta       | 
| RF-02  | O sistema deve permitir que um torneiro inicie, pause e conclua o tempo de produção de uma determinada peça.                        | Alta       |
| RF-03  | O sistema deve possibilitar a administração programar uma fila de produção com base na sua categoria (crítica, alta, média, normal).| Alta       |
| RF-04  | O sistema deve possibilitar a administração ver quais peças obtiveram lucro ou prejuízo durante sua produção.                       | Alta       |
| RF-05  | O sistema deve possibilitar a identificação de qual máquina executou o trabalho (CNC, Torno).                                       | Alta       |
| RF-06  | O sistema deve possibilitar segregação de acesso a páginas de acordo com os perfis de usuários.                                     | Alta       |
| RF-07  | O sistema deve permitir o setor administrativo criar o orçamento da peça dentro da plataforma.                                      | Média      |
| RF-08  | O sistema deve permitir que o setor administrativo ajuste os custos fixos como água, luz, internet, pastilhas e hora máquina.       | Média      |
| RF-09  | O sistema deve permitir a apresentação de gráficos da fila de produção atual                                                        | Média      |
| RF-10  | O sistema deve permitir acesso ao tutorial de como usar o aplicativo                                                                | Média      |
| RF-11  | O sistema deve conseguir salvar os resultados anteriores e criar filtros para exibir em gráficos esses resultados.                  | Média      |
| RF-12  | O sistema deve permitir que o colaborador registre uma manutenção inesperada.                                                       | Média      |
| RF-13  | O sistema deve permitir a exportação de logs, para saber o que foi feito e por quem dentro da aplicação.                            | Baixa      |



### Requisitos não Funcionais

[Utilize o modelo de tabela abaixo para apresentar os requisitos não-funcionais]

|ID      | Descrição                                                                                       |Prioridade |
|--------|-------------------------------------------------------------------------------------------------|-----------|
| RNF-01 | O sistema deve ser desenvolvido em HTML, CSS e JS.                                              | Alta      | 
| RNF-02 | O sistema deve estar disponível na WEB.                                                         | Alta      | 
| RNF-03 | O sistema deve ser responsivo.                                                                  | Alta      | 
| RNF-04 | O sistema deve ser compatível com os principais navegadores do mercado (Firefox, Chrome, Edge)  | Alta      | 
| RNF-05 | O sistema deve utilizar armazenamento local do navegador.                                       | Alta      | 



