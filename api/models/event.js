export class Event {
    id = 0;
    name = '';
    description = '';
    location = '';
    event_dt = '';
    interest_ids = [];
    interest_names = [];

    constructor(event_id, event_name, event_desc, event_loc, event_date, interest_ids, interest_names) {
        this.id = event_id;
        this.name = event_name;
        this.description = event_desc;
        this.location = event_loc;
        this.event_dt = event_date;
        this.interest_ids = interest_ids;
        this.interest_names = interest_names;
    }
}