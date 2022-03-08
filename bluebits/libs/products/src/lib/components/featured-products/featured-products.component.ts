import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '@bluebits/products';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-featured-products',
    templateUrl: './featured-products.component.html',
    styles: []
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
    featuredProducts: Product[] = [];
    productsSub: Subscription | undefined;

    constructor(private productsService: ProductsService) {}

    ngOnInit(): void {
        this.productsSub = this.productsService.getFeaturedProducts(4).subscribe((products) => (this.featuredProducts = products));
    }

    ngOnDestroy(): void {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }
}
