import { writable } from "svelte/store";
import type { IExam, IRoom, IRoomSlot } from "./data";
import * as mock from "./mock";
import { solve } from "./solve";


let data = {
    rooms: mock.rooms,
    remainingExams: mock.exams,
    timetable: mock.timetable,
}

let store = writable(data);

function getExamByUUID(uuid: string) {
    const found = data.remainingExams.find(v => v.uuid === uuid);
    if(!found) { throw new Error(`couldtn find exam with uuid ${uuid}`)}
    return found; 
}

function grabExamByUUID(uuid: string) {
    const found = data.remainingExams.findIndex(v => v.uuid === uuid);
    if(found < 0) { throw new Error(`couldnt find exam with uuid ${uuid}`) }
    const exam = data.remainingExams[found];
    data.remainingExams.splice(found, 1);
    return exam;
}

function insertExamIntoSlot(examUuid: string, slot: IRoomSlot) {
    // todo propper error handling
    if(slot.blocked) { throw new Error("this slot is blocked"); }

    slot.exam = grabExamByUUID(examUuid);

    let slotIdx = slot.room.slots.findIndex(v => v.uuid === slot.uuid);
    store.set(data);
}

function enterCalendars(exam, room, slot) {
    // todo mutator function to enter exam into calendars
}

function removeExamFromSlot(slot: IRoomSlot) {
    if(!slot.exam) throw new Error("no exam in slot");

    data.remainingExams.push(slot.exam);
    // todo remove all relevant calendar events
    slot.exam = undefined;
    store.set(data);
}

function* roomSlots() {
    for(const room of data.rooms) {
        for(const slot of room.slots) {
            yield {
                room,
                slot,
            }
        }
    }
}

function compute() {
    // add try for failed operation
    let result = solve(
        data.remainingExams,
        roomSlots,
        (exam, { room, slot }) => {
            insertExamIntoSlot(exam.uuid, slot);
        },
        [
            // no overwrite exams
            (exam, { room, slot }) => !slot.exam,
            // required tags must be used
            (exam, { room, slot }) => !exam.tags.find(v => v.required && !room.tags.includes(v.name))
        ],
        [
            // try match tags of the exams
            (exam, { room, slot }) => exam.tags.reduce((acc, v) => room.tags.includes(v.name) ? (v.required ? 20 : 10) + acc : acc, 0)
            
        ],
    ); 

    console.log(result);
    
}

function save() {

}

function load() {

}

export {
    getExamByUUID,
    grabExamByUUID,

    data,

    insertExamIntoSlot,
    removeExamFromSlot,

    store,

    compute,
}