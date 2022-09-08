import type moment from "moment";

class Calendar {
    private _events: CalendarEvent[];

    constructor() {
        this._events = [];
    }

    static load() {

    }

    save() {

    }

    book(event: CalendarEvent) {
        this._events.push(event);
    }

    remove(event: CalendarEvent) {
        this._events = this._events.filter(v => this.equals(v, event));
    }

    equals(a: CalendarEvent, b: CalendarEvent) {
        return a.duration.asMilliseconds() === b.duration.asMilliseconds() && a.start.isSame(b.start);
    }

    isBooked(time: moment.Moment) {
        // search for an event that has time in its range
        let found = this._events.find(v => time.isBetween(v.start, v.start.clone().add(v.duration)));

        // return true if the time is already booked
        return !!found;
    }

    isBookedRange(start: moment.Moment, duration: moment.Duration) {
        let found = this._events.find(v => start.isBetween(v.start, v.start.clone().add(v.duration)) || start.isSame(v.start) || start.clone().add(duration).isBetween(v.start, v.start.clone().add(v.duration)) || start.clone().add(duration).isSame(v.start.clone().add(v.duration)));

        return !!found;
    }
}

interface CalendarEvent {
    start: moment.Moment,
    duration: moment.Duration,
    eventUUID: string,
}

export type {
    CalendarEvent,
}

export {
    Calendar,
}