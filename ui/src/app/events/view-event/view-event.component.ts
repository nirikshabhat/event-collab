import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Event, Interest } from '../../dto'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventsService } from '../../services/index';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../../events/add-event/add-event.component'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'view-event.component.html',
    styleUrls: ['view-event.component.css']
})
export class ViewEventComponent implements OnInit {

    events: Array<Event> = new Array<Event>();
    displayedColumns: Array<string> = ['id', 'name', 'description', 'interests', 'location', 'event_dt','actions'];
    eventsList: any = {};
    event: Event = new Event(0, "", "", "", new Date(), [], []);
    interests: Array<Interest> = new Array<Interest>();

    constructor(private eventsService: EventsService,
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

        this.eventsService.get_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, event.interest_ids, event.interest_names));
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
        this.eventsService.get_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt, [], []));
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
                this.event.reset();
                this.router.navigate(['events'], { queryParams: { message: "Event was deleted" }, preserveQueryParams: false });
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

    logout() {
        this.router.navigate(['login']);
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
                        this.event.reset();
                        this.router.navigate(['events'], { queryParams: { message: "Event added successfully" }, preserveQueryParams: false });
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
}