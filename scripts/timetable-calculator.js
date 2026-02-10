/*
 * Author: ianfvBR
 * Name: tiemtable-calculator
 */


/* This script interacts with the html page to provide an interactive
 * timetable calculator, where the user inserts the subjects and their schedules
 * and the page returns all possible ways of arranging them without conflicts.
 */
import * as Manager from "./conflict-manager.js";

function create_cell(data) {
    const new_cell = document.createElement("td");

    new_cell.textContent = data;
    new_cell.classList.add("timeslot");
    return new_cell;
}


function create_row(name) {
    const new_row = document.createElement("tr");
    const header = document.createElement("th");

    header.textContent = name;
    new_row.classList.add("hour");
    new_row.appendChild(header);
    for (let count = 6; count > 0; count--) {
        new_row.appendChild(create_cell("------"));
    }

    return new_row;
}


function create_body(name) {
    const new_body = document.createElement("tbody");
    const blank = document.createElement("tr");
    const blank_cell = document.createElement("td")
    const shift = name[0];

    new_body.appendChild(create_row(`${shift}1`));
    new_body.appendChild(create_row(`${shift}2`));
    new_body.appendChild(create_row(`${shift}3`));
    new_body.appendChild(create_row(`${shift}4`));
    new_body.appendChild(create_row(`${shift}5`));
    new_body.appendChild(create_row(`${shift}6`));

    blank_cell.textContent = " ";
    blank.appendChild(blank_cell);
    blank.classList.add("blank-row");
    new_body.appendChild(blank);

    new_body.classList.add(`shift-${shift}`)
    return new_body;
}


function create_table(name) {
    const new_table = document.createElement("table");
    const caption = document.createElement("caption");
    const headers = [];

    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));
    headers.push(document.createElement("th"));

    headers[0].textContent = "Horários";
    headers[1].textContent = "Segunda";
    headers[2].textContent = "Terça";
    headers[3].textContent = "Quarta";
    headers[4].textContent = "Quinta";
    headers[5].textContent = "Sexta";
    headers[6].textContent = "Sábado";

    caption.textContent = name;
    new_table.appendChild(caption);
    new_table.appendChild(document.createElement("thead"));
    new_table.appendChild(document.createElement("tr"));

    new_table.appendChild(headers[0]);
    new_table.appendChild(headers[1]);
    new_table.appendChild(headers[2]);
    new_table.appendChild(headers[3]);
    new_table.appendChild(headers[4]);
    new_table.appendChild(headers[5]);
    new_table.appendChild(headers[6]);

    new_table.appendChild(create_body("Manhã"));
    new_table.appendChild(create_body("Tarde"));
    new_table.appendChild(create_body("Noite"));

    return new_table;
}



function add_more_class(event) {
    event.preventDefault();
    create_new_class_form(event.target);
}

function create_new_class_form(subject_form) {
    const class_label = document.createElement("label");
    const schedule_label = document.createElement("label")
    const class_input = document.createElement("input");
    const schedule_input = document.createElement("input")
    const new_form = document.createElement("form");
    const checkbox = document.createElement("input");

    class_label.textContent = "\u2937 Turma: ";
    class_input.type = "number";
    class_input.required = "true";
    schedule_label.textContent = "Horário: ";
    schedule_input.type = "text";
    schedule_input.required = "true";
    checkbox.type = "checkbox"
    checkbox.checked = true;

    new_form.appendChild(class_label);
    new_form.appendChild(class_input);
    new_form.appendChild(schedule_label);
    new_form.appendChild(schedule_input);
    new_form.appendChild(checkbox);

    subject_form.appendChild(new_form);
}


function name_is_unique(name) {
    const subjects = document.getElementsByClassName("new-subject");

    for (const subject of subjects) {
        if (subject.querySelector("label").textContent == name.textContent) return false;
    }

    return true;
}


function on_subject_input(event) {
    event.preventDefault();
    const name = document.createElement("label");
    name.textContent = event.target.querySelector("input").value;


    if (name_is_unique(name)) {
        const new_form = document.createElement("form");
        const plus_button = document.createElement("input")
        const new_div = document.createElement("div");


        new_div.appendChild(name)
        plus_button.type = "submit";
        plus_button.value = "+";
        plus_button.classList.add("new-class-button");
        new_div.appendChild(plus_button);
        new_div.classList.add("new-subject");

        new_form.appendChild(new_div);
        new_form.classList.add("subject-form");
        new_form.addEventListener("submit", add_more_class);

        div.appendChild(new_form);
        create_new_class_form(new_form);
    }
}


function populate_subject_list() {
    const subjects = document.getElementsByClassName("subject-form");

    subject_list.length = 0;
    for (const subject of subjects) {
        const name = subject.querySelector("div").querySelector("label").textContent;
        const subject_classes = subject.querySelectorAll("form");

        for (const subject_class of subject_classes) {
            const data = subject_class.querySelectorAll("input");
            
            if (data[2].checked) { // Checkbox
                const number = data[0].value;
                const schedule = new Manager.Schedule(data[1].value);

                subject_list.push(new Manager.Subject(name, number, schedule));
            }
        }
    }
}


function populate_table(table, data) {
    const hours = table.getElementsByClassName("hour");

    for (let hour_index = 0; hour_index < 16; hour_index++) {
        const timeslots = hours[hour_index].querySelectorAll("td");

        for (let day_index = 0; day_index < 6; day_index++) {
            timeslots[day_index].textContent = data[hour_index][day_index];
        }
    }
}


function erase_container(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function calculate_possibilities(event) {
    event.preventDefault();
    populate_subject_list();

    const conflict_manager = new Manager.ConflictManager(subject_list);
    const size = event.target.querySelector("input").value;
    const container = document.getElementById("timetable-calculator");
    erase_container(container);
    let counter = 1;

    container.style.visibility = "visible";
    conflict_manager.calculate_possibilities(size);
    for (const possibility of conflict_manager.all_possibilities) {
        const table = create_table(`Opção: ${counter}`);
        populate_table(table, possibility.table);
        container.appendChild(table);
        counter++;
    }
}


function main() {
    document.getElementById("calculate-possibilities").
    addEventListener("submit", calculate_possibilities);

    div.querySelector("form").addEventListener("submit", on_subject_input)
}

const subject_list = [];
const div = document.getElementsByName("subject-input")[0];
main();