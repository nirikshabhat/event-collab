import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Event } from '../dto'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventsService } from '../services/index';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../events/add-event/add-event.component'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css']
})
export class EventsComponent implements OnInit {

    events: Array<Event> = new Array<Event>();
    displayedColumns: Array<string> = ['id', 'name', 'description', 'location', 'event_dt', 'actions'];
    eventsList: any = {};
    event: Event = new Event(0, "", "", "", new Date());

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
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt));
            });
            this.eventsList = new MatTableDataSource<Event>(this.events);
            this.eventsList.sort = this.sort;
            this.eventsList.paginator = this.paginator;

            this.route.queryParams.subscribe(params => {
                let message = params['message'];
                if (message)
                    this.displayInfo(message, "Success")
            });

        });;
    }

    getUsers() {
        this.events = [];
        this.eventsList = [];
        this.eventsService.get_events().subscribe((data: Array<Event>) => {
            data.forEach((event) => {
                this.events.push(new Event(event.id, event.name, event.description, event.location, event.event_dt));
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

    addEvent() {
        const dialogRef = this.eventDialog.open(AddEventComponent, {
            data: this.event
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.isCancelled) {
                this.event = result;
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