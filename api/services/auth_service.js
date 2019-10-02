import { AuthRepository } from '../dal/auth_repo'
export class AuthService {

    constructor() {

    }

    async login(user) {
        let auth_repo = new AuthRepository();
        return await auth_repo.login(user);
    }
}
