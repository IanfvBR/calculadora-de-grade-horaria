<h1>Documentação</h1>
<h2>Descrição</h2>
 <p>
  Este projeto se trata de uma página HTML que utiliza Javascript para calcular todas as formas de montar uma grade horária.
 </p>
 <h2>Scripts</h2>
 <h3>conflict-manager.js</h3>
 <p>Esse módulo contêm as classes:</p>
 <p>
  &bullet; Schedule:
  <br> Gerencia, processa e armazena dados referentes aos horários de uma turma de uma disciplina.
 </p>
 <p>
  &bullet; Subject:
  <br> Gerencia, processa e armazena dados referentes a uma determinada turma de uma disciplina.
 </p>
 <p>
  &bullet; Timetable:
  <br> Gerencia, processa e armazena dados referentes ao quadro de horários.
 </p>
 <p>
  &bullet; ConflictManager:
  <br> Gerencia, processa e armazena dados de todas as disciplinas, se utilizando de um algoritmo backtrack para calcular 
  todas as possíveis formas de montar a grade horária.
  <h4>Como utilizar?</h4>
  <p>Crie uma lista de disciplinas, cada uma recebendo string nome, int turma e Schedule horários. Para criar uma Schedule
   , passe uma string com o código do horário no estilo do SIGAA (ex.: 24M56 para segunda e quarta, turno da manhã, horários 5 e 6).
   <br>Então, crie uma instância de ConflictManager, com a lista de disciplinas como parâmetro. Use instância.calculate_possibilities(tamanho desejado)
   para gerar uma lista de possíveis grades horárias. Acesse essa lista com instância.all_possibilities, e acesse cada grade horária com
   instância.all_possibilities[index].table.
  </p>
 </p>
 <h3>timetable-calculator.js</h3>
 <p>Esse script faz as alterações no documento HTML, contendo diversas funções necessárias. Não é possível de ser reutilizado em outras aplicações,
  pois depende muito de como o HTML está estruturado.
 </p>
 <h1>Exemplo:</h1>

<h2>1</h2>
 <img width="1362" height="635" alt="example-3" src="https://github.com/user-attachments/assets/fa811e8b-6484-406b-a059-bbfc9b82ac0c" />
 <h2>2</h2>
<img width="1365" height="635" alt="example-2" src="https://github.com/user-attachments/assets/9ccc1c64-567d-4dbc-8e64-625de5fa1b9e" />
