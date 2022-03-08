import { Component, Input, OnInit } from '@angular/core';
import { CartItem, CartService } from '@bluebits/orders';
import { Product } from '../../models/product';

@Component({
    selector: 'products-product-item',
    templateUrl: './product-item.component.html',
    styles: []
})
export class ProductItemComponent implements OnInit {
    @Input() product: Product | undefined;

    constructor(private cartService: CartService) {}

    ngOnInit(): void {}

    addProductToCart() {
        const cartItem: CartItem = {
            productId: this.product?.id,
            quantity: 1
        };
        this.cartService.setCartItem(cartItem);
    }
}
