import { User } from '../models/user'
import * as db from "../dal/mysql_db";

export class AuthRepository {

    async login(user) {
        if (user == null)
            return new User();
        let pool = db.getConnection();
        let loginQuery = `select s.id,s.name,s.username,s.usn,s.college_id,s.department_id,c.name as college_name,d.name as department_name,c.description as college_description,d.description as department_description
        from students  s
        join colleges c
        on c.id=s.college_id
        join departments d
        on d.id=s.department_id
        where s.username ='${user.username}' 
        AND (sha2('${user.password}',256) = s.password) limit 1`;
        var result = await pool.query(loginQuery);
        if (result.length == 1) {
            var user = result[0];
            user = new User(user.id, user.name, user.usn, user.username, user.college_id, user.college_name, user.department_id, user.department_name);
        }
        return user;
    }

}