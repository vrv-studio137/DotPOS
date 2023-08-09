from django.shortcuts import render,redirect
from inventory.models import ProductCategory, Product, Store,Stock,StockHistory
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError
from django.http import JsonResponse
from inventory.serializers import ProductSerializer
from account.models import Account
from order.models import Order,OrderHistory,OrderItem,OrderPayment
from datetime import date,datetime, timedelta, time
from cashier.forms import SaveOrderForm
from django.utils import timezone

import json

# Create your views here.
def cashier_view(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('login')
    
    args = {}
    args['PAGE_HEADER'] = 'Cashier'
    args['PAGE_NAME'] = 'casheir'
    args['PAGE_BREADCRUMBS'] = [
        {
            'label':'Cashier',
            'link':'/casheir',
            'active':'active',
            'class':'',
        }
    ]

    productcategories = ProductCategory.objects.all()
    args['productcategories'] = productcategories
    


    return render(request, 'cashier/cashier.html',args)


def get_product_cashier(request):
    user = request.user

    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    sortby = '-product__productname'
    searchby = int(request.GET['searchby'])
    storeid = user.store
    match int(request.GET['sortby']):
        case 0:
            sortby = 'product__productname'
        case 1:
            sortby = '-stock'
        case 2:
            sortby = '-product__dateadded'
        case _:
            sortby = 'product__productname'
            

    products = Stock.objects.filter(store_id=storeid,product__shortcode__icontains = request.GET['searchkey']
                                    ).select_related('product').order_by(sortby)
    
    if searchby==1:
        products = Stock.objects.filter(store_id=storeid,product__barcode__icontains = request.GET['searchkey']
                                    ).select_related('product').order_by(sortby)
    elif searchby == 2:
        products = Stock.objects.filter(store_id=storeid,product__sku__icontains = request.GET['searchkey']
                                    ).select_related('product').order_by(sortby)

    if int(request.GET['categoryid']) > 0:
        products = products.filter(product__category__categoryid = request.GET['categoryid'])

    recordsTotal = products.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(products, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = ProductSerializer(object_list,many = True)

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data
    }

    return JsonResponse(json_res)

def get_sales_invoice(request):
    today = datetime.now().date()
    tomorrow = today + timedelta(1)
    today_start = datetime.combine(today, time())
    today_end = datetime.combine(tomorrow, time())
    ordercount = Order.objects.filter(dateadded__range=[today_start,today_end]).count()+1
    
    ordercountstr = str(ordercount)

    while len(ordercountstr) <3:
        ordercountstr = '0' +ordercountstr

    invoiceno = today.strftime("%y%m%d")+ordercountstr

    json_res={
        "salesinvoice": invoiceno
    }

    return JsonResponse(json_res)

def save_order(request):
    success = True
    message = 'success'

    try:
        if request.POST:
            user = request.user
            form = SaveOrderForm(request.POST)
            list_changes_order = []
            if form.is_valid():
                balance =  float(request.POST['totalamount'])-float(request.POST['amounttendered']);
                paymentstatus = False

                if balance <0:
                    balance = 0

                if balance == 0:
                    paymentstatus = 2
                else:
                    paymentstatus = 1
                orderdate = datetime.strptime(request.POST['orderdate'],'%Y-%m-%d')
                order= Order.objects.create(
                    invoiceno= request.POST['salesinvoice'],
                    referenceno= request.POST['referenceno'],
                    customername= request.POST['customername'],
                    customeraddress= request.POST['customeraddress'],
                    customertin= request.POST['customertin'],
                    paymentstatus= paymentstatus,
                    orderstatus= request.POST['orderstatus'],
                    totalamount= request.POST['totalamount'],
                    balance= balance,
                    orderdate = orderdate,
                )

                payment = OrderPayment.objects.create(
                    Order = order,
                    amount = request.POST['amounttendered'],
                    amounttendered =request.POST['amounttendered']
                )

                history = OrderHistory(order = order,remarks = 'Create new order: '+order.invoiceno,user = user)
                list_changes_order.append(history)

                #save history
                for change in list_changes_order:
                        change.save()

                items = json.loads(request.POST["data"])
                for item in items:
                    productid = item['productid']
                    product = Product.objects.get(productid = productid)
                    orderitem = OrderItem.objects.create(
                        order = order,
                        product = product,
                        quantity = item['quantity'],
                        unitprice = item['unitprice'],
                    )

                    savestock = Stock.objects.get(stockid = item['stockid'])
                    newstock = (savestock.stock - float(item['quantity']))

                    stockhistory = StockHistory(stock = savestock,oldvalue = savestock.stock,newvalue = newstock,remarks= savestock.store.storename+ ': Sold '+ item['quantity'] + ' ('+order.invoiceno+')',user = user,product = product)
                    
                    savestock.stock = newstock
                    savestock.save()
                    stockhistory.save()
            else:
                success = False
                print(form.errors)
                message = form.errors
        else:
            success = False
            # message = str(form.errors.as_json())
            message = [(k, v[0]) for k, v in form.errors.items()]

        
                
    except IntegrityError as e:
        
        message = e.message
        success = False
    except Exception as e:
        print('message: '+str(e.message))
        message = str(e)
        success = False
    
    
    json_res={
        'success': success,
        'message':message
    }
    
    return JsonResponse(json_res)
