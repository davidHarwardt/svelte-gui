import { writable } from "svelte/store";
import type { CalendarEvent } from "./calendar";
import type { IExam, IRoom, IRoomSlot, ITag } from "./data";
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


    const slotIdx = slot.room.slots.findIndex(v => v.uuid === slot.uuid);
    const startTime = data.timetable.lessons[slotIdx].start;
    const examEnd = startTime.clone().add(slot.exam.duration);

    if(containsBlockedSlot(slotIdx, examEnd, slot)) {
        data.remainingExams.push(slot.exam); 
        slot.exam = undefined;
        throw new Error("this exam blocks other blocked slots");
    }

    slot.exam.examinees.forEach(v => v.calendar.book(<CalendarEvent> {
        duration: slot.exam.duration,
        start: startTime,
    }));

    for(let i = slotIdx; i < slot.room.slots.length; i++) {
        const slotStart = data.timetable.lessons[i].start;
        if(slotStart.isBefore(examEnd)) {
            slot.room.slots[i].blocked = true;
        }
    }
    store.set(data);
    // console.log(slot.exam);
}

function containsBlockedSlot(slotIdx: number, examEnd: moment.Moment, slot: IRoomSlot): boolean {
    for(let i = slotIdx; i < slot.room.slots.length; i++) {
        const slotStart = data.timetable.lessons[i].start;
        if(slotStart.isBefore(examEnd) && slot.room.slots[i].blocked) {
            return true;
        }
    }
    return false;
}

function removeExamFromSlot(slot: IRoomSlot) {
    if(!slot.exam) throw new Error("no exam in slot");

    const slotIdx = slot.room.slots.findIndex(v => v.uuid === slot.uuid);
    const startTime = data.timetable.lessons[slotIdx].start;
    const examEnd = startTime.clone().add(slot.exam.duration);
    for(let i = slotIdx; i < slot.room.slots.length; i++) {
        const slotStart = data.timetable.lessons[i].start;
        if(slotStart.isBefore(examEnd)) {
            slot.room.slots[i].blocked = false;
        }
    }
    data.remainingExams.push(slot.exam);

    slot.exam.examinees.forEach(v => v.calendar.remove(<CalendarEvent> {
        duration: slot.exam.duration,
        start: data.timetable.lessons[slotIdx].start,
    }));

    slot.exam.examinees.forEach(v => v.calendar.remove(<CalendarEvent> {
        duration: slot.exam.duration,
        start: data.timetable.lessons[slotIdx].start,
    }));

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
        // hard constraints
        [
            // no overwrite exams
            (exam, { room, slot }) => !slot.exam,
            // required tags must be used
            (exam, { room, slot }) => !exam.tags.find(v => v.required && !room.tags.includes(v.name)),
            // blocked slots arent used
            (exam, { room, slot }) => !slot.blocked,

            (exam, { room, slot }) => {
                let examStart = mock.timetable.lessons[room.slots.findIndex(v => v.uuid === slot.uuid)].start;
                if(exam.examinees.find(v => v.calendar.isBookedRange(examStart, exam.duration))) {return false }
                if(exam.examiners.find(v => v.calendar.isBookedRange(examStart, exam.duration))) { return false }

                return true;
            },
        ],
        // soft constraints
        [
            // try match tags of the exams
            (exam, { room, slot }) => exam.tags.reduce((acc, v) => room.tags.includes(v.name) ? (v.required ? 20 : 10) + acc : acc, 0),
            // longer exams get ranked higher   
            (exam, { room, slot }) => exam.duration.asMinutes(),
        ],
    ); 

    console.log(result);
}

type SaveData = {
    remainingExams: {
        duration: string,
        uuid: string,
        id: string,
        examinerUuids: string[],
        examineeUuids: string[],
        subjects: string[],
        tags: ITag[],
    }[],
    rooms: {
        uuid: string,
        number: string,
        tags: string[],
        slots: {
            blocked: boolean,
            examUuid: string | null,
            uuid: string,
        }[],
    }[],
    timetable: {
        start: string,
        duration: string,
        isBreak: boolean,
    }[],
}

function save() {
    let saveData: SaveData = {
        remainingExams: data.remainingExams.map(v => ({
            duration: v.duration.toJSON(),
            uuid: v.uuid,
            id: v.id,
            examinerUuids: v.examiners.map(v => v.name.uuid),
            examineeUuids: v.examinees.map(v => v.name.uuid),
            subjects: v.subjects,
            tags: v.tags,
        })),
        rooms: data.rooms.map(v => ({
            uuid: v.uuid,
            number: v.number,
            tags: v.tags,
            slots: v.slots.map(v => ({
                blocked: v.blocked,
                examUuid: v.exam?.uuid || null,
                uuid: v.uuid,
            })),
        })),
        timetable: data.timetable.lessons.map(v => ({
            start: v.start.toJSON(),
            duration: v.duration.toJSON(),
            isBreak: v.isBreak,
        })),
    };

    return JSON.stringify(saveData);
}

function load(loadData: string) {
    let raw: SaveData = JSON.parse(loadData);


    // data = {
    //     remainingExams: raw.remainingExams.map(v => ({
    //         duration: moment.duration(v.duration),
    //         uuid: v.uuid,
    //         id: v.id,
    //         examiners: v.examinerUuids.map(v => raw.)
    //     }))
    // };
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