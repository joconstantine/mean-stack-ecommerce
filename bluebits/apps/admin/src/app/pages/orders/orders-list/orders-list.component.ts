import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ORDER_STATUS } from '@bluebits/orders';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    readonly orderStatus = ORDER_STATUS;
    ordersSub: Subscription | undefined;

    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    ngOnDestroy() {
        if (this.ordersSub) this.ordersSub.unsubscribe();
    }

    _getOrders() {
        this.ordersSub = this.ordersService.getOrders().subscribe((orders) => {
            this.orders = orders;
        });
    }

    showOrder(orderId: string) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }

    deleteOrder(orderId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ordersService.deleteOrder(orderId).subscribe({
                    next: () => {
                        this._getOrders();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Order is deleted!'
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Order is not deleted!'
                        });
                    }
                });
            }
        });
    }

    getOrderStatus(status: number) {
        return this.orderStatus[status as keyof typeof ORDER_STATUS];
    }
}
