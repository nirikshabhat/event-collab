import { EventsService } from '../services/events_service'
import { Event } from '../models/event';

export class EventController {

    constructor() { }

    async get_events_view(req, res) {
        let user = req.header("current_organizer");
        let events_service = new EventsService();
        let events = await events_service.get_events_view(user);
        return res.json(events);
    }

    async get_enrolled_events(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let events = await events_service.get_enrolled_events(user);
        return res.json(events);
    }

    async get_organized_events(req, res) {
        let user = req.header("current_organizer");
        let events_service = new EventsService();
        let events = await events_service.get_organized_events(user);
        return res.json(events);
    }

    async get_upcoming_events(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let events = await events_service.get_upcoming_events(user);
        return res.json(events);
    }

    async add_event(req, res) {
        let user = req.header("current_organizer");
        let events_service = new EventsService();
        let result = await events_service.add_event(req.body, user);
        return res.json(result);
    }

    async join_event(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let result = await events_service.join_event(req.body, user);
        return res.json(result);
    }

    async leave_event(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let result = await events_service.leave_event(req.body, user);
        return res.json(result);
    }

    async delete_event(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let result = await events_service.delete_event(req.params.eventId, user);
        return res.json(result);
    }

    async get_interests(req, res) {
        let user = req.header("current_user");
        let events_service = new EventsService();
        let interests = await events_service.get_interests(user);
        return res.json(interests);
    }
}

