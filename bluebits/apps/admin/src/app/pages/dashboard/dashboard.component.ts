import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    statistics: [number, number, number, number] | [] = [];
    endSub$: Subject<[number, number, number, number]> = new Subject();
    constructor(private userService: UsersService, private productService: ProductsService, private ordersService: OrdersService) {}
    ngOnDestroy(): void {
        this.endSub$.complete();
    }

    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrdersCount(),
            this.productService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ])
            .pipe(takeUntil(this.endSub$))
            .subscribe((values) => {
                this.statistics = values;
            });
    }
}
