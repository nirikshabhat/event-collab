import { AuthService } from '../services/auth_service'

export class AuthController {

    constructor() { }

    async login(req, res) {
        let auth_service = new AuthService();
        let result = await auth_service.login(req.body);
        return res.json(result);
    }

    async add_user(req, res) {
        let user = req.header("current_organizer");
        let auth_service = new AuthService();
        let result = await auth_service.add_user(req.body, user);
        return res.json(result);
    }

    async get_colleges(req, res) {
        let auth_service = new AuthService();
        let result = await auth_service.get_colleges(req.body);
        return res.json(result);
    }

    async get_deparments(req, res) {
        let auth_service = new AuthService();
        let result = await auth_service.get_deparments(req.body);
        return res.json(result);
    }
}

