from django.shortcuts import render,redirect
from store.models import Store,StoreType,StoreHistory
from store.serializers import StoreSerializer
from store.forms import SaveStoreForm
from django.db import IntegrityError
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Create your views here.
def stores_view(request):
    user = request.user

    if not user.is_authenticated:
        return redirect('login')
    
    args = {}
    args['PAGE_HEADER'] = 'Stores'
    args['PAGE_NAME'] = 'stores'
    args['PAGE_BREADCRUMBS'] = [
        {
            'label':'Stores',
            'link':'/stores',
            'active':'active',
            'class':'',
        }
    ]

    storetypes = StoreType.objects.all()
    args['storetypes'] = storetypes

    return render(request, 'stores/stores.html',args)

def get_store(request):
    recordsTotal = 0
    draw = int(request.GET['draw'])
    start = int(request.GET['start'])
    length = int(request.GET['length'])

    # sortby = '-product__productname'

    # match int(request.GET['sortby']):
    #     case 0:
    #         sortby = 'product__productname'
    #     case 1:
    #         sortby = '-stock'
    #     case 2:
    #         sortby = '-product__dateadded'
    #     case _:
    #         sortby = 'product__productname'

    products = Store.objects.filter(storename__icontains =request.GET['storename'],storeno__icontains =request.GET['storeno'])
    
    storetype = int(request.GET['storetype'])
    if storetype > 0:
        products = products.filter(storetype__typeid = storetype)

            


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

    data = StoreSerializer(object_list,many = True)

    json_res={
        "draw": draw,
        "recordsTotal": recordsTotal,
        "recordsFiltered": recordsFiltered,
        'data':data.data
    }

    return JsonResponse(json_res)

def get_store_details(request):

    store = Store.objects.filter(storeid = request.GET['storeid'])

    data = StoreSerializer(store,many = True)

    json_res={
        'data':data.data[0]
    }

    return JsonResponse(json_res);

def save_store(request):
    success = True
    message = 'success'
    if request.POST:
        try:
            user = request.user
            storeid = int(request.POST['storeid'])
            storetype = StoreType.objects.get(pk=int(request.POST['typeid']))
            list_changes = []
            
            # # # UPDATE
            if (storeid>0):
                store = Store.objects.get(storeid = storeid)
                #check field changes
                if (store.storename != request.POST['storename'].strip()):
                    history = StoreHistory(store = store,oldvalue = store.storename,newvalue = request.POST['sku'].strip(),remarks= 'Updated store name from '+store.storename+' to '+request.POST['storename'].strip(),user = user)
                    list_changes.append(history)
                if (store.storeno != request.POST['storeno'].strip()):
                    history = StoreHistory(store = store,oldvalue = store.storeno,newvalue = request.POST['storeno'].strip(),remarks= 'Updated store no name from '+store.storeno+' to '+request.POST['storeno'].strip(),user = user)
                    list_changes.append(history)
                if (store.status != request.POST['status'].strip()):
                    history = StoreHistory(store = store,oldvalue = store.status,newvalue = request.POST['status'].strip(),remarks= 'Updated status from '+str(store.status)+' to '+str(request.POST['status']),user = user)
                    list_changes.append(history)
                if (store.storetype != int(request.POST['typeid'].strip())):
                    history = StoreHistory(store = store,oldvalue = store.storetype,newvalue = request.POST['typeid'].strip(),remarks= 'Updated store type from '+str(store.storetype)+' to '+str(request.POST['typeid'].strip()),user = user)
                    list_changes.append(history)
                if (store.address != request.POST['address'].strip()):
                    history = StoreHistory(store = store,oldvalue = store.address,newvalue = request.POST['address'].strip(),remarks= 'Updated address from '+store.address+' to '+request.POST['address'].strip(),user = user)
                    list_changes.append(history)
                

                #add form instance
                form = SaveStoreForm(request.POST,instance=store)
                if form.is_valid():
                    
                    store.storename= request.POST['storename']
                    store.storeno= request.POST['storeno']
                    store.status= request.POST['status']
                    store.storetype= storetype
                    store.address= request.POST['address']
                    store.save()
                else:
                    success = False
                    # message = str(form.errors.as_json())
                    message = [(k, v[0]) for k, v in form.errors.items()]
                
            # # # CREATE
            else:

                form = SaveStoreForm(request.POST)
                if form.is_valid():
                    print('storetype: '+storetype.typename)

                    store= Store.objects.create(
                            storename= request.POST['storename'],
                            storeno= request.POST['storeno'],
                            status= request.POST['status'],
                            address= request.POST['address'],
                            storetype= storetype,
                        )
                    history = StoreHistory(store = store,remarks = 'Create new store: '+store.storename,user = user)
                    list_changes.append(history)
                else:
                    success = False
                    # message = str(form.errors.as_json())
                    message = [(k, v[0]) for k, v in form.errors.items()]
                
            #save history
            for change in list_changes:
                change.save()

        
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
