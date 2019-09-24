<<<<<<< HEAD
export class Event {
    id: number;
    name: string;
    description: string;
    location: string;
    event_dt: Date;


    constructor(eventId: number, eventName: string, eventDesc: string, eventLocation: string, eventDt: Date) {
        this.id = eventId;
        this.name = eventName;
        this.description = eventDesc;
        this.location = eventLocation;
        this.event_dt = eventDt;
    }

    reset() {
        this.id = 0;
        this.name = "";
        this.description = "";
        this.location = "";
        this.event_dt = new Date();
    }

=======
export class Event{
    id:number;
    name:string;
    description:string;
    location:string;
    on: Date;

    
    constructor(eventId:number,eventName:string,eventDesc:string,eventLocation:string,eventDt:Date) {
        this.id=eventId;
        this.name=eventName;
        this.description=eventDesc;
        this.location=eventDesc;
        this.on=eventDt;
    }
>>>>>>> e3d2b03285d5024e3e98a267e12d0f3809f8bcf5
}