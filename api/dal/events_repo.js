import { Event } from '../models/event'
import { Interest } from '../models/interest'
import * as db from "../dal/mysql_db";

export class EventsRepository {

    async get_events() {
        let events = [];
        let pool = db.getConnection();
        let ev_query = `select ev.id,ev.name,ev.description,ev.location,ev.event_date,GROUP_CONCAT(intr.id) as interest_ids,GROUP_CONCAT(intr.name) as interest_names from events as ev
        inner join event_interest_map as eim
        on ev.id=eim.event_id
        inner join interests as intr
        on intr.id=eim.interest_id
        group by ev.id`;
        var rows = await pool.query(ev_query);
        rows.forEach(row => {
            if (row.id > 0)
                events.push(new Event(row.id, row.name, row.description, row.location, row.event_date, row.interest_ids,row.interest_names))
        });
        return events;
    }

    async add_event(event) {
        if (event == null)
            return false;
        let pool = db.getConnection();
        let dateVal = new Date(Date.parse(event.event_dt));
        dateVal = dateVal.getFullYear() + "-" + dateVal.getMonth() + "-" + dateVal.getDate();
        let addQuery = `call add_event ('${event.name}', '${event.description}', '${event.location}', '${dateVal}','${event.interest_ids}',@event_id)`;
        var result = await pool.query(addQuery)
        return true;
    }

    async delete_event(eventId) {
        let deleteQuery = `DELETE FROM EVENTS WHERE id=${eventId}`;
        let pool = db.getConnection();
        var result = await pool.query(deleteQuery);
        if (result.affectedRows == 1)
            return true;
        else
            return false;
    }

    async get_interests() {
        let interests = [];
        let pool = db.getConnection();
        var rows = await pool.query('SELECT * FROM interests');
        rows.forEach(row => {
            interests.push(new Interest(row.id, row.name));
        });
        return interests;
    }

}