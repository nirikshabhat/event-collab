import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
        private route: ActivatedRoute) {

    }

    form: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });

    submit() {
        if (this.form.valid) {
            this.submitEM.emit(this.form.value);
        }
    }
    @Input() error: string | null;

    @Output() submitEM = new EventEmitter();

    ngOnInit() {

    }

    login() {
        this.router.navigate(['dashboard'], { queryParams: { message: "Login successful, Manage your events!!!!" }, preserveQueryParams: false });
    }

    loginAsAdmin() {
        this.router.navigate(['admin']);
    }
}

