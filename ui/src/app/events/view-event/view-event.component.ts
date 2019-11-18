import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Event, Interest, User } from '../../dto'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventsService, AuthService } from '../../services/index';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { OpenEventComponent } from '../../events/open-event/open-event.component'
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
    providers: [DatePipe],
    templateUrl: 'view-event.component.html',
    styleUrls: ['view-event.component.css']
})
export class ViewEventComponent implements OnInit, AfterViewInit {

    enrolled_events: Array<Event> = new Array<Event>();
    upcoming_events: Array<Event> = new Array<Event>();
    displayedColumns: Array<string> = ['id', 'name', 'description', 'interests', 'location', 'event_dt', 'actions'];
    enrolledEventsList: any = [];
    upcomingEventsList: any = [];
    event: Event = new Event(0, "", "", "", new Date(), [], [], "");
    interests: Array<Interest> = new Array<Interest>();
    user: User = new User(0, '', '', '', 0, '', 0, '');

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

    @ViewChild('sortEnrolled', { static: true }) sortEnrolled: MatSort;
    @ViewChild('sortUpcoming', { static: true }) sortUpcoming: MatSort;
    @ViewChild('paginatorEnrolled', { static: true }) paginatorEnrolled: MatPaginator;
    @ViewChild('paginatorUpcoming', { static: true }) paginatorUpcoming: MatPaginator;



    ngOnInit() {


        this.user = this.authService.getCurrentUser();
        this.enrolledEventsList = new MatTableDataSource<Event>([]);
        if (this.user == null || this.user.id <= 0)
            this.router.navigate(['login']);
        else {
            this.eventsService.get_enrolled_events().subscribe((data: Array<Event>) => {
                data.forEach((event) => {
                    this.enrolled_events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, event.interest_ids, event.interest_names, event.organizers));
                });

                this.enrolledEventsList = new MatTableDataSource<Event>(this.enrolled_events);
                this.enrolledEventsList.sort = this.sortEnrolled;
                this.enrolledEventsList.paginator = this.paginatorEnrolled;

                this.route.queryParams.subscribe(params => {
                    let message = params['message'];
                    if (message)
                        this.displayInfo(message, "Success")
                });

                this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });

            });

            this.eventsService.get_upcoming_events().subscribe((data: Array<Event>) => {

                data.forEach((event) => {
                    this.upcoming_events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, event.interest_ids, event.interest_names, event.organizers));
                });

                this.upcomingEventsList = new MatTableDataSource<Event>(this.upcoming_events);
                this.upcomingEventsList.sort = this.sortUpcoming;
                this.upcomingEventsList.paginator = this.paginatorUpcoming;

            });

            this.eventsService.get_interests().subscribe((data: Array<Interest>) => {
                data.forEach((interest) => {
                    this.interests.push(new Interest(interest.id, interest.name));
                });
            });;

        }
    }

    getUsers() {
        this.upcoming_events = [];
        this.enrolled_events = [];
        this.enrolledEventsList = [];
        this.upcomingEventsList = [];
        this.eventsService.get_enrolled_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.enrolled_events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, [], [], event.organizers));
            });
            this.enrolledEventsList = new MatTableDataSource<Event>(this.enrolled_events);
            this.enrolledEventsList.sort = this.sortEnrolled;
            this.enrolledEventsList.paginator = this.paginatorEnrolled;
        });;
        this.eventsService.get_upcoming_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.upcoming_events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, [], [], event.organizers));
            });
            this.upcomingEventsList = new MatTableDataSource<Event>(this.upcoming_events);
            this.upcomingEventsList.sort = this.sortUpcoming;
            this.upcomingEventsList.paginator = this.paginatorUpcoming;
        });;
    }

    applyUpcomingEventsFilter(filterValue: string) {
        this.upcomingEventsList.filter = filterValue.trim().toLowerCase();
    }

    applyEnrolledEventsFilter(filterValue: string) {
        this.enrolledEventsList.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit() {
        this.enrolledEventsList.paginator = this.paginatorEnrolled;
        this.upcomingEventsList.paginator = this.paginatorUpcoming;
    }

    deleteEvent(ev) {
        this.eventsService.delete_event(ev.id).subscribe((result: boolean) => {
            if (result) {
                this.event.reset();
                this.router.navigate(['events'], { queryParams: { message: "Event was deleted" }, preserveQueryParams: false });
            }
            else {
                this.displayInfo("Failure deleting event", "Failure")
            }
        });
    }

    downloadEnrolledEvents() {
        if (this.enrolled_events.length <= 0) {
            this.displayInfo("No Enrolled Events", "Failure");
        }
        else {

            let doc = new jsPDF();

            let curDate = new Date();
            let curDateStr = this.datepipe.transform(curDate, 'MMM d, y');
            let userName = this.eventsService.get_current_user_name();

            var data = [];
            this.enrolled_events.forEach((event) => {
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

                    var text = "Enrolled Events for " + userName + " as of " + curDateStr;
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
            var fileName = userName + " Enrolled" + ".pdf";
            doc.save(fileName);
        }
    }

    downloadUpcomingEvents() {
        if (this.upcoming_events.length <= 0) {
            this.displayInfo("No Upcoming Events", "Failure");
        }
        else {
            let doc = new jsPDF();

            let curDate = new Date();
            let curDateStr = this.datepipe.transform(curDate, 'MMM d, y');
            let userName = this.eventsService.get_current_user_name();

            var data = [];
            this.upcoming_events.forEach((event) => {
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

                    var text = "Enrolled Events for " + userName + " as of " + curDateStr;
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

    displayInfo(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    reloadUsers() {
        this.enrolledEventsList = new MatTableDataSource<Event>(this.enrolled_events);
        this.enrolledEventsList.sort = this.sortEnrolled;
        this.enrolledEventsList.paginator = this.paginatorEnrolled;

        this.upcomingEventsList = new MatTableDataSource<Event>(this.upcoming_events);
        this.upcomingEventsList.sort = this.sortUpcoming;
        this.upcomingEventsList.paginator = this.paginatorUpcoming;
    }

    logout() {
        this.authService.removeCurrentUser();
        this.router.navigate(['login']);
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

    joinEvent(event) {
        this.eventsService.join_event(event).subscribe((result: boolean) => {
            if (result) {
                this.event.reset();
                let successmessage = "Successfully Enrolled to - " + event.name;
                this.router.navigate(['dashboard'], { queryParams: { message: successmessage }, preserveQueryParams: false });
            }
            else {
                this.displayInfo("Failure joining event", "Failure")
            }
        });
    }

    leaveEvent(event) {
        this.eventsService.leave_event(event).subscribe((result: boolean) => {
            if (result) {
                this.event.reset();
                let successmessage = "Successfully left - " + event.name;
                this.router.navigate(['dashboard'], { queryParams: { message: successmessage }, preserveQueryParams: false });
            }
            else {
                this.displayInfo("Failure leaving event", "Failure")
            }
        });
    }
}