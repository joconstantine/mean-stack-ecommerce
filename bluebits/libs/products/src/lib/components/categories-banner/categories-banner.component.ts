import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styles: []
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    categoriesSub: Subscription | undefined;

    constructor(private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this.categoriesSub = this.categoriesService.getCategories().subscribe((categories) => (this.categories = categories));
    }

    ngOnDestroy(): void {
        if (this.categoriesSub) {
            this.categoriesSub.unsubscribe();
        }
    }
}
