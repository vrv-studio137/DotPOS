from django.db import models
from django.utils.timezone import now
from account.models import Account
from inventory.models import Product
from store.models import Store

# Create your models here.
class Order(models.Model):
    orderid = models.AutoField(primary_key=True)
    invoiceno= models.CharField(max_length=100,default='',unique=True)
    referenceno= models.CharField(max_length=100,default='',unique=True)
    store = models.ForeignKey(Store, on_delete=models.SET_DEFAULT,null=False,default=1)
    customername = models.CharField(max_length=100,default='')
    customeraddress = models.CharField(max_length=250,default='')
    customertin = models.CharField(max_length=20,default='')
    paymentstatus= models.IntegerField(default=0) #1 = unpaid, 2 = paid, 3 = void
    orderstatus= models.IntegerField(default=0) #0 = preparing, 1 = reserved, 2 = complete
    orderdate = models.DateTimeField(default=now)
    dateadded = models.DateTimeField(default=now)
    totalamount= models.FloatField(default=0)
    balance= models.FloatField(default=0)
    # amounttendered= models.FloatField(default=0)

    class Meta:
        db_table="tblOrder"

class OrderItem(models.Model):
    orderitemid = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.SET_DEFAULT,null=False,default=0)
    product = models.ForeignKey(Product, on_delete=models.SET_DEFAULT,null=False,default=1)
    dateadded = models.DateTimeField(default=now)
    quantity =  models.FloatField(default=0)
    unitprice= models.FloatField(default=0)
    # amounttendered= models.FloatField(default=0)
    
    class Meta:
        db_table="tblOrderItem"

class OrderPayment(models.Model):
    paymentid = models.AutoField(primary_key=True)
    Order = models.ForeignKey(Order, on_delete=models.SET_DEFAULT,null=False,default=0)
    dateadded = models.DateTimeField(default=now)
    amount= models.FloatField(default=0)
    amounttendered= models.FloatField(default=0)
    class Meta:
        db_table="tblOrderPayment"

class OrderHistory(models.Model):
    historyid = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.SET_DEFAULT,null=False,default=0)
    oldvalue = models.CharField(max_length=50,default='')
    newvalue = models.CharField(max_length=50,default='')
    remarks = models.CharField(max_length=200,default='')
    user = models.ForeignKey(Account, on_delete=models.SET_DEFAULT,null=False,default=1)
    date = models.DateTimeField(default=now)
    class Meta:
        db_table="tblorderhistory"