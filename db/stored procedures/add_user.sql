--call add_event ('name', 'username','password','usn',college_id,department_id,@return_code)

DELIMITER //

CREATE PROCEDURE add_user(
   name nvarchar(256),
   username varchar(1000),
   password varchar(1000),
   usn varchar(1000),
   college_id int,
   department_id int,
   OUT return_code int
)
BEGIN	
  
  set @duplicate_usn_id=(SELECT IF( EXISTS(
             SELECT *
             FROM students s
             WHERE s.USN=usn), 1, 0) );

    set @duplicate_email_id=(SELECT IF( EXISTS(
             SELECT *
             FROM students s
             WHERE s.username=username), 1, 0) );

  IF(@duplicate_usn_id=1)
  THEN
  SET @return_code=-1;
  END IF;
  IF(@duplicate_email_id=1)
  THEN
  SET @return_code=-2;
  END IF;
  IF(@duplicate_usn_id<>1 AND @duplicate_email_id<>1)
  THEN
  INSERT INTO students (name,password,username,usn,college_id,department_id) VALUES (name,sha2(password,256),username,usn,college_id,department_id);
  SET @return_code= ( SELECT LAST_INSERT_ID() );
  END IF;
  SELECT @return_code;

END

// DELIMITER ;