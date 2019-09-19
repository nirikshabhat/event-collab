import { Component, OnInit,ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { Event } from '../dto'
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    templateUrl: 'events.component.html',
    styleUrls: ['events.component.css'],
})
export class EventsComponent implements OnInit {

    events: Array<Event> = new Array<Event>();
    displayedColumns: Array<string> = ['id', 'name', 'description', 'location','on'];

    eventsList : any = {};


    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    ngOnInit() {

        this.events.push(new Event(1, 'Book Club Meeting', 'Annual Book Club meeting for Student Club', 'Bengaluru', new Date("2019-10-1")));
        this.events.push(new Event(2, 'Chess Club Meeting', 'Annual Chess Club meeting for Chess Club', 'Hyderabad', new Date("2019-10-13")));
        this.events.push(new Event(3, 'All Hands Meet', 'All Hands meet for information science department', 'Chennai', new Date("2019-10-14")));
        this.events.push(new Event(4, 'Blood Donation', 'Blood donation camp for the poor', 'Bengaluru', new Date("2019-10-17")));
        this.events.push(new Event(5, 'Kuderemukh Trek', 'Trek to Kuderemukh for 3 days', 'Delhi', new Date("2019-10-26")));
        this.events.push(new Event(6, 'Book Club Meeting', 'Annual Book Club meeting for Student Club', 'Bengaluru', new Date("2019-10-1")));
        this.events.push(new Event(7, 'Chess Club Meeting', 'Annual Chess Club meeting for Chess Club', 'Hyderabad', new Date("2019-10-13")));
        this.events.push(new Event(8, 'All Hands Meet', 'All Hands meet for information science department', 'Chennai', new Date("2019-10-14")));
        this.events.push(new Event(9, 'Blood Donation', 'Blood donation camp for the poor', 'Bengaluru', new Date("2019-10-17")));
        this.events.push(new Event(10, 'Kuderemukh Trek', 'Trek to Kuderemukh for 3 days', 'Delhi', new Date("2019-10-26")));
        
        this.eventsList = new MatTableDataSource<Event>(this.events);
        
    }

    applyFilter(filterValue: string) {
        this.eventsList.filter = filterValue.trim().toLowerCase();
      }

    ngAfterViewInit() {
        this.eventsList.sort = this.sort;
        this.eventsList.paginator = this.paginator;
  }
}