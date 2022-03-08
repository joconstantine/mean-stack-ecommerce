import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-order-summary',
    templateUrl: './order-summary.component.html',
    styles: []
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
    cartSub!: Subscription;
    totalPrice = 0;
    isCheckout = false;
    constructor(private router: Router, private cartService: CartService, private ordersService: OrdersService) {
        this.router.url.includes('checkout') ? (this.isCheckout = true) : (this.isCheckout = false);
    }

    ngOnInit(): void {
        this._getOrderSummary();
    }

    ngOnDestroy(): void {
        if (this.cartSub) {
            this.cartSub.unsubscribe();
        }
    }

    _getOrderSummary() {
        this.cartSub = this.cartService.cart$.subscribe((cart) => {
            this.totalPrice = 0;
            if (cart && cart.items) {
                cart.items.map((item) => {
                    this.ordersService
                        .getProduct(item.productId as string)
                        .pipe(take(1))
                        .subscribe((product) => {
                            this.totalPrice += product.price * item.quantity;
                        });
                });
            }
        });
    }

    navigateToCheckout() {
        this.router.navigate(['/checkout']);
    }
}
