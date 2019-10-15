import { EventsRepository } from '../dal/events_repo'
export class EventsService {

    constructor() {

    }

    async get_events_view(user) {
        let events = [];
        let event_repo = new EventsRepository();
        events = await event_repo.get_events_view(user);
        return events;
    }

    async get_enrolled_events(user) {
        let events = [];
        let event_repo = new EventsRepository();
        events = await event_repo.get_enrolled_events(user);
        return events;
    }

    async get_organized_events(user) {
        let events = [];
        let event_repo = new EventsRepository();
        events = await event_repo.get_organized_events(user);
        return events;
    }

    async get_registration_history(user) {
        let history = [];
        let event_repo = new EventsRepository();
        history = await event_repo.get_registration_history(user);
        return history;
    }

    async get_upcoming_events(user) {
        let events = [];
        let event_repo = new EventsRepository();
        events = await event_repo.get_upcoming_events(user);
        return events;
    }

    async add_event(event, user) {
        let event_repo = new EventsRepository();
        return await event_repo.add_event(event, user);
    }

    async join_event(event, user) {
        let event_repo = new EventsRepository();
        return await event_repo.join_event(event, user);
    }

    async leave_event(event, user) {
        let event_repo = new EventsRepository();
        return await event_repo.leave_event(event, user);
    }

    async delete_event(eventId, user) {
        let event_repo = new EventsRepository();
        return await event_repo.delete_event(eventId, user);
    }

    async get_interests(user) {
        let interests = [];
        let event_repo = new EventsRepository();
        interests = await event_repo.get_interests(user);
        return interests;
    }
}
