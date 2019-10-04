--call leave_event (student_id,event_id)

DELIMITER //

CREATE PROCEDURE leave_event(
   sid int,
   eid int
  
)
BEGIN	

  DELETE FROM STUDENT_EVENT_MAP where student_id=sid and event_id=eid;

END

// DELIMITER ;