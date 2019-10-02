export class User {
    id = 0;
    name = "";
    usn = "";
    username = "";
    password = "";
    college_id = 0;
    college_name = "";
    department_id = 0;
    department_name = "";

    constructor(userId, fullname, userUsn, uName, cid, cname, did, dname) {
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