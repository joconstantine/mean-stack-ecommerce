import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-thank-you-page',
    templateUrl: './thank-you.component.html',
    styles: []
})
export class ThankYouComponent implements OnInit {
    constructor(private ordersService: OrdersService, private cartService: CartService) {}

    ngOnInit(): void {
        const orderData = this.ordersService.getCachedOrderData();
        this.ordersService.createOrder(orderData).subscribe({
            next: () => {
                // redirect to Thank you
                this.cartService.emptyCart();
                this.ordersService.removeCachedOrderData();
            },
            error: () => {
                //display some message
            }
        });
    }
}
