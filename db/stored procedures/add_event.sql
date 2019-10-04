--call add_event (organizer_id,'event_name', 'event_name','event_location',event_date,'1,2',@event_id)

DELIMITER //

CREATE PROCEDURE add_event(
   org_id int,
   event_name nvarchar(256),
   event_description varchar(1000),
   event_location varchar(1000),
   event_date datetime,
   interest_ids text,
   OUT event_id int
)
BEGIN	

	DECLARE _next text; 
	DECLARE _nextlen INT DEFAULT NULL;
	DECLARE _value TEXT DEFAULT NULL;
  
  INSERT INTO EVENTS (name,description,location,event_date) VALUES (event_name,event_description,event_location,event_date);
  SET @event_id= ( SELECT LAST_INSERT_ID() );

  INSERT INTO ORGANIZER_EVENT_MAP (organizer_id,event_id) values (org_id,@event_id);

iterator:LOOP
  -- exit the loop if the list seems empty or was null;
  -- this extra caution is necessary to avoid an endless loop in the proc.
  IF LENGTH(TRIM(interest_ids)) = 0 OR interest_ids IS NULL THEN
    LEAVE iterator;
  END IF;

  SET _next = SUBSTRING_INDEX(interest_ids,',',1);

  SET _nextlen = LENGTH(_next);

  SET _value = TRIM(_next);

  INSERT INTO event_interest_map (event_id,interest_id) VALUES (@event_id,CAST(_value AS unsigned));

  SET interest_ids = INSERT(interest_ids,1,_nextlen + 1,'');
  
END LOOP;

	SELECT @event_id;

END

// DELIMITER ;