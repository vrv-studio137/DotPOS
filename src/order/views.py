from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.db import IntegrityError
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from datetime import date,datetime, timedelta, time

from order.models import Order,OrderItem,OrderHistory,OrderPayment
from account.models import Account
from store.models import Store
from order.serializer import OrderSerializer,OrderDetailsSerializer,OrderItemSerializer,PaymentSerializer
from order.forms import SaveOrderForm,SavePaymentForm
# Create your views here.
# Create your views here.
def orders_view(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('login')
    
    args = {}
    args['PAGE_HEADER'] = 'Orders'
    args['PAGE_NAME'] = 'orders'
    args['PAGE_BREADCRUMBS'] = [
        {
            'label':'Order',
            'link':'/orders',
            'active':'active',
            'class':'',
        }
    ]

    stores = Store.objects.all()
    args['stores'] = stores
   
    return render(request, 'order/orders.html',args)

def get_order(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    datefrom = request.GET['datefrom']
    dateto = datetime.strptime(request.GET['dateto'], "%Y-%m-%d").date()+ timedelta(days=1)
    print('datefrom: '+datefrom)
    orders = Order.objects.filter(store_id=request.GET['storeid']
                                ,invoiceno__icontains = request.GET['invoiceno']
                                  ,referenceno__icontains = request.GET['referenceno']
                                  ,customername__icontains = request.GET['customername']
                                  ,dateadded__range=[datefrom,dateto]
                                  ).order_by('-dateadded')

    if int(request.GET['orderstatus']) > 0:
        orders = orders.filter(orderstatus = request.GET['orderstatus'])

    recordsTotal = orders.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(orders, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = OrderSerializer(object_list,many = True)

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data
    }

    return JsonResponse(json_res)

def get_order_details(request):

    orders = Order.objects.filter(orderid = request.GET['orderid'])

    data = OrderDetailsSerializer(orders,many = True)

    json_res={
        'data':data.data[0]
    }

    return JsonResponse(json_res)

def get_order_items(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    orders = OrderItem.objects.filter(order_id=request.GET['orderid'])

    recordsTotal = orders.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(orders, length)

    # try:
    #     object_list = paginator.page(page).object_list
    # except PageNotAnInteger:
    #     object_list = paginator.page(draw).object_list
    # except EmptyPage:
    #     object_list = paginator.page(paginator.num_pages).object_list

    data = OrderItemSerializer(orders,many = True)

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data
    }

    return JsonResponse(json_res)

def update_order(request):
    success = True
    message = 'success'

    try:
        if request.POST:
            user = request.user
            orderid = int(request.POST['orderid'])
            list_changes =[]

            ####UPDATE
            if (orderid>0):
                order = Order.objects.get(pk = orderid)

                if (order.referenceno != request.POST['referenceno'].strip()):
                    history = OrderHistory(order = order,oldvalue = order.referenceno,newvalue = order.referenceno,remarks= 'Updated referenceno from '+order.referenceno+' to '+request.POST['referenceno'].strip(),user = user)
                    list_changes.append(history)
                # if (order.dateadded != request.POST['orderdate']):
                #     history = OrderHistory(order = order,oldvalue = order.dateadded,newvalue = order.dateadded,remarks= 'Updated order date from '+order.dateadded+' to '+request.POST['orderdate'].strip(),user = user)
                #     list_changes.append(history)
                if (order.customername != request.POST['customername'].strip()):
                    history = OrderHistory(order = order,oldvalue = order.customername,newvalue = order.customername,remarks= 'Updated customer name from '+order.customername+' to '+request.POST['customername'].strip(),user = user)
                    list_changes.append(history)
                if (order.customeraddress != request.POST['customeraddress'].strip()):
                    history = OrderHistory(order = order,oldvalue = order.customeraddress,newvalue = order.customeraddress,remarks= 'Updated customer address from '+order.customeraddress+' to '+request.POST['customeraddress'].strip(),user = user)
                    list_changes.append(history)
                if (order.customertin != request.POST['customertin'].strip()):
                    history = OrderHistory(order = order,oldvalue = order.customertin,newvalue = order.customeraddress,remarks= 'Updated customer tin no. from '+order.customertin+' to '+request.POST['customertin'].strip(),user = user)
                    list_changes.append(history)

                form = SaveOrderForm(request.POST,instance=order)
                if form.is_valid():
                    print('orderid: '+str(orderid))
                    order.referenceno = request.POST['referenceno'].strip()
                    # order.dateadded = request.POST['orderdate'].strip()
                    order.customername = request.POST['customername'].strip()
                    order.customeraddress = request.POST['customeraddress'].strip()
                    order.customertin = request.POST['customertin'].strip()
                    order.save()
                else:
                    success = False
                    message='Form invalid'
                
            else:
                success = False
                message=''
            #save history
            for change in list_changes:
                change.save()
        else:
            success = False
            # message = str(form.errors.as_json())
            message = [(k, v[0]) for k, v in form.errors.items()]

        
    except IntegrityError as e:
        
        message = e.message
        success = False
    except Exception as e:
        print('message: '+str(e))
        message = str(e)
        success = False
    
    
    json_res={
        'success': success,
        'message':message
    }
    
    return JsonResponse(json_res)


def get_payment(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    payments = OrderPayment.objects.filter(Order_id=request.GET['orderid'])

    recordsTotal = payments.count()
    print('Payments: '+str(recordsTotal))
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(payments, length)

    # try:
    #     object_list = paginator.page(page).object_list
    # except PageNotAnInteger:
    #     object_list = paginator.page(draw).object_list
    # except EmptyPage:
    #     object_list = paginator.page(paginator.num_pages).object_list

    data = PaymentSerializer(payments,many = True)
    # data = object_list

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data
    }

    return JsonResponse(json_res)


def save_payment(request):
    success = True
    message = 'success'

    try:
        if request.POST:
            user = request.user
            orderid = int(request.POST['orderid'])
            list_changes =[]
            order = Order.objects.get(pk = orderid)
            # save payment
            form = SavePaymentForm(request.POST)
            orderpayment= OrderPayment.objects.create(
                amount= request.POST['amount'],
                dateadded= request.POST['paymentdate'],
                Order =order
            )
            
        else:
            success = False
            # message = str(form.errors.as_json())
            message = [(k, v[0]) for k, v in form.errors.items()]

        
    except IntegrityError as e:
        
        message = e.message
        success = False
    except Exception as e:
        print('message: '+str(e))
        message = str(e)
        success = False
    
    
    json_res={
        'success': success,
        'message':message
    }
    
    return JsonResponse(json_res)
