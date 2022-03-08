import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthGuard } from '@bluebits/users';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { StripeService } from 'ngx-stripe';

export const ordersRoutes: Route[] = [
    { path: 'cart', component: CartPageComponent },
    { path: 'checkout', canActivate: [AuthGuard], component: CheckoutPageComponent },
    { path: 'success', component: ThankYouComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ordersRoutes),
        BadgeModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        InputNumberModule,
        InputMaskModule,
        InputTextModule
    ],
    providers: [StripeService],
    declarations: [CartIconComponent, CartPageComponent, OrderSummaryComponent, CheckoutPageComponent, ThankYouComponent],
    exports: [CartIconComponent, CartPageComponent, RouterModule]
})
export class OrdersModule {
    constructor(cartService: CartService) {
        cartService.initCartLocalStorage();
    }
}
