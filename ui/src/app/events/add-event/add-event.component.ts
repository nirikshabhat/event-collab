import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from '../../dto/event';

@Component({
    templateUrl: 'add-event.component.html',
    styleUrls: ['add-event.component.css']
})
export class AddEventComponent {

    constructor(
        public dialogRef: MatDialogRef<AddEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Event) { }

    cancelCreateEvent(): void {
        this.dialogRef.close({ isCancelled: true });
    }

}