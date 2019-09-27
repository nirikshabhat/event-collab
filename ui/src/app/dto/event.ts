export class Event {
    id: number;
    name: string;
    description: string;
    location: string;
    event_dt: Date;
    interest_ids: Array<number> = [];
    interest_names:Array<string> = [];


    constructor(eventId: number, eventName: string, eventDesc: string,
         eventLocation: string, eventDt: Date, interest_ids: Array<number>,interest_names : Array<string>) {
        this.id = eventId;
        this.name = eventName;
        this.description = eventDesc;
        this.location = eventLocation;
        this.event_dt = eventDt;
        this.interest_ids = interest_ids;
        this.interest_names= interest_names;
    }

    reset() {
        this.id = 0;
        this.name = "";
        this.description = "";
        this.location = "";
        this.event_dt = new Date();
        this.interest_ids = [];
        this.interest_names=[];
    }

}