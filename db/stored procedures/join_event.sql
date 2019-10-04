--call join_event (student_id,event_id)

DELIMITER //

CREATE PROCEDURE join_event(
   student_id int,
   event_id int
  
)
BEGIN	

  INSERT INTO STUDENT_EVENT_MAP (student_id,event_id) values (student_id,event_id);

END

// DELIMITER ;