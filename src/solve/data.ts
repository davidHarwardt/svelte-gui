import type moment from "moment";

interface ITag {
    name: string,
    required: boolean,
}

interface IExam {
    duration: moment.Duration,
    uuid: string,
    id: string,
    examiners: ITeacher[],
    examinees: IStudent[],

    subjects: string[],
    tags: ITag[],
}

interface IRoomSlot {
    exam?: IExam,
    blocked: boolean,
}

interface IRoom {
    uuid: string,
    number: string,
    tags: string[],
    slots: IRoomSlot[],
}

interface IName {
    uuid: string,
    name: string,
    firstName: string,
    title?: string,
}

interface IStudent {
    name: IName,
}

interface ITeacher {
    name: IName,
    subjects: string[],
}

interface ITimeTable {
    breaks: number[],
    lessons: ILesson[], 
}

interface ILesson {
    start: moment.Moment,
    duration: moment.Duration,
}

export type {
    ITag,
    IExam,
    IRoom,
    IRoomSlot,
    IName,
    IStudent,
    ITeacher,
    ITimeTable,
    ILesson,
}