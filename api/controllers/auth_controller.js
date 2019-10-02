import { AuthService } from '../services/auth_service'

export class AuthController {

    constructor() { }

    async login(req, res) {
        let auth_service = new AuthService();
        let result = await auth_service.login(req.body);
        return res.json(result);
    }
}

