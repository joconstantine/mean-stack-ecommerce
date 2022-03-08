import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    productsSub: Subscription | undefined;

    constructor(
        private productsService: ProductsService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }

    ngOnDestroy() {
        if (this.productsSub) this.productsSub.unsubscribe();
    }

    deleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this product?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService.deleteProduct(productId).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted' });
                        this._getProducts();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not deleted!' });
                    }
                });
            }
        });
    }

    updateProduct(productId: string) {
        this.router.navigateByUrl(`/products/form/${productId}`);
    }

    private _getProducts() {
        this.productsSub = this.productsService.getProducts().subscribe({
            next: (products) => (this.products = products)
        });
    }
}
