import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart-item';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const CART_KEY = 'cart';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    apiURLProducts = environment.apiURL + 'products';
    cart$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.getCart());

    constructor(private http: HttpClient) {}

    initCartLocalStorage() {
        const cart = this.getCart();
        if (!cart) {
            const initialCart = {
                items: []
            };
            localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
        }
    }

    setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
        const cart = this.getCart();
        const cartItemExist = cart.items?.find((item) => item.productId === cartItem.productId);
        if (!cartItem.quantity) {
            cartItem.quantity = 1;
        }
        if (cartItemExist) {
            cart.items?.map((item) => {
                if (item.productId === cartItemExist.productId) {
                    if (updateCartItem) {
                        item.quantity = cartItem.quantity;
                    } else {
                        item.quantity = item.quantity ? item.quantity + cartItem.quantity : 1;
                    }
                }
            });
        } else {
            cart.items?.push(cartItem);
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next(cart);
        return cart;
    }

    getCart() {
        const cartJsonString = localStorage.getItem(CART_KEY) as string;
        const cart: Cart = JSON.parse(cartJsonString);
        return cart;
    }

    getProduct(productId: string): Observable<any> {
        return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
    }

    deleteCartItem(productId: string) {
        const cart = this.getCart();
        const newCartItems = cart.items?.filter((item) => item.productId !== productId);
        cart.items = newCartItems;

        const cartJsonString = JSON.stringify(cart);
        localStorage.setItem(CART_KEY, cartJsonString);

        this.cart$.next(cart);
    }

    emptyCart() {
        const initialCart = {
            items: []
        };
        localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
        this.cart$.next(initialCart);
    }
}
