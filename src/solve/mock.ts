import moment from "moment";
import type { IExam, IRoom, IRoomSlot, IStudent, ITeacher, ITimeTable } from "./data";

function uuid() {
    return crypto.randomUUID();    
}

function slots() {
    return new Array(7).fill(0).map((v, i) => (<IRoomSlot>{
        blocked: false,
        uuid: uuid(),
    }));
}

const students: IStudent[] = [
    {
        name: {
            uuid: uuid(),
            name: "last",
            firstName: "first",
        }
    },
    {
        name: {
            uuid: uuid(),
            name: "test",
            firstName: "asdf",
        }
    },
    {
        name: {
            uuid: uuid(),
            name: "last",
            firstName: "first",
        }
    },
    {
        name: {
            uuid: uuid(),
            name: "david",
            firstName: "harwardt",
        }
    },
];

const teachers: ITeacher[] = [
    {
        subjects: ["informatik"],
        name: {
            uuid: uuid(),
            name: "testL",
            firstName: "asdfL",
        }
    },
    {
        subjects: ["deutsch"],
        name: {
            uuid: uuid(),
            name: "deutschL",
            firstName: "asdfL",
        }
    },
    {
        subjects: ["mathe"],
        name: {
            uuid: uuid(),
            name: "matheL",
            firstName: "teacher",
        }
    },
];

const rooms: IRoom[] = [
    {
        uuid: uuid(),
        number: "101",
        tags: ["informatik", "smartboard", "3d-drucker"],
        slots: slots(), 
    },
    {
        uuid: uuid(),
        number: "104",
        tags: ["informatik", "smartboard"],
        slots: slots(), 
    },
    {
        uuid: uuid(),
        number: "260",
        tags: ["oberstufe", "smartboard", "klassenraum"],
        slots: slots(), 
    },
    {
        uuid: uuid(),
        number: "258",
        tags: ["oberstufe", "smartboard", "klassenraum"],
        slots: slots(), 
    },
    {
        uuid: uuid(),
        number: "001",
        tags: ["musik", "smartboard", "klavier"],
        slots: slots(), 
    },
    {
        uuid: uuid(),
        number: "258",
        tags: ["oberstufe", "smartboard", "klassenraum"],
        slots: slots(), 
    },
];

rooms.forEach(v => v.slots.forEach(s => s.room = v));

const exams: IExam[] = [
    {
        duration: moment.duration(30, "minutes"),
        uuid: uuid(),
        id: "informatik_1",
        examiners: [teachers[1]],
        examinees: [students[0]],

        subjects: ["informatik"],
        tags: [{ name: "smartboard", required: true }, { name: "informatik", required: false }],
    },
    {
        duration: moment.duration(30, "minutes"),
        uuid: uuid(),
        id: "informatik_2",
        examiners: [teachers[0]],
        examinees: [students[2], students[3]],

        subjects: ["informatik"],
        tags: [{ name: "smartboard", required: true }, { name: "3d-drucker", required: true }, { name: "informatik", required: false }],
    },
    {
        duration: moment.duration(1, "hours"),
        uuid: uuid(),
        id: "deutsch_1",
        examiners: [teachers[1]],
        examinees: [students[0]],

        subjects: ["deutsch"],
        tags: [{ name: "smartboard", required: true }, { name: "klassenraum", required: false }],
    },
    {
        duration: moment.duration(20, "minutes"),
        uuid: uuid(),
        id: "musik_1",
        examiners: [teachers[1]],
        examinees: [students[0]],

        subjects: ["musik"],
        tags: [{ name: "smartboard", required: true }, { name: "klassenraum", required: false }, { name: "klavier", required: true }],
    },
];

const lessonDuration = moment.duration(45, "minutes");
const timetable = <ITimeTable>{
    breaks: [2, 4],
    lessons: [
        { start: moment({ hour: 8, minute: 0, second: 0, millisecond: 0 }), duration: lessonDuration },
        { start: moment({ hour: 8, minute: 50, second: 0, millisecond: 0 }), duration: lessonDuration },
        { start: moment({ hour: 9, minute: 40, second: 0, millisecond: 0 }), duration: lessonDuration },
        { start: moment({ hour: 10, minute: 40, second: 0, millisecond: 0 }), duration: lessonDuration },
        { start: moment({ hour: 11, minute: 30, second: 0, millisecond: 0 }), duration: lessonDuration },
        { start: moment({ hour: 12, minute: 15, second: 0, millisecond: 0 }), duration: lessonDuration, isBreak: true },
        { start: moment({ hour: 13, minute: 5, second: 0, millisecond: 0 }), duration: lessonDuration },
    ]
}

export {
    exams,
    rooms,

    timetable,
}