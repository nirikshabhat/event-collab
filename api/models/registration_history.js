export class RegistrationHistory {
    student_name = "";
    usn = "";
    event_name = "";
    registration_status = "";
    college_name = "";
    department_name = "";
    updated_dt = null;

    constructor(name, usn, event_name, registration_status, college_name, department_name, updated_dt) {
        this.student_name = name;
        this.usn = usn;
        this.event_name = event_name;
        this.registration_status = registration_status;
        this.college_name = college_name;
        this.department_name = department_name;
        this.updated_dt = updated_dt;
    }

    reset() {
        this.student_name = "";
        this.usn = "";
        this.event_name = "";
        this.registration_status = "";
        this.college_name = "";
        this.department_name = "";
        this.updated_dt = null;
    }

}