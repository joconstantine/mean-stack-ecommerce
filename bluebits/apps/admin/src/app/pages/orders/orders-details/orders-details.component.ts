import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderItem, OrdersService } from '@bluebits/orders';
import { Product } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ORDER_STATUS } from '@bluebits/orders';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-details.component.html',
    styles: []
})
export class OrdersDetailsComponent implements OnInit, OnDestroy {
    order!: Order;
    orderStatuses: { id: string; name: string }[] = [];
    selectedStatus: number | undefined;
    orderSub: Subscription | undefined;

    constructor(private orderService: OrdersService, private messageService: MessageService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this._mapOrderStatus();
        this._getOrder();
    }

    private _mapOrderStatus() {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[+key as keyof typeof ORDER_STATUS].label
            };
        });
    }

    ngOnDestroy() {
        if (this.orderSub) this.orderSub.unsubscribe();
    }

    private _getOrder() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.orderSub = this.orderService.getOrder(params['id']).subscribe((order) => {
                    this.order = order;
                    this.selectedStatus = order.status;
                });
            }
        });
    }

    onStatusChange(event: { value: string }) {
        if (!this.order.id) {
            return;
        }
        this.orderService.updateOrder({ status: event.value }, this.order.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order is updated!'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Order is not updated!'
                });
            }
        });
    }

    computeSubtotal(orderItem: OrderItem): number {
        if (!orderItem) {
            throw Error('orderItem is null');
        }
        if (!orderItem.product) {
            throw Error('product is null');
        }

        const quantity = orderItem.quantity ? orderItem.quantity : 0;
        const product: Product = orderItem.product as Product;
        const price = product.price ? +product.price : 0;

        return price * quantity;
    }
}
