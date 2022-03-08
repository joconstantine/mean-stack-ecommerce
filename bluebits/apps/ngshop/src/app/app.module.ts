import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, UsersModule } from '@bluebits/users';
import { ProductsModule } from '@bluebits/products';
import { OrdersModule } from '@bluebits/orders';
import { UiModule } from '@bluebits/ui';
import { StoreModule } from '@ngrx/store';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { MessagesComponent } from './shared/messages/messages.component';
import { EffectsModule } from '@ngrx/effects';
import { NgxStripeModule } from 'ngx-stripe';

const routes: Routes = [{ path: '', component: HomePageComponent }];

@NgModule({
    declarations: [AppComponent, NxWelcomeComponent, HomePageComponent, HeaderComponent, FooterComponent, NavComponent, MessagesComponent],
    imports: [
        BrowserModule,
        UiModule,
        AccordionModule,
        ProductsModule,
        HttpClientModule,
        OrdersModule,
        UsersModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        ToastModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        NgxStripeModule.forRoot('pk_test_51J812AEVYb5LWxk8w0kt9x53Ji5wzppLYnpziXu3mJI7JOgKGbfQKYdHgKKBHutQhpEx1IyvZdR8Jzt4eIeTkfWP00vdssOKFS')
    ],
    providers: [
        MessageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
