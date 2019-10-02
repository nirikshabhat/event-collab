export class User {
    id: number;
    name: string;
    usn: string;
    username: string;
    password: string;
    college_id: number = 0;
    college_name: string = "";
    department_id: number = 0;
    department_name: string = "";

    constructor(userId: number, fullname: string, userUsn: string, uName: string, cid: number, cname: string, did: number, dname: string) {
        this.id = userId;
        this.name = fullname;
        this.username = uName;
        this.usn = userUsn;
        this.username = uName;
        this.college_id = cid;
        this.college_name = cname;
        this.department_id = did;
        this.department_name = dname;
    }

    reset() {
        this.id = 0;
        this.name = "";
        this.usn = "";
        this.username = "";
        this.password = "";
        this.college_id = 0;
        this.college_name = "";
        this.department_id = 0;
        this.department_name = "";
    }

}