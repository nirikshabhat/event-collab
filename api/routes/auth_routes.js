import express from 'express'
import { AuthController } from '../controllers/auth_controller';

var router = express.Router();
var auth_controller = new AuthController();

router.post('/login', async (req, res, next) => {
    return await auth_controller.login(req, res);
});

router.post('/register', async (req, res, next) => {
    return await auth_controller.add_user(req, res);
});

router.get('/colleges', async (req, res, next) => {
    return await auth_controller.get_colleges(req, res);
});

router.get('/departments', async (req, res, next) => {
    return await auth_controller.get_deparments(req, res);
});

module.exports = router;