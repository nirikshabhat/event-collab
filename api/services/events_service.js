import { EventsRepository } from '../dal/events_repo'
export class EventsService {

    constructor() {

    }

    async get_events() {
        let events = [];
        let event_repo = new EventsRepository();
        events = await event_repo.get_events();
        return events;
    }

    async add_event(event) {
        let event_repo = new EventsRepository();
        return await event_repo.add_event(event);
    }

    async delete_event(eventId) {
        let event_repo = new EventsRepository();
        return await event_repo.delete_event(eventId);
    }

}
