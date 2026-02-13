import { Routes } from '@angular/router';
import { checkoutGuard } from './core/guards/checkout.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home-page/home-page.component')
                .then(m => m.HomePageComponent),
        title: 'OrderHub - Home'
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/product-list/product-list.component')
                .then(m => m.ProductListComponent),
        title: 'Products - OrderHub'
    },
    {
        path: 'products/:slug',
        loadComponent: () =>
            import('./features/products/product-detail/product-detail.component')
                .then(m => m.ProductDetailComponent),
        title: 'Product Details - OrderHub'
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./features/cart/cart-page/cart-page.component')
                .then(m => m.CartPageComponent),
        title: 'Cart - OrderHub'
    },
    // Replace the checkout route with:
    {
        path: 'checkout',
        loadComponent: () =>
            import('./features/checkout/checkout-page/checkout-page.component')
                .then(m => m.CheckoutPageComponent),
        title: 'Checkout - OrderHub',
        canActivate: [checkoutGuard]   // <-- use proper guard
    },
    {
        path: 'orders',
        loadComponent: () =>
            import('./features/orders/order-list/order-list.component')
                .then(m => m.OrderListComponent),
        title: 'My Orders - OrderHub'
    },
    {
        path: 'orders/:id',
        loadComponent: () =>
            import('./features/orders/order-detail/order-detail.component')
                .then(m => m.OrderDetailComponent),
        title: 'Order Details - OrderHub'
    },
    {
        path: 'admin',
        loadComponent: () =>
            import('./features/admin/admin-dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard - OrderHub'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];