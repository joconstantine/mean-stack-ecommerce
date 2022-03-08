import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    loginFormGroup!: FormGroup;
    isSubmitted = false;
    authError = false;
    authMessage = 'Email or password is wrong';
    authSub: Subscription | undefined;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private localstorageService: LocalstorageService, private router: Router) {}

    ngOnInit(): void {
        this._initLoginForm();
    }

    ngOnDestroy() {
        if (this.authSub) this.authSub.unsubscribe();
    }

    private _initLoginForm() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;

        if (this.loginFormGroup.invalid) return;

        this.authSub = this.authService.login(this.loginForm['email'].value, this.loginForm['password'].value).subscribe({
            next: (user) => {
                this.authError = false;
                this.localstorageService.setToken(user.token || '');
                this.router.navigate(['/']);
            },
            error: (err: HttpErrorResponse) => {
                this.authError = true;
                if (err.status !== 400) {
                    this.authMessage = 'Error in the server, please try again later.';
                }
            }
        });
    }

    get loginForm() {
        return this.loginFormGroup.controls;
    }
}
