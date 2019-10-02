create table college (
						id int auto_increment,
                        name varchar(1000) not null,
                        address varchar(1000) not null,
                        description varchar(10000) not null,
                        primary key (id)
					)
					
					
create table departments (
						id int auto_increment,
                        name varchar(1000) not null,
                        description varchar(10000) not null,
                        primary key (id)
					)
					
create table students (
						id int auto_increment,
                        name varchar(1000) not null,
						password varchar(1000)  not null,
                        username varchar(512) not null,
                        usn varchar(256) not null,
                        college_id int not null,
                        department_id int not null,
                        primary key (id),
                        foreign key (college_id) references colleges(id),
                        foreign key (department_id) references departments(id)
					)
					
create table student_event_map (id int auto_increment,
						student_id int not null,
                        event_id int not null,
                        foreign key(student_id) references students(id),
                        foreign key (event_id) references events(id),
                        primary key (id)
                        )
						
create table organizer_event_map (id int auto_increment,
						organizer_id int not null,
                        event_id int not null,
                        foreign key(organizer_id) references students(id),
                        foreign key (event_id) references events(id),
                        primary key (id)
                        )