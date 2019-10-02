import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { User } from '../dto/user'
import { MatSnackBar } from '@angular/material';

@Component({
    templateUrl: 'admin-login.component.html',
    styleUrls: ['admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    user: User = new User(0, '', '', '', 0, '', 0, '');

    constructor(private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private snackBar: MatSnackBar, ) {

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
        this.route.queryParams.subscribe(params => {
            let message = params['message'];
            if (message)
                this.displayInfo(message, "Failure")

            this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });
        });

    }

    login() {

        this.authService.login(this.user).subscribe((data: User) => {
            if (data.id <= 0) {
                this.router.navigate(['admin'], { queryParams: { message: "Incorrect Username or Password." }, preserveQueryParams: false });
            }
            else {
                this.authService.setCurrentOrganizer(data);
                this.router.navigate(['events'], { queryParams: { message: "Login successful, Organize events!!!!" }, preserveQueryParams: false });
            }
        });;
    }

    loginAsStudent() {
        this.router.navigate(['login']);
    }

    displayInfo(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }
}

