import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@bluebits/orders';
import { Subscription } from 'rxjs';
import { Cart, CartItemDetailed } from '../../models/cart-item';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
    cartItemsDetailed: CartItemDetailed[] = [];
    cartCount = 0;
    cart!: Cart;
    cartSub: Subscription | undefined;

    constructor(private cartService: CartService, private router: Router) {}

    ngOnInit(): void {
        this._getCartDetails();
    }

    private _getCartDetails() {
        this.cartSub = this.cartService.cart$.subscribe((resCart) => {
            this.cartItemsDetailed = [];
            this.cartCount = resCart.items?.length ?? 0;
            resCart.items?.forEach((cartItem) => {
                this.cartService.getProduct(cartItem.productId as string).subscribe((resProduct) => {
                    this.cartItemsDetailed.push({
                        product: resProduct,
                        quantity: cartItem.quantity
                    });
                });
            });
        });
    }

    ngOnDestroy() {
        if (this.cartSub) {
            this.cartSub.unsubscribe();
        }
    }

    backToShop() {
        this.router.navigateByUrl('/products');
    }

    deleteCartItem(cartItem: CartItemDetailed) {
        this.cartService.deleteCartItem(cartItem.product.id);
    }

    updateCartItemQuantity(quantity: string, cartItem: CartItemDetailed) {
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: +quantity
            },
            true
        );
    }
}
