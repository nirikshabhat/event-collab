export class EventsView {
    event_id: number = 0;
    name: string = "";
    student_count: number = 0;
    student_names: string;

    constructor(event_id: number, name: string, student_count: number, student_names: string) {
        this.event_id = event_id;
        this.name = name;
        this.student_count = student_count;
        this.student_names = student_names;
    }
}