import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Event, Interest, User, EventsView, RegistrationHistory, College, Department } from '../dto'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventsService, AuthService } from '../services/index';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../events/add-event/add-event.component'
import { Router, ActivatedRoute } from '@angular/router';
import { OpenEventComponent } from '../events/open-event/open-event.component'
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms'
import { MatTabChangeEvent } from '@angular/material';
import { DatePipe } from '@angular/common'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
    providers: [DatePipe],
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit {

    events: Array<Event> = new Array<Event>();
    eventsView: Array<EventsView> = new Array<EventsView>();
    history: Array<RegistrationHistory> = new Array<RegistrationHistory>();
    newUser: User = new User(0, '', '', '', 0, '', 0, '');
    displayedColumns: Array<string> = ['id', 'name', 'description', 'interests', 'location', 'event_dt', 'actions'];
    displayedHistoryColumns: Array<string> = ['student_name', 'event_name', 'usn', 'status', 'college', 'updated_dt', 'department'];
    colleges: Array<College> = new Array<College>();
    departments: Array<Department> = new Array<Department>();
    eventsList: any = [];
    historyList: any = [];

    registerform: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        username: new FormControl('', [Validators.required]),
        usn: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        college_id: new FormControl(''),
        department_id: new FormControl(''),
    });

    _initialFormValue = this.registerform.valid;

    @ViewChild('formDirective', { static: true }) private formDirective: NgForm;

    event: Event = new Event(0, "", "", "", new Date(), [], [], "");
    interests: Array<Interest> = new Array<Interest>();
    user: User = new User(0, '', '', '', 0, '', 0, '');

    public pieChartLabels: string[] = [];
    public pieChartData: number[] = [];
    public pieChartType: string = 'pie';
    public pieChartColors: Array<any> = [{
        backgroundColor: ['#3366CC',
            '#DC3912',
            '#FF9900',
            '#109618',
            '#990099',
            '#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC'],
    }];

    constructor(private eventsService: EventsService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        public eventDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private datepipe: DatePipe
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    @ViewChild('eventsSort', { static: true }) eventsSort: MatSort;
    @ViewChild('historySort', { static: true }) historySort: MatSort;
    @ViewChild('eventsPginator', { static: true }) eventsPginator: MatPaginator;
    @ViewChild('historyPaginator', { static: true }) historyPaginator: MatPaginator;

    ngOnInit() {


        this.user = this.authService.getCurrentOrganizer();
        this.eventsList = new MatTableDataSource<Event>([]);
        this.historyList = new MatTableDataSource<RegistrationHistory>([]);

        if (this.user == null || this.user.id <= 0)
            this.router.navigate(['admin']);

        this.eventsService.get_organized_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, event.interest_ids, event.interest_names, event.organizers, event.students));
            });
            this.eventsList = new MatTableDataSource<Event>(this.events);
            this.eventsList.sort = this.eventsSort;
            this.eventsList.paginator = this.eventsPginator;

            this.route.queryParams.subscribe(params => {
                let message = params['message'];
                if (message)
                    this.displayInfo(message, "Success")
            });

            this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });

        });

        this.eventsService.get_organized_events_registration_history().subscribe((data: Array<RegistrationHistory>) => {
            data.forEach((row) => {
                this.history.push(new RegistrationHistory(row.student_name, row.usn, row.event_name, row.registration_status, row.college_name, row.department_name, row.updated_dt));
            });
            this.historyList = new MatTableDataSource<RegistrationHistory>(this.history);
            this.historyList.sort = this.historySort;
            this.historyList.paginator = this.historyPaginator;

        });

        this.eventsService.get_organized_events_view().subscribe((data: Array<EventsView>) => {
            data.forEach((event) => {
                this.eventsView.push(new EventsView(event.event_id, event.name, event.student_count, event.student_names));
            });
            this.pieChartLabels = this.eventsView.map(e => e.name);
            this.pieChartData = this.eventsView.map(e => e.student_count);
        });;

        this.eventsService.get_interests().subscribe((data: Array<Interest>) => {
            data.forEach((interest) => {
                this.interests.push(new Interest(interest.id, interest.name));
            });
        });

        this.authService.get_colleges().subscribe((data: Array<College>) => {
            data.forEach((college) => {
                this.colleges.push(new College(college.id, college.name));
            });
            this.newUser.college_id = this.colleges[0].id;
        });

        this.authService.get_departments().subscribe((data: Array<Department>) => {
            data.forEach((department) => {
                this.departments.push(new Department(department.id, department.name));
            });
            this.newUser.department_id = this.departments[0].id;
        });
    }

    getUsers() {
        this.events = [];
        this.eventsList = [];
        this.eventsService.get_organized_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, [], [], event.organizers, event.students));
            });
            this.eventsList = new MatTableDataSource<Event>(this.events);
            this.eventsList.sort = this.eventsSort;
            this.eventsList.paginator = this.eventsPginator;
        });;
    }

    applyFilter(filterValue: string) {
        this.eventsList.filter = filterValue.trim().toLowerCase();
    }

    applyHistoryFilter(filterValue: string) {
        this.historyList.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit() {
        this.eventsList.paginator = this.eventsPginator;
        this.historyList.paginator = this.historyPaginator;
    }

    deleteEvent(ev) {
        this.eventsService.delete_event(ev.id).subscribe((result: boolean) => {
            if (result) {
                let successmessage = "Event - " + ev.name + " was deleted";
                this.event.reset();
                this.router.navigate(['events'], { queryParams: { message: successmessage }, preserveQueryParams: false });
            }
            else {
                this.displayInfo("Failure deleting event", "Failure")
            }
        });;
    }

    displayInfo(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    reloadUsers() {
        this.eventsList = new MatTableDataSource<Event>(this.events);
        this.eventsList.sort = this.eventsSort;
        this.eventsList.paginator = this.eventsPginator;
    }

    addEvent() {
        const dialogRef = this.eventDialog.open(AddEventComponent, {
            data: { event: this.event, interests: this.interests }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.isCancelled) {
                this.event = result.event;
                console.log(this.event);
                this.eventsService.add_event(this.event).subscribe((result: boolean) => {
                    if (result) {
                        let successmessage = "Event - " + this.event.name + " added successfully";
                        this.event.reset();
                        this.router.navigate(['events'], { queryParams: { message: successmessage }, preserveQueryParams: false });
                    }
                    else {
                        this.displayInfo("Failure adding event", "Failure")
                    }
                });;
            } else {
                this.event.reset();
            }
        });
    }

    logout() {
        this.authService.removeCurrentOrganizer();
        this.router.navigate(['admin']);
    }

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    openEvent(ev) {
        const dialogRef = this.eventDialog.open(OpenEventComponent, {
            data: { event: ev, interests: this.interests }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.isCancelled) {
                this.event = result.event;
            } else {
                this.event.reset();
            }
        });
    }

    register() {
        console.log(this.newUser);
        this.authService.register(this.newUser).subscribe((returncode) => {
            if (returncode > 0) {
                this.newUser.reset();
                this.formDirective.reset();
                this.newUser.department_id = this.departments[0].id;
                this.newUser.college_id = this.colleges[0].id;
                this.displayInfo("User Registered successfully", "Success");
            }
            else if (returncode == -1) {
                this.displayInfo("A student with USN " + this.newUser.usn + " is already present", "Failure");
            }
            else if (returncode == -2) {
                this.displayInfo("A student with email address " + this.newUser.username + " is already present", "Failure");
            }
            else {
                this.displayInfo("An error occured!!", "Failure");
            }
        });;
    }

    onEventtabChange(event: MatTabChangeEvent) {
        this.newUser.reset();
        this.newUser.department_id = this.departments[0].id;
        this.newUser.college_id = this.colleges[0].id;
        this.formDirective.reset();
    }

    downloadUpcomingEvents() {
        if (this.events.length <= 0) {
            this.displayInfo("No Upcoming Events", "Failure");
        }
        else {
            let doc = new jsPDF();

            let curDate = new Date();
            let curDateStr = this.datepipe.transform(curDate, 'MMM d, y');
            let userName = this.eventsService.get_current_organizer_name();

            var data = [];
            this.events.forEach((event) => {
                var eventData = [];
                eventData.push(event.name);
                eventData.push(event.description);
                eventData.push(event.interest_names);
                eventData.push(event.location);
                eventData.push(this.datepipe.transform(event.event_dt, 'MMM d, y'));
                data.push(eventData);
            });

            doc.autoTable({
                head: [['Event Name', 'Event Description', 'Interests', 'Event Location', 'Event Date']],
                body: data,
                didDrawPage: data => {
                    doc.setFontSize(15);
                    doc.setFont("times");
                    doc.setFontType("italic");
                    doc.setTextColor(255, 87, 51);
                    doc.setFontStyle('normal');

                    var text = "Events Organized by " + userName + " as of " + curDateStr;
                    doc.text(text, 30, 22);

                    // Footer
                    var str = "Page " + doc.internal.getNumberOfPages()

                    doc.setFontSize(10);

                    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);
                },
                margin: { top: 30 }
            });
            var fileName = userName + " Upcoming" + ".pdf";
            doc.save(fileName);
        }
    }

    downloadRegistrationHistory() {
        if (this.history.length <= 0) {
            this.displayInfo("No Registration History", "Failure");
        }
        else {
            let doc = new jsPDF();

            let curDate = new Date();
            let curDateStr = this.datepipe.transform(curDate, 'MMM d, y');
            let userName = this.eventsService.get_current_organizer_name();

            var data = [];
            this.history.forEach((event) => {
                var eventData = [];
                eventData.push(event.student_name);
                eventData.push(event.event_name);
                eventData.push(event.usn);
                eventData.push(event.registration_status);
                eventData.push(event.college_name);
                eventData.push(event.department_name);
                eventData.push(this.datepipe.transform(event.updated_dt, 'MMM d, y'));
                data.push(eventData);
            });

            doc.autoTable({
                head: [['Student Name', 'Event Name', 'USN', 'Status', 'College', 'Department', 'Updated At']],
                body: data,
                didDrawPage: data => {
                    doc.setFontSize(15);
                    doc.setFont("times");
                    doc.setFontType("italic");
                    doc.setTextColor(255, 87, 51);
                    doc.setFontStyle('normal');

                    var text = "Registration History for Events Organized by " + userName + " as of " + curDateStr;
                    doc.text(text, 20, 22);

                    // Footer
                    var str = "Page " + doc.internal.getNumberOfPages()

                    doc.setFontSize(10);

                    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);
                },
                margin: { top: 30 }
            });
            var fileName = userName + " Upcoming" + ".pdf";
            doc.save(fileName);
        }
    }
}