from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import IntegrityError
from inventory.models import ProductCategory, Product,Stock,ProductCategoryHistory,ProductHistory,StockHistory
from inventory.forms import SaveProductCategoryForm, SaveProductForm
from inventory.serializers import ProductSerializer,ProductStockSerializer,ProductDetailsSerializer,ProductHistorySerializer,StockHistorySerializer,CategoryHistorySerializer
from account.models import Account
from store.models import Store
import json

# Create your views here.
def products_view(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('login')
    
    args = {}
    args['PAGE_HEADER'] = 'Products'
    args['PAGE_NAME'] = 'products'
    args['PAGE_BREADCRUMBS'] = [
        {
            'label':'Products',
            'link':'/products',
            'active':'active',
            'class':'',
        }
    ]
    productcategories = ProductCategory.objects.all()
    args['productcategories'] = productcategories

    stores = Store.objects.all()
    args['stores'] = stores


    return render(request, 'products/products.html',args)

def get_product(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    sortby = '-product__productname'

    match int(request.GET['sortby']):
        case 0:
            sortby = 'product__productname'
        case 1:
            sortby = '-stock'
        case 2:
            sortby = '-product__dateadded'
        case _:
            sortby = 'product__productname'
            

    products = Stock.objects.filter(store_id=request.GET['storeid'],product__sku__icontains = request.GET['sku']
                                    ,product__barcode__icontains = request.GET['barcode']
                                    ,product__productname__icontains = request.GET['productname']
                                    ,product__shortcode__icontains = request.GET['shortcode']
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

    return JsonResponse(json_res);

def get_product_details(request):

    products = Product.objects.filter(productid = request.GET['productid']).select_related('category')

    data = ProductDetailsSerializer(products,many = True)

    json_res={
        'data':data.data[0]
    }

    return JsonResponse(json_res);

def get_product_category(request):
    # productcategories = ProductCategory.objects.raw('call get_productcategory(@recordsTotal,%s,%s,%s,%s)',[request.GET['draw'],3,request.GET['categoryname'],request.GET['shortcode']])
    # data = [model_to_dict(productcategory) for productcategory in productcategories]
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    productcategories = ProductCategory.objects.filter(categoryname__icontains = request.GET['categoryname'], shortcode__icontains = request.GET['shortcode'])
    recordsTotal = productcategories.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(productcategories, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = [model_to_dict(productcategory) for productcategory in object_list]

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data,
    }

    return JsonResponse(json_res)

def get_product_history(request):
    # productcategories = ProductCategory.objects.raw('call get_productcategory(@recordsTotal,%s,%s,%s,%s)',[request.GET['draw'],3,request.GET['categoryname'],request.GET['shortcode']])
    # data = [model_to_dict(productcategory) for productcategory in productcategories]
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    producthistory = ProductHistory.objects.filter(product_id = int(request.GET['productid'])).order_by('-date')
    recordsTotal = producthistory.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(producthistory, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = ProductHistorySerializer(object_list,many = True)

    # data = [model_to_dict(producthistory) for producthistory in object_list]

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data,
    }

    return JsonResponse(json_res)

def get_stock_history(request):
    # productcategories = ProductCategory.objects.raw('call get_productcategory(@recordsTotal,%s,%s,%s,%s)',[request.GET['draw'],3,request.GET['categoryname'],request.GET['shortcode']])
    # data = [model_to_dict(productcategory) for productcategory in productcategories]
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    producthistory = StockHistory.objects.filter(product_id = int(request.GET['productid'])).order_by('-date')
    recordsTotal = producthistory.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(producthistory, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = StockHistorySerializer(object_list,many = True)

    # data = [model_to_dict(producthistory) for producthistory in object_list]

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data,
    }

    return JsonResponse(json_res)

def get_category_history(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    categoryhistory = ProductCategoryHistory.objects.filter(category_id = int(request.GET['categoryid'])).order_by('-date')
    recordsTotal = categoryhistory.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(categoryhistory, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = CategoryHistorySerializer(object_list,many = True)

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data,
    }

    return JsonResponse(json_res)


def get_product_stock(request):
    # productcategories = ProductCategory.objects.raw('call get_productcategory(@recordsTotal,%s,%s,%s,%s)',[request.GET['draw'],3,request.GET['categoryname'],request.GET['shortcode']])
    # data = [model_to_dict(productcategory) for productcategory in productcategories]
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    stocks = Stock.objects.filter(product__productid = request.GET['productid'])
    recordsTotal = stocks.count()
    recordsFiltered = recordsTotal

    page =  start / length + 1

    paginator = Paginator(stocks, length)

    try:
        object_list = paginator.page(page).object_list
    except PageNotAnInteger:
        object_list = paginator.page(draw).object_list
    except EmptyPage:
        object_list = paginator.page(paginator.num_pages).object_list

    data = ProductStockSerializer(object_list,many = True)

    # data = [model_to_dict(stock) for stock in object_list]

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data,
    }

    return JsonResponse(json_res)

def save_product_category(request):
    success = True
    message = 'success'

    try:
        if request.POST:
            user = request.user
            categoryid = int(request.POST['categoryid'])
            list_changes =[]

            ####UPDATE
            if (categoryid>0):
                category = ProductCategory.objects.get(pk = categoryid)

                if (category.shortcode != request.POST['shortcode'].strip()):
                    history = ProductCategoryHistory(category = category,oldvalue = category.shortcode,newvalue = category.shortcode,remarks= 'Updated short code from '+category.shortcode+' to '+request.POST['shortcode'].strip(),user = user)
                    list_changes.append(history)
                if (category.categoryname != request.POST['categoryname'].strip()):
                    history = ProductCategoryHistory(category = category,oldvalue = category.categoryname,newvalue = category.categoryname,remarks= 'Updated category name from '+category.categoryname+' to '+request.POST['categoryname'].strip(),user = user)
                    list_changes.append(history)

                form = SaveProductCategoryForm(request.POST,instance=category)
                if form.is_valid():
                    print('categoryname changed: '+category.categoryname+' to '+request.POST['categoryname'])

                    
                    
                    category.shortcode = request.POST['shortcode'].strip()
                    category.categoryname = request.POST['categoryname'].strip()
                    category.save()
                else:
                    success = False
                    message = [(k, v[0]) for k, v in form.errors.items()]
            ####CREATE
            else:
                form = SaveProductCategoryForm(request.POST)
                # save productcategory
                productcategory= ProductCategory.objects.create(
                    shortcode= request.POST['shortcode'],
                    categoryname= request.POST['categoryname']
                )           

                history = ProductCategoryHistory(category = productcategory,remarks = 'Create new category: '+productcategory.categoryname,user = user)
                list_changes.append(history)
                
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

def save_product(request):
    success = True
    message = 'success'
    if request.POST:
        try:
            user = request.user
            productid = int(request.POST['productid'])
            productcategory = ProductCategory.objects.get(pk=request.POST['categoryid'])
            list_changes = []
            
            # # # UPDATE
            if (productid>0):
                print(productid)
                product = Product.objects.get(productid = productid)
                #check field changes
                if (product.sku != request.POST['sku'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.sku,newvalue = request.POST['sku'].strip(),remarks= 'Updated sku from '+product.sku+' to '+request.POST['sku'].strip(),user = user)
                    list_changes.append(history)
                if (product.productname != request.POST['productname'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.productname,newvalue = request.POST['productname'].strip(),remarks= 'Updated product name from '+product.productname+' to '+request.POST['productname'].strip(),user = user)
                    list_changes.append(history)
                if (product.shortcode != request.POST['shortcode'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.shortcode,newvalue = request.POST['shortcode'].strip(),remarks= 'Updated short code from '+product.shortcode+' to '+request.POST['shortcode'].strip(),user = user)
                    list_changes.append(history)
                if (product.description != request.POST['description'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.description,newvalue = request.POST['description'].strip(),remarks= 'Updated description from '+product.description+' to '+request.POST['description'].strip(),user = user)
                    list_changes.append(history)
                if (product.barcode != request.POST['barcode'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.barcode,newvalue = request.POST['barcode'].strip(),remarks= 'Updated barcode from '+product.barcode+' to '+request.POST['barcode'].strip(),user = user)
                    list_changes.append(history)
                if (product.category.categoryid != int(request.POST['categoryid'])):
                    history = ProductHistory(product = product,oldvalue = product.category.categoryid,newvalue = str(request.POST['categoryid']).strip(),remarks= 'Updated product category from '+ str(product.category.categoryid)+' to '+request.POST['categoryid'].strip(),user = user)
                    list_changes.append(history)
                if (str(product.status) != request.POST['status'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.status,newvalue = str(request.POST['status']).strip(),remarks= 'Updated barcode from '+str(product.status)+' to '+request.POST['status'].strip(),user = user)
                    list_changes.append(history)
                if (str(product.brand) != request.POST['brand'].strip()):
                    history = ProductHistory(product = product,oldvalue = product.brand,newvalue = str(request.POST['brand']).strip(),remarks= 'Updated brand from '+str(product.brand)+' to '+request.POST['brand'].strip(),user = user)
                    list_changes.append(history)

                #add form instance
                form = SaveProductForm(request.POST,instance=product)
                if form.is_valid():
                    
                    product.sku= request.POST['sku']
                    product.productname= request.POST['productname']
                    product.shortcode= request.POST['shortcode']
                    product.description= request.POST['description']
                    product.barcode= request.POST['barcode']
                    product.category= productcategory
                    product.status= request.POST['status']
                    product.brand= request.POST['brand']
                    product.save()
                else:
                    success = False
                    # message = str(form.errors.as_json())
                    message = [(k, v[0]) for k, v in form.errors.items()]
                
            # # # CREATE
            else:
                form = SaveProductForm(request.POST)
                if form.is_valid():
                    product= Product.objects.create(
                            sku= request.POST['sku'],
                            productname= request.POST['productname'],
                            shortcode= request.POST['shortcode'],
                            description= request.POST['description'],
                            barcode= request.POST['barcode'],
                            category= productcategory,
                            status= request.POST['status'],
                            brand= request.POST['brand']
                        )
                    history = ProductHistory(product = product,remarks = 'Create new product: '+product.productname,user = user)
                    list_changes.append(history)
                else:
                    success = False
                    # message = str(form.errors.as_json())
                    message = [(k, v[0]) for k, v in form.errors.items()]
                
            #save history
            for change in list_changes:
                change.save()

            #save stores
            stores = Store.objects.all()

            for store in stores:
                if Stock.objects.filter(store__storeid = store.storeid, product__productid = product.productid).exists():
                    print('Stock found')
                else:
                    print('Stock not found')
                    list_changes =[]

                    stock = Stock(threshold = 10, cost = 0, price = 0, discountprice = 0,stock =0)
                    stock.store = store
                    stock.product = product

                    stock.save()

                    history = StockHistory(stock = stock,oldvalue = '',newvalue = '',remarks= store.storename+': Created stock for '+product.productname,user = user,product = product)
                    list_changes.append(history)

        
        except IntegrityError as e:
            message = e.message
            success = False
        except Exception as e:
            message = str(e)
            success = False

    json_res={
        'success': success,
        'message':message
    }
    
    return JsonResponse(json_res)

def save_product_stock(request):
    success = True
    message = 'success'
    if request.POST:
        user = request.user
        stocks = json.loads(request.POST["data"])
        # print('Stocks: '+stocks)

        try:
            for stock in stocks:
                list_changes = []
                stockid = stock['stockid']
                savestock = Stock.objects.get(stockid = stockid)
                product = savestock.product

                if (savestock.threshold != float(stock['threshold'])):
                    history = StockHistory(stock = savestock,oldvalue = savestock.threshold,newvalue = stock['threshold'],remarks= savestock.store.storename+ ': Manual Update of threshold from '+str(savestock.threshold)+' to '+str(stock['threshold']),user = user,product = product)
                    list_changes.append(history)
                if (savestock.stock != float(stock['stock'])):
                    history = StockHistory(stock = savestock,oldvalue = savestock.stock,newvalue = stock['stock'],remarks= savestock.store.storename+ ': Manual Update of stock from '+str(savestock.stock)+' to '+str(stock['stock']),user = user,product = product)
                    list_changes.append(history)
                if (savestock.price != float(stock['price'])):
                    history = StockHistory(stock = savestock,oldvalue = savestock.price,newvalue = stock['price'],remarks= savestock.store.storename+ ': Manual Update of price from '+str(savestock.price)+' to '+str(stock['price']),user = user,product = product)
                    list_changes.append(history)
                if (savestock.discountprice != float(stock['discountprice'])):
                    history = StockHistory(stock = savestock,oldvalue = savestock.discountprice,newvalue = stock['discountprice'],remarks= savestock.store.storename+ ': Manual Update of discountprice from '+str(savestock.discountprice)+' to '+str(stock['discountprice']),user = user,product = product)
                    list_changes.append(history)
                
                savestock.threshold = stock['threshold']
                savestock.stock = stock['stock']
                savestock.price = stock['price']
                savestock.discountprice = stock['discountprice']

                savestock.save()

                #save history
                for change in list_changes:
                    change.save()

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