const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;

class Tabela_de_Horario {
    constructor(horario) {
        this.dias = this.ler_dias(horario);
        this.turno = this.ler_turno(horario);
        this.horas = this.ler_horas(horario);
    }


    ler_dias(horario) {
        let dias = [];
        for (const char of horario) { // Iterate over each character
            // Check if the character is a digit (0-9)
            if (char >= '0' && char <= '9') {
            // Convert the character string to an integer and push it to the array
            dias.push(parseInt(char, 10)); // Use parseInt with radix 10
            } else {
            // Break the loop once a non-number is found
            break;
            }
        }
        return dias;
    }


    ler_turno(horario){
          for (let char of horario) { // Iterate over each character
            // Check if the character is 'M', 'T' or 'N'
            char = char.toUpperCase();
            if (char == 'M' || char == 'T' || char == 'N') {
                if (char == 'M') {
                    return 0; // Manha
                }
                else {
                    if (char == 'T') {
                        return 1; // Tarde
                    }
                    return 2; // Noite
                }
            }
        }
    }


    ler_horas(horario) {
        let horas = [];
        for (let i = horario.length - 1; i >= 0; i--) {            
            // Check if the character is a digit (0-9)
            if (horario[i] >= '0' && horario[i] <= '9') {
            // Convert the character string to an integer and push it to the array
                horas.push(parseInt(horario[i], 10)); // Use parseInt with radix 10
            } else {
                // Break the loop once a non-number is found
                break;
            }
        }
        return horas;
    }
}

class Disciplina {
    constructor(nome, horario) {
        this.nome = nome;
        this.horario = horario
        this.tabela = new Tabela_de_Horario(horario);
    }
}


function colocar_na_lista(id, disciplinas) {
    const lista1 = document.getElementById(id);
    const sequencia = document.createElement("ol");

    for (const disciplina of disciplinas) {
        const novo = document.createElement("li");
        const node = document.createTextNode(`Nome: ${disciplina.nome}       Horário: ${disciplina.horario}`);
        const pre = document.createElement("pre");

        pre.appendChild(node);
        novo.appendChild(pre);
        sequencia.appendChild(novo);
    }

    document.getElementById(id).append("=====================================");
    document.getElementById(id).appendChild(sequencia);
}


function verificar_conflito(disciplinas, nova_disciplina) {
    if (disciplinas.length > 0) {
        // Para cada disciplina ja no quadro de horarios
        for (disciplina of disciplinas) {
            // Para cada dia da nova disciplina
            for (dia of nova_disciplina.tabela.dias) {
                // Se esse dia coincidir com algum dos dias ja ocupados
                if (disciplina.tabela.dias.includes(dia)) {
                    // Se coincidir tambem o turno
                    if (nova_disciplina.tabela.turno == disciplina.tabela.turno) {
                        // E se coincidir algum horario
                        for(hora of nova_disciplina.tabela.horas) {
                            if(disciplina.tabela.horas.includes(hora)) {
                                // Entao retorna que houve conflito
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}


function backtrack(disciplinas, inicio, tamanho) {
    // Quando a combinação atingir o tamanho certo, adicionar à lista
    if (disciplinas.length == tamanho) {
        colocar_na_lista("resultado",disciplinas);
        return;
    }

    // Recursao
    for (let index = inicio; index < grade.length; index++) {
        const element = grade[index];

        if(verificar_conflito(disciplinas, element)) {
            disciplinas.push(element);
            backtrack(disciplinas,inicio++,tamanho);
            disciplinas.pop();
        }        
    }
}

let grade = [];


function calcular_possibilidades(event) {
    event.preventDefault();
    const label1 = document.createElement("label");
    const numero = document.getElementById("numero").value;

    label1.textContent = "Possibilidades:"
    label1.appendChild(document.createElement("br"));

    document.getElementById("resultado").appendChild(label1);
    backtrack([], 0, numero);
}


function addItem(event) {
        event.preventDefault();
        // Get the value from the input field
        const nome = document.getElementById("nome").value;
        const horario = document.getElementById("horario").value;
        const lista = document.getElementById("lista de horarios");
        const numero = document.getElementById("numero").value;

        grade.push(new Disciplina(nome,horario));

        // Check if the input is empty to prevent adding blank items
        if (nome.trim() === '' || horario.trim() === '') {
            alert("Please enter a value.");
            return; // Stop the function if input is empty
        }

        // Create a new list item element (li)
        const newItem = document.createElement('li');
        const pre = document.createElement('pre');

        // Set the text content of the new list item to the input value
        const node = document.createTextNode(`Nome: ${nome}       Horário: ${horario}`);
        pre.appendChild(node);
        newItem.appendChild(pre);

        // Append the new item to the ordered list (ol)
        lista.appendChild(newItem);

        // Clear the input field after adding the item for user convenience
        document.getElementById("nome").value = '';
        document.getElementById("horario").value = '';
        
        // Optional: focus the input field again, ready for the next item
        document.getElementById("nome").focus();
    }