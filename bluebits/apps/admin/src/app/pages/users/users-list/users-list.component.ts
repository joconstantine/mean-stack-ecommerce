import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UsersService } from '@bluebits/users';
import { Subscription } from 'rxjs';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit, OnDestroy {
    users: User[] = [];
    usersSub: Subscription | undefined;

    constructor(
        private usersService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }

    ngOnDestroy() {
        if (this.usersSub) this.usersSub.unsubscribe();
    }

    deleteUser(userId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersSub = this.usersService.deleteUser(userId).subscribe(
                    () => {
                        this._getUsers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User is deleted!'
                        });
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'User is not deleted!'
                        });
                    }
                );
            }
        });
    }

    updateUser(userid: string) {
        this.router.navigateByUrl(`users/form/${userid}`);
    }

    private _getUsers() {
        this.usersService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    getCountryName(countryId: string) {
        return this.usersService.getCountry(countryId);
    }
}
