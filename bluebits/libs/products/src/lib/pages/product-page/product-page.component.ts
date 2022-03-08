import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@bluebits/orders';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styles: []
})
export class ProductPageComponent implements OnInit, OnDestroy {
    product!: Product;
    productSub: Subscription | undefined;
    quantity = 1;

    constructor(private productService: ProductsService, private route: ActivatedRoute, private cartService: CartService) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params['productid']) {
                this._getProduct(params['productid']);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.productSub) {
            this.productSub.unsubscribe();
        }
    }

    private _getProduct(id: string) {
        this.productSub = this.productService.getProduct(id).subscribe((product) => (this.product = product));
    }

    addProductToCart() {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: this.quantity
        };
        this.cartService.setCartItem(cartItem);
    }
}
