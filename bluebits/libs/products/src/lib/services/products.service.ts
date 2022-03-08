import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    apiURLProducts = environment.apiURL + 'products';
    constructor(private http: HttpClient) {}

    getProducts(categoriesFilter?: string[]): Observable<Product[]> {
        let params = new HttpParams();
        if (categoriesFilter) {
            params = params.append('categories', categoriesFilter.join(','));
        }
        return this.http.get<Product[]>(this.apiURLProducts, {
            params
        });
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
    }

    getProduct(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
    }

    createProduct(product: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, product);
    }

    updateProduct(product: FormData, productId: string): Observable<Product> {
        return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, product);
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
    }

    getProductsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLProducts}/get/count`).pipe(map((objectValue: any) => objectValue.productCount));
    }
}
