import express from 'express'
import passport from 'passport'
import { EventController } from '../controllers/events_controller';

var router = express.Router();
var event_controller = new EventController();

router.get('/organized/chart', async (req, res, next) => {
    return await event_controller.get_events_view(req, res);
});

router.get('/organized', async (req, res, next) => {
    return await event_controller.get_organized_events(req, res);
});

router.get('/organized/history', async (req, res, next) => {
    return await event_controller.get_registration_history(req, res);
});

router.get('/enrolled', async (req, res, next) => {
    return await event_controller.get_enrolled_events(req, res);
});

router.get('/upcoming', async (req, res, next) => {
    return await event_controller.get_upcoming_events(req, res);
});

router.post('/', async (req, res, next) => {
    return await event_controller.add_event(req, res);
});

router.post('/join', async (req, res, next) => {
    return await event_controller.join_event(req, res);
});

router.post('/leave', async (req, res, next) => {
    return await event_controller.leave_event(req, res);
});

router.delete('/:eventId', async (req, res, next) => {
    return await event_controller.delete_event(req, res);
});

router.get('/interests', async (req, res, next) => {
    return await event_controller.get_interests(req, res);
});

module.exports = router;