import express from 'express'
import { AuthController } from '../controllers/auth_controller';

var router = express.Router();
var auth_controller = new AuthController();

router.post('/login', async (req, res, next) => {
    return await auth_controller.login(req, res);
});

module.exports = router;