import { User } from '../models/user'
import { College } from '../models/college'
import { Department } from '../models/department'
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
        pool.releaseConnection();
        return user;
    }

    async get_colleges(user) {
        let colleges = [];
        let pool = db.getConnection();
        let ev_query = `select id,name from colleges order by name`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                colleges.push(new College(row.id, row.name))
        });
        pool.releaseConnection();
        return colleges;
    }

    async get_departments(user) {
        let departments = [];
        let pool = db.getConnection();
        let ev_query = `select id,name from departments order by name`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                departments.push(new Department(row.id, row.name))
        });
        pool.releaseConnection();
        return departments;
    }

    async add_user(newUser, user) {
        let currentUser = JSON.parse(user);
        if (newUser == null)
            return false;
        let pool = db.getConnection();
        let addQuery = `call add_user ('${newUser.name}','${newUser.username}', '${newUser.password}', '${newUser.usn}', ${newUser.college_id},${newUser.department_id},@return_code)`;
        var result = await pool.query(addQuery)
        pool.releaseConnection();
        return result[0][0]['@return_code'];
    }

}