"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from account.views import (
    logout_view,
    login_view
)

from inventory.views import (
    products_view,
    save_product_category,
    get_product_category,
    save_product,
    get_product,
    get_product_details,
    get_product_stock,
    save_product_stock,
    get_product_history,
    get_stock_history,
    get_category_history

)

from store.views import (
    stores_view,
    save_store,
    get_store,
    get_store_details
)

from order.views import(
    orders_view,
    get_order,
    get_order_details,
    get_order_items,
    update_order,
    get_payment,
    save_payment
)

from cashier.views import(
    cashier_view,
    get_product_cashier,
    get_sales_invoice,
    save_order,
    
)

urlpatterns = [
    path('', login_view, name='home'),
    path('admin/', admin.site.urls),
    path('products/', products_view, name='products'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('products/category/save/', save_product_category, name='products/category/save'),
    path('products/category/get', get_product_category, name='products/category/get'),
    path('products/product/save/', save_product, name='products/product/save'),
    path('products/products/get', get_product, name='/products/products/get'),
    path('products/product/detail/get', get_product_details, name='/products/product/detail/get'),
    path('products/stock/get', get_product_stock, name='/products/stock/get'),
    path('products/stock/save/', save_product_stock, name='/products/stock/save'),
    path('stores/', stores_view, name='stores'),
    path('products/history/get', get_product_history, name='products/history/get'),
    path('products/stock/history/get', get_stock_history, name='products/stock/history/get'),
    path('products/category/history/get', get_category_history, name='products/category/history/get'),
    path('stores/stores/get', get_store, name='/stores/stores/get'),
    path('stores/store/save/', save_store, name='stores/store/save'),
    path('stores/store/detail/get', get_store_details, name='/stores/store/detail/get'),
    path('cashier/', cashier_view, name='cashier'),
    path('cashier/products/get', get_product_cashier, name='/cashier/products/get'),
    path('cashier/salesinvoice/get', get_sales_invoice, name='/cashier/salesinvoice/get'),
    path('cashier/order/save/', save_order, name='cashier/order/save'),
    path('orders/', orders_view, name='order'),
    path('orders/orders/get', get_order, name='/orders/orders/get'),
    path('orders/orders/detail/get', get_order_details, name='/orders/orders/detail/get'),
    path('orders/order/items/get', get_order_items, name='/orders/order/items/get'),
    path('orders/order/save/', update_order, name='orders/order/save'),
    path('orders/payment/get', get_payment, name='/orders/payment/get'),
    path('orders/payment/save/', save_payment, name='orders/payment/save'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)