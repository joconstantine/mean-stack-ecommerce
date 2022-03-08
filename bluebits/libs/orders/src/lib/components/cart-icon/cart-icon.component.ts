import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'orders-cart-icon',
    templateUrl: './cart-icon.component.html',
    styles: []
})
export class CartIconComponent implements OnInit, OnDestroy {
    cartCount = 0;
    cartSub: Subscription | undefined;

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.cartSub = this.cartService.cart$.subscribe((cart) => {
            this.cartCount = cart.items?.length ?? 0;
        });
    }

    ngOnDestroy(): void {
        if (this.cartSub) {
            this.cartSub.unsubscribe();
        }
    }
}
