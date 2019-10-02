import { Event, User } from '../dto'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    events: Array<Event> = new Array<Event>();

    constructor(private httpClient: HttpClient) { }

    login(user: User) {
        return this.httpClient.post('http://localhost:3000/auth/login', user);
    }

    setCurrentUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    getCurrentUser(): User {
        if (localStorage.getItem('currentUser') == null)
            return new User(0, '', '', '', 0, '', 0, '');
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    getCurrentOrganizer(): User {
        if (localStorage.getItem('currentOrganizer') == null)
            return new User(0, '', '', '', 0, '', 0, '');
        return JSON.parse(localStorage.getItem('currentOrganizer'));
    }

    setCurrentOrganizer(user: User) {
        localStorage.setItem('currentOrganizer', JSON.stringify(user));
    }

    removeCurrentOrganizer() {
        localStorage.removeItem('currentOrganizer');
    }


}