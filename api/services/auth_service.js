import { AuthRepository } from '../dal/auth_repo'
export class AuthService {

    constructor() {

    }

    async login(user) {
        let auth_repo = new AuthRepository();
        return await auth_repo.login(user);
    }

    async add_user(newUser, user) {
        let auth_repo = new AuthRepository();
        return await auth_repo.add_user(newUser, user);
    }

    async get_colleges(user) {
        let colleges = [];
        let auth_repo = new AuthRepository();
        colleges = await auth_repo.get_colleges(user);
        return colleges;
    }

    async get_deparments(user) {
        let departments = [];
        let auth_repo = new AuthRepository();
        departments = await auth_repo.get_departments(user);
        return departments;
    }
}
