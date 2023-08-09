from django.db import models
from rest_framework import serializers
from django.utils.timezone import now
from account.models import Account
from store.models import Store

# Create your models here.
class ProductCategory(models.Model):
    categoryid = models.AutoField(primary_key=True)
    shortcode = models.CharField(max_length=10)
    categoryname = models.CharField(max_length=50,unique=True)
    isactive= models.BooleanField(default=True)
    dateadded = models.DateTimeField(default=now)

    class Meta:
        db_table="tblProductCategory"
        

class Product(models.Model):
    productid = models.AutoField(primary_key=True)
    sku = models.CharField(max_length=20,unique=True)
    shortcode = models.CharField(max_length=20,default='')
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_DEFAULT,null=False,default=0)
    productname = models.CharField(max_length=50)
    description = models.CharField(max_length=100,default='')
    barcode = models.CharField(max_length=20,default='')
    status= models.IntegerField(default=0) #1 = active, 2 = inactive
    dateadded = models.DateTimeField(default=now)
    brand = models.CharField(max_length=100,default='')
    unit = models.CharField(max_length=50,default='pc')

    class Meta:
        db_table="tblProduct"

class Stock(models.Model):
    stockid = models.AutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.SET_DEFAULT,null=False,default=0)
    product = models.ForeignKey(Product, on_delete=models.SET_DEFAULT,null=False,default=0)
    threshold = models.IntegerField(default=0)
    cost = models.FloatField(default=0)
    price = models.FloatField(default=0)
    discountprice = models.FloatField(default=0)
    stock = models.FloatField(default=0)
    dateadded = models.DateTimeField(default=now)

    class Meta:
        db_table="tblProductStock"

class StockHistory(models.Model):
    historyid = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.SET_DEFAULT,null=False,default=1)
    stock = models.ForeignKey(Stock, on_delete=models.SET_DEFAULT,null=False,default=0)
    oldvalue = models.CharField(max_length=50,default='')
    newvalue = models.CharField(max_length=50,default='')
    remarks = models.CharField(max_length=200,default='')
    user = models.ForeignKey(Account, on_delete=models.SET_DEFAULT,null=False,default=1)
    date = models.DateTimeField(default=now)

    class Meta:
        db_table="tblProductStockHistory"

class ProductCategoryHistory(models.Model):
    historyid = models.AutoField(primary_key=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_DEFAULT,null=False,default=0)
    oldvalue = models.CharField(max_length=50,default='')
    newvalue = models.CharField(max_length=50,default='')
    remarks = models.CharField(max_length=200,default='')
    user = models.ForeignKey(Account, on_delete=models.SET_DEFAULT,null=False,default=1)
    date = models.DateTimeField(default=now)

    class Meta:
        db_table="tblProductCategoryHistory"

class ProductHistory(models.Model):
    historyid = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.SET_DEFAULT,null=False,default=0)
    oldvalue = models.CharField(max_length=50,default='')
    newvalue = models.CharField(max_length=50,default='')
    remarks = models.CharField(max_length=200,default='')
    user = models.ForeignKey(Account, on_delete=models.SET_DEFAULT,null=False,default=1)
    date = models.DateTimeField(default=now)

    class Meta:
        db_table="tblProductHistory"
    
