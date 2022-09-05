import type moment from "moment"

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

    }

    isBooked(time: moment.Moment) {
        // search for an event that has time in its range
        let found = this._events.find(v => v.start.isBefore(time) && v.start.clone().add(v.duration).isAfter(time));

        // return true if the time is already booked
        return !!found;
    }
}

interface CalendarEvent {
    start: moment.Moment,
    duration: moment.Duration,
    eventUUID: string,
}

export {
    Calendar,
}