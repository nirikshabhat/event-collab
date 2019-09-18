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
}