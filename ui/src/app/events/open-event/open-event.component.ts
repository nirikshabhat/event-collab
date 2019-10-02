import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Event, Interest } from '../../dto/index';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    templateUrl: 'open-event.component.html',
    styleUrls: ['open-event.component.css']
})
export class OpenEventComponent {

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    interestCtrl = new FormControl();
    filteredInterests: Observable<string[]>;
    interests: string[] = [];
    allInterests: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
    interestsList: Array<Interest> = new Array<Interest>();

    @ViewChild('interestInput', { static: false }) interestInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

    constructor(
        public dialogRef: MatDialogRef<OpenEventComponent>,
        public eventDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { event: Event, interests: Array<Interest> }) {
        console.log(data.event);
        this.allInterests = this.data.interests.map(int => int.name);
        this.interestsList = data.interests;
        this.filteredInterests = this.interestCtrl.valueChanges.pipe(
            startWith(null),
            map((interest: string | null) => interest ? this._filter(interest) : this.allInterests.slice()));
    }

    cancelOpenEvent(): void {
        this.dialogRef.close({ isCancelled: true });
    }

    add(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            // Add our fruit
            if ((value || '').trim()) {
                this.interests.push(value.trim());
            }

            // Reset the input value
            if (input) {
                input.value = '';
            }

            this.interestCtrl.setValue(null);
        }
    }

    remove(interest: string): void {
        const index = this.interests.indexOf(interest);

        if (index >= 0) {
            this.interests.splice(index, 1);
            //add the de selected interest back
            this.allInterests.push(interest);
            let intr: Interest = this.interestsList.find(il => il.name === interest);
            let inrIndex = this.data.event.interest_ids.indexOf(intr.id);
            this.data.event.interest_ids.splice(inrIndex, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.interests.push(event.option.viewValue);
        this.interestInput.nativeElement.value = '';
        this.interestCtrl.setValue(null);
        // remove selected entry from list
        this.allInterests = this.allInterests.filter(al => al != event.option.viewValue);
        this.data.event.interest_ids.push(this.interestsList.find(il => il.name === event.option.viewValue).id);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allInterests.filter(interest => interest.toLowerCase().indexOf(filterValue) === 0);
    }


}