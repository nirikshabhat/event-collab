import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Event, Interest, User, EventsView, } from '../dto'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventsService, AuthService } from '../services/index';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../events/add-event/add-event.component'
import { Router, ActivatedRoute } from '@angular/router';
import { OpenEventComponent } from '../events/open-event/open-event.component'

@Component({
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit {

    events: Array<Event> = new Array<Event>();
    eventsView: Array<EventsView> = new Array<EventsView>();

    displayedColumns: Array<string> = ['id', 'name', 'description', 'interests', 'location', 'event_dt', 'actions'];
    eventsList: any = {};
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
        private route: ActivatedRoute
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    ngOnInit() {


        this.user = this.authService.getCurrentOrganizer();
        if (this.user == null || this.user.id <= 0)
            this.router.navigate(['admin']);

        this.eventsService.get_organized_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, event.interest_ids, event.interest_names, event.organizers, event.students));
            });
            this.eventsList = new MatTableDataSource<Event>(this.events);
            this.eventsList.sort = this.sort;
            this.eventsList.paginator = this.paginator;

            this.route.queryParams.subscribe(params => {
                let message = params['message'];
                if (message)
                    this.displayInfo(message, "Success")
            });

            this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });

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
        });;
    }

    getUsers() {
        this.events = [];
        this.eventsList = [];
        this.eventsService.get_organized_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, [], [], event.organizers,event.students));
            });
            this.eventsList = new MatTableDataSource<Event>(this.events);
            this.eventsList.sort = this.sort;
            this.eventsList.paginator = this.paginator;
        });;
    }

    applyFilter(filterValue: string) {
        this.eventsList.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit() {
        this.eventsList.sort = this.sort;
        this.eventsList.paginator = this.paginator;
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
        this.eventsList.sort = this.sort;
        this.eventsList.paginator = this.paginator;
    }

    addEvent() {
        const dialogRef = this.eventDialog.open(AddEventComponent, {
            data: { event: this.event, interests: this.interests }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.isCancelled) {
                this.event = result.event;
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
}