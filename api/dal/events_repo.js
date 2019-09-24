import { Event } from '../models/event'
import * as db from "../dal/mysql_db";

export class EventsRepository {

    async get_events() {
        let events = [];
        let pool = db.getConnection();
        var rows = await pool.query('SELECT * FROM events');
        rows.forEach(row => {
            events.push(new Event(row.id, row.name, row.description, row.location, row.event_date))
        });
        return events;
    }

    async add_event(event) {
        if (event == null)
            return false;
        let pool = db.getConnection();
        let dateVal = new Date(Date.parse(event.event_dt));
        dateVal = dateVal.getFullYear() + "-" + dateVal.getMonth() + "-" + dateVal.getDate();
        let addQuery = `INSERT INTO EVENTS (name,description,location,event_date) VALUES ('${event.name}', '${event.description}', '${event.location}', '${dateVal}')`;
        var result = await pool.query(addQuery)
        if (result.affectedRows == 1)
            return true;
        else
            return false;
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

}