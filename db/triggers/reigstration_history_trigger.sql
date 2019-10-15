DELIMITER //
 
CREATE TRIGGER after_student_event_map_insert
AFTER INSERT
ON student_event_map FOR EACH ROW
BEGIN
    INSERT INTO registration_history(student_id,event_id,registration_status,updated_dt) values 
    (NEW.student_id,NEW.event_id,'JOINED',current_timestamp);
END
 
// DELIMITER  ;


DELIMITER //

CREATE TRIGGER after_student_event_map_delete
AFTER DELETE 
on student_event_map FOR EACH ROW
BEGIN
INSERT INTO registration_history(student_id,event_id,registration_status,updated_dt) values 
    (OLD.student_id,OLD.event_id,'LEFT',current_timestamp);
END

// DELIMITER  ;