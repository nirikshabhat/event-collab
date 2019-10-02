export class EventView {
    event_id = 0;
    name = "";
    student_count = 0;
    student_names = "";

    constructor(event_id, name, student_count, student_names) {
        this.event_id = event_id;
        this.name = name;
        this.student_count = student_count;
        this.student_names = student_names;
    }
}