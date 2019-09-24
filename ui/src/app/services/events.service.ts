import { Event } from '../dto'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    events: Array<Event> = new Array<Event>();

    constructor(private httpClient: HttpClient) { }

    get_events() {
        return this.httpClient.get('http://localhost:3000/events')
    }

    add_event(event: Event) {
        return this.httpClient.post('http://localhost:3000/events', event);
    }

    delete_event(eventId: number) {
        return this.httpClient.delete("http://localhost:3000/events/" + eventId);
    }
}