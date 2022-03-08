import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    productsSub: Subscription | undefined;
    categoriesSub: Subscription | undefined;
    isCategoryPage = false;

    constructor(private productsService: ProductsService, private categoriesService: CategoriesService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            params['categoryid'] ? this._getProducts([params['categoryid']]) : this._getProducts();
            params['categoryid'] ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
        });
        this._getCategories();
    }

    private _getProducts(selectedCategories?: string[]) {
        this.productsSub = this.productsService.getProducts(selectedCategories).subscribe((products) => (this.products = products));
    }

    private _getCategories() {
        this.categoriesSub = this.categoriesService.getCategories().subscribe((categories) => (this.categories = categories));
    }

    ngOnDestroy(): void {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }

        if (this.categoriesSub) {
            this.categoriesSub.unsubscribe();
        }
    }

    categoryFilter() {
        const selectedCategories = this.categories.filter((category) => category.checked).map((category) => category.id as string);
        this._getProducts(selectedCategories);
    }
}
