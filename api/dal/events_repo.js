import { Event } from '../models/event'
import { EventView } from '../models/event-view'
import { Interest } from '../models/interest'
import * as db from "../dal/mysql_db";
import { RegistrationHistory } from '../models/registration_history';

export class EventsRepository {

    async get_events_view(user) {
        let currentUser = JSON.parse(user);
        let events = [];
        let pool = db.getConnection();
        let ev_query = `select ev.id as event_id,ev.name,count( se.event_id) as student_count,GROUP_CONCAT(s.name) as student_names  from events ev
        inner join student_event_map se
        on se.event_id=ev.id
        inner join organizer_event_map oe
        on oe.event_id=ev.id
        inner join students s
        on s.id=se.student_id
        where oe.organizer_id=${currentUser.id}
        group by se.event_id`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.event_id > 0)
                events.push(new EventView(row.event_id, row.name, row.student_count, row.student_names))
        });
        pool.releaseConnection();
        return events;
    }

    async get_organized_events(user) {
        let currentUser = JSON.parse(user);
        let events = [];
        let pool = db.getConnection();
        let ev_query = `select ev.id,ev.name,ev.description,ev.location,ev.event_date,GROUP_CONCAT(intr.id) as interest_ids,GROUP_CONCAT(intr.name) as interest_names,GROUP_CONCAT(s.name) as students from 
        organizer_event_map oe 
        left join events as ev
        on oe.event_id=ev.id
        left join event_interest_map as eim
        on ev.id=eim.event_id
        left join interests as intr
        on intr.id=eim.interest_id
        left join student_event_map se
        on se.event_id=ev.id
        left join students s
        on s.id=se.student_id
        where oe.organizer_id=${currentUser.id}
        group by ev.id`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                events.push(new Event(row.id, row.name, row.description, row.location, row.event_date, row.interest_ids, row.interest_names, "", row.students))
        });
        pool.releaseConnection();
        return events;
    }

    async get_registration_history(user) {
        let currentUser = JSON.parse(user);
        let history = [];
        let pool = db.getConnection();
        let rg_query = `select rh.id, s.name as student_name ,rh.registration_status,e.name as event_name,rh.updated_dt,c.name as college_name,d.name as department_name,s.usn from organizer_event_map oem
        left join registration_history rh
        on oem.event_id = rh.event_id
        inner join students s
        on s.id=rh.student_id
        inner join colleges c
        on c.id=s.college_id
        inner join departments d
        on d.id=s.department_id
        inner join events e
        on e.id=rh.event_id
        where oem.organizer_id=${currentUser.id}
        order by rh.updated_dt desc`;
        console.log
        var rows = await pool.query(rg_query);

        rows.forEach(row => {
            if (row.id > 0)
                history.push(new RegistrationHistory(row.student_name, row.usn, row.event_name, row.registration_status, row.college_name, row.department_name, row.updated_dt))
        });
        pool.releaseConnection();
        return history;
    }

    async get_enrolled_events(user) {
        let currentUser = JSON.parse(user);
        let events = [];
        let pool = db.getConnection();
        let ev_query = `select ev.id,ev.name,ev.description,ev.location,ev.event_date,GROUP_CONCAT(intr.id) as interest_ids,GROUP_CONCAT(intr.name) as interest_names,GROUP_CONCAT(distinct(s.name)) as organizers  from events as ev
        inner join event_interest_map as eim
        on ev.id=eim.event_id
        inner join interests as intr
        on intr.id=eim.interest_id
        inner join student_event_map se
        on se.event_id=ev.id
        inner join organizer_event_map oe
        on ev.id=oe.event_id
        inner join students s
        on s.id=oe.organizer_id
        where se.student_id=${currentUser.id}
        group by ev.id`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                events.push(new Event(row.id, row.name, row.description, row.location, row.event_date, row.interest_ids, row.interest_names, row.organizers))
        });
        pool.releaseConnection();
        return events;
    }

    async get_upcoming_events(user) {
        let currentUser = JSON.parse(user);
        let events = [];
        let pool = db.getConnection();
        let ev_query = `select ev.id,ev.name,ev.description,ev.location,ev.event_date,GROUP_CONCAT(intr.id) as interest_ids,GROUP_CONCAT(intr.name) as interest_names,GROUP_CONCAT(distinct(s.name)) as organizers from events as ev
        inner join event_interest_map as eim
        on ev.id=eim.event_id
        inner join interests as intr
        on intr.id=eim.interest_id
        inner join organizer_event_map oe
        on ev.id=oe.event_id
        inner join students s
        on s.id=oe.organizer_id
        where ev.id not in (select event_id from student_event_map where student_id=${currentUser.id})
        group by ev.id`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                events.push(new Event(row.id, row.name, row.description, row.location, row.event_date, row.interest_ids, row.interest_names, row.organizers))
        });
        pool.releaseConnection();
        return events;
    }


    async add_event(event, user) {
        let currentUser = JSON.parse(user);
        if (event == null)
            return false;
        let pool = db.getConnection();
        console.log(event.event_dt);
        let dateVal = new Date(Date.parse(event.event_dt));
        dateVal = dateVal.getFullYear() + "-" + (dateVal.getMonth() + 1) + "-" + dateVal.getDate();
        console.log(dateVal);
        let addQuery = `call add_event (${currentUser.id},'${event.name}', '${event.description}', '${event.location}', '${dateVal}','${event.interest_ids}',@event_id)`;
        var result = await pool.query(addQuery)
        pool.releaseConnection();
        return true;
    }

    async join_event(event, user) {
        let currentUser = JSON.parse(user);
        if (event == null)
            return false;
        let pool = db.getConnection();
        let addQuery = `call join_event (${currentUser.id},${event.id})`;
        var result = await pool.query(addQuery)
        pool.releaseConnection();
        return true;
    }

    async leave_event(event, user) {
        let currentUser = JSON.parse(user);
        if (event == null)
            return false;
        let pool = db.getConnection();
        let addQuery = `call leave_event (${currentUser.id},${event.id})`;
        var result = await pool.query(addQuery)
        pool.releaseConnection();
        return true;
    }

    async delete_event(eventId, user) {
        console.log("leave");
        let deleteQuery = `call delete_event (${eventId})`;
        let pool = db.getConnection();
        var result = await pool.query(deleteQuery);
        pool.releaseConnection();
        return true;
    }

    async get_interests(user) {
        let interests = [];
        let pool = db.getConnection();
        var rows = await pool.query('SELECT * FROM interests');
        rows.forEach(row => {
            interests.push(new Interest(row.id, row.name));
        });
        pool.releaseConnection();
        return interests;
    }

}