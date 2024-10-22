import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product/product.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../model/order';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, FormsModule],
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  isAuthenticated = false;
  products: Array<Product> = [];
  quantityIsNull = false;
  orderSuccess = false;
  orderFailed = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
        this.productService
          .getProducts()
          .pipe()
          .subscribe((product) => {
            this.products = product;
          });
      }
    );
  }

  goToCreateProductPage() {
    this.router.navigateByUrl('/add-product');
  }

  orderProduct(product: Product, quantity: string) {
    console.log(`Ordering product: ${product.skuCode}, quantity: ${quantity}`);

    this.oidcSecurityService.userData$.subscribe((result) => {
      console.log('User data received:', result.userData);

      const userDetails = {
        email: result.userData.email,
        firstName: result.userData.family_name,
        lastName: result.userData.given_name,
      };

      if (!quantity) {
        console.log('Order failed: Quantity is null');
        this.orderFailed = true;
        this.orderSuccess = false;
        this.quantityIsNull = true;
      } else {
        const order: Order = {
          skuCode: product.skuCode,
          price: product.price,
          quantity: Number(quantity),
          userDetails: userDetails,
        };

        console.log('Order to be sent:', order);

        this.orderService.orderProduct(order).subscribe(
          () => {
            console.log('Order placed successfully');
            this.orderSuccess = true;
          },
          (error) => {
            console.error('Order failed:', error);
            this.orderFailed = true;
            this.orderSuccess = false;
          }
        );
      }
    });
  }
}
