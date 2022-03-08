import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    editMode = false;
    isSubmitted = false;
    categories: Category[] = [];
    imageDisplay: string | ArrayBuffer | null | undefined = '';
    currentProductId = '';
    productSub: Subscription | undefined;
    categoriesSub: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private categoriesService: CategoriesService,
        private router: Router,
        private productsService: ProductsService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._checkEditMode();
    }

    ngOnDestroy() {
        if (this.productSub) this.productSub.unsubscribe();
        if (this.categoriesSub) this.categoriesSub.unsubscribe();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
        });
    }

    private _getCategories() {
        this.categoriesSub = this.categoriesService.getCategories().subscribe((cats) => {
            this.categories = cats;
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const productFormData = new FormData();

        Object.keys(this.productForm).map((key) => {
            productFormData.append(key, this.productForm[key].value);
        });

        if (this.editMode) {
            this._updateProduct(productFormData);
        } else {
            this._addProduct(productFormData);
        }
    }

    private _addProduct(productData: FormData) {
        this.productsService.createProduct(productData).subscribe({
            next: (product: Product) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} is created` });
                timer(1000).subscribe(() => {
                    this.router.navigate(['/products']);
                });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not created!' });
            }
        });
    }

    private _updateProduct(productData: FormData) {
        this.productsService.updateProduct(productData, this.currentProductId).subscribe({
            next: (product: Product) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} is updated` });
                timer(1000).subscribe(() => {
                    this.router.navigate(['/products']);
                });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not updated!' });
            }
        });
    }

    get productForm() {
        return this.form.controls;
    }

    onImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target || !target.files?.length) {
            return;
        }
        const file = target.files[0];
        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image')?.updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    private _checkEditMode() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.editMode = true;
                this.currentProductId = params['id'];
                this.productSub = this.productsService.getProduct(params['id']).subscribe((product) => {
                    this.productForm['name'].setValue(product.name);
                    this.productForm['category'].setValue(product.category?.id);
                    this.productForm['brand'].setValue(product.brand);
                    this.productForm['price'].setValue(product.price);
                    this.productForm['countInStock'].setValue(product.countInStock);
                    this.productForm['isFeatured'].setValue(product.isFeatured);
                    this.productForm['description'].setValue(product.description);
                    this.productForm['richDescription'].setValue(product.richDescription);
                    this.imageDisplay = product.image;
                    this.productForm['image'].setValidators([]);
                    this.productForm['image'].updateValueAndValidity();
                });
            }
        });
    }
}
