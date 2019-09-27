import { EventsService } from '../services/events_service'
import { Event } from '../models/event';

export class EventController {

    constructor() { }

    async get_events(req, res) {
        let events_service = new EventsService();
        let events = await events_service.get_events();
        return res.json(events);
    }

    async add_event(req, res) {
        let events_service = new EventsService();
        let result = await events_service.add_event(req.body);
        return res.json(result);
    }

    async delete_event(req, res) {
        let events_service = new EventsService();
        let result = await events_service.delete_event(req.params.eventId);
        return res.json(result);
    }

    async get_interests(req, res) {
        let events_service = new EventsService();
        let interests = await events_service.get_interests();
        return res.json(interests);
    }
}

