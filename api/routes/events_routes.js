import express from 'express'
import passport from 'passport'
import { EventController } from '../controllers/events_controller';

var router = express.Router();
var event_controller = new EventController();

router.get('/', async (req, res, next) => {
    return await event_controller.get_events(req, res);
});

router.post('/', async (req, res, next) => {
    return await event_controller.add_event(req, res);
});

router.delete('/:eventId', async (req, res, next) => {
    return await event_controller.delete_event(req, res);
});

router.get('/interests', async (req, res, next) => {
    return await event_controller.get_interests(req, res);
});

module.exports = router;