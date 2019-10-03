--call leave_event (student_id,event_id)

DELIMITER //

CREATE PROCEDURE leave_event(
   sid int,
   eid int
  
)
BEGIN	

  INSERT INTO STUDENT_EVENT_MAP (student_id,event_id) values (sid,eid);

END

// DELIMITER ;