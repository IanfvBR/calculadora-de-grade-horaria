/*
 * Author: ianfvBR
 * Name: conflict-manager
 */


/* This script contains the Schedule, Subject, Timetable and ConflictManager
 * classes and their methods. It's main purpose is to check for conflicting schedules
 * between multiple subjects. */


// Global constants used in the script
const FIRST_DAY = '2'; //Monday
const LAST_DAY = '7'; //Saturday
const MORNING_SHIFT = 'M';
const AFTERNOON_SHIFT = 'T';
const NIGHT_SHIFT = 'N';
const FIRST_HOUR = '1';
const LAST_HOUR = '6';

// This class receives the schedule code string (default: [days][shift][hours], eg.: 24M56) and
// stores it in days array, shift variable and hours array.
export class Schedule {
    constructor(code) {
        this.code = code.toUpperCase();
        this.days = [];
        this.shift;
        this.hours = [];
        this.is_valid = true;
        this.translate_code();
    }


    // Translate the schedule code string into easier to handle data
    translate_code() {
        let index = 0;

        while (index < this.code.length && 
            this.code[index] >= FIRST_DAY && this.code[index] <= LAST_DAY) {

            this.days.push(parseInt(this.code[index]));
            index++;
        }

        if (index < this.code.length && this.code[index] == MORNING_SHIFT) this.shift = 1;
        else if (this.code[index] == AFTERNOON_SHIFT) this.shift = 2;
        else if (this.code[index] == NIGHT_SHIFT) this.shift = 3;
        else this.is_valid = false;

        index++;
        while (index < this.code.length && 
            this.code[index] >= FIRST_HOUR && this.code[index] <= LAST_HOUR) {

            this.hours.push(parseInt(this.code[index]));
            index++
        }

        if (index < this.code.length) this.is_valid = false;
    }


    // If two schedules occur in the same shift, same day and same hour, return true.
    causes_conflict(other_schedule) {
        if (this.is_valid) {
            if (this.shift == other_schedule.shift) {
                for (const day of this.days) {
                    if (other_schedule.days.includes(day)) {
                        for (const hour of this.hours) {
                            if (other_schedule.hours.includes(hour)) return true;
                        }
                    }
                }
            }
            
            return false;
        }

        return true;
    }
}


// This class receives strings containing the name, number (in case there's more than one class
//  for the same subject), and an instance of Schedule.
export class Subject {
    constructor(name, number, schedule) {
        this.name = name;
        this.number = parseInt(number);
        this.schedule = schedule;
    }


    // Check for conflict between subjects. Is it the same subject?
    // Do their schedules conflict?
    causes_conflict(other_subject) {
        if (this.name != other_subject.name) {
            return this.schedule.causes_conflict(other_subject.schedule);
        }

        return true; // Same subject
    }
}


// The timetable formats a list of subjects into a matrix of strings representing a timetable.
export class Timetable {
    constructor(subjects) {
        this.subjects = subjects;
        this.table = [];
        this.initialize_table();
        this.fill_table();
    }


    // table = [hour1, hour2, ...]
    // hour1 = [day1, day2, ...]
    // [[day1, day 2, ...], [day1, day2, ...], ...]
    // hours will be rows, while days will be columns
    initialize_table() {
        const number_of_shifts = 3;
        const blank_timeslot = "------";

        for (let hour = FIRST_HOUR; hour <= LAST_HOUR * number_of_shifts; hour++) {
            const row = [];

            for (let day = FIRST_DAY; day <= LAST_DAY; day++) {
                row.push(blank_timeslot);
            }

            this.table.push(row);
        }
    }


    // Fill the table with the name of the subjects + class number
    fill_table() {
        for (const subject of this.subjects) {
            for (const hour of subject.schedule.hours) {
                for (const day of subject.schedule.days) {
                    this.table[(hour + 6 * (subject.schedule.shift - 1) - FIRST_HOUR)][day - FIRST_DAY] = 
                    `${subject.name} T${subject.number}`;
                }
            }
        }
    }
}


// Stores all desired subjects and uses a backtrack algorithm to generate possible timetables
// without conflicting schedules
export class ConflictManager {
    #current_selection = [];

    constructor(subjects) {
        this.all_subjects = subjects;
        this.all_possibilities = [];
    }



    can_insert(new_subject) {
        for (const subject of this.current_selection) {
            if (new_subject.causes_conflict(subject)) {
                return false;
            }
        }

        return true;
    }


    backtrack(size, start = 0) {
        if (this.current_selection.length == size) {
            this.all_possibilities.push(new Timetable(this.current_selection));
            return;
        }

        for (let index = start; index < this.all_subjects.length; index++) {
            if (this.can_insert(this.all_subjects[index])) {
                this.current_selection.push(this.all_subjects[index]);
                this.backtrack(size,start++);
                this.current_selection.pop();
            }
        }
    }


    calculate_possibilities(size) {
        this.current_selection = [];
        this.all_possibilities = [];
        this.backtrack(size);
    }
}