import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Subscription } from 'rxjs';
import { Cart } from '../../models/cart-item';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private ordersService: OrdersService
    ) {}
    checkoutFormGroup!: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId = '6222c9c22c4791b95474fdc2';
    countries: { id: string; name: string }[] = [];
    private userSub: Subscription | undefined;
    private orderSub: Subscription | undefined;

    ngOnInit(): void {
        this._initCheckoutForm();
        this._autoFillUser();
        this._getCartItems();
        this._getCountries();
    }

    private _initCheckoutForm() {
        this.checkoutFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            phone: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zip: ['', Validators.required],
            apartment: ['', Validators.required],
            street: ['', Validators.required]
        });
    }

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    backToCart() {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.checkoutFormGroup.invalid) {
            return;
        }
        const order: Order = {
            orderItems: this.orderItems,
            shippingAddress1: this.checkoutForm['street'].value,
            shippingAddress2: this.checkoutForm['apartment'].value,
            city: this.checkoutForm['city'].value,
            zip: this.checkoutForm['zip'].value,
            country: this.checkoutForm['country'].value,
            phone: this.checkoutForm['phone'].value,
            dateOrdered: Date.now().toLocaleString(),
            user: this.userId,
            status: 0
        };

        this.ordersService.cacheOrderData(order);

        this.orderSub = this.ordersService.createCheckoutSession(this.orderItems).subscribe((error) => {
            if (error) {
                console.log('error in redirect to payment');
            }
        });
    }

    get checkoutForm() {
        return this.checkoutFormGroup.controls;
    }

    private _getCartItems() {
        const cart: Cart = this.cartService.getCart();
        if (cart && cart.items) {
            this.orderItems = cart.items.map((item) => {
                return {
                    product: item.productId,
                    quantity: item.quantity
                };
            });
        }
    }

    ngOnDestroy() {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.orderSub) {
            this.orderSub.unsubscribe();
        }
    }

    private _autoFillUser() {
        this.userSub = this.usersService.observeCurrentUser().subscribe((user) => {
            console.log(user);
            this.checkoutForm['name'].setValue(user?.name);
            this.checkoutForm['email'].setValue(user?.email);
            this.checkoutForm['phone'].setValue(user?.phone);
            this.checkoutForm['city'].setValue(user?.city);
            this.checkoutForm['country'].setValue(user?.country);
            this.checkoutForm['zip'].setValue(user?.zip);
            this.checkoutForm['apartment'].setValue(user?.apartment);
            this.checkoutForm['street'].setValue(user?.street);
        });
    }
}
