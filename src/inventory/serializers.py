from rest_framework import serializers
from inventory.models import Product, ProductCategory,Stock,ProductHistory,StockHistory


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model =ProductCategory
        fields = ['categoryid','categoryname']

class ProductSerializer(serializers.ModelSerializer):
    storeid = serializers.CharField(source='store.storeid')
    storename = serializers.CharField(source='store.storename')
    categoryid = serializers.CharField(source='product.category.categoryid')
    categoryname = serializers.CharField(source='product.category.categoryname')
    productid = serializers.CharField(source='product.productid')
    sku = serializers.CharField(source='product.sku')
    barcode = serializers.CharField(source='product.barcode')
    shortcode = serializers.CharField(source='product.shortcode')
    productname = serializers.CharField(source='product.productname')
    description = serializers.CharField(source='product.description')
    status = serializers.CharField(source='product.status')
    brand = serializers.CharField(source='product.brand')
    class Meta:
        model =Stock
        fields = ['stockid','storeid','productid','sku','shortcode','productname','description','barcode','status','stock','price','discountprice','categoryname','storename','categoryid','brand']

class ProductDetailsSerializer(serializers.ModelSerializer):
    categoryid = serializers.CharField(source='category.categoryid')
    categoryname = serializers.CharField(source='category.categoryname')
    class Meta:
       
        model =Product
        fields = ['productid','sku','shortcode','productname','description','barcode','status','categoryname','categoryid','brand']

class ProductStockSerializer(serializers.ModelSerializer):
    storeid = serializers.CharField(source='store.storeid')
    storename = serializers.CharField(source='store.storename')
    productid = serializers.CharField(source='product.productid')
    class Meta:
        model =Stock
        fields = ['stockid','productid','storeid','storename','stock','threshold','price','discountprice']


class ProductHistorySerializer(serializers.ModelSerializer):
    productid = serializers.CharField(source='product.productid')
    lastname = serializers.CharField(source='user.lastname')
    firstname = serializers.CharField(source='user.firstname')
    class Meta:
        model =ProductHistory
        fields = ['historyid','productid','oldvalue','newvalue','remarks','lastname','firstname','date']

class StockHistorySerializer(serializers.ModelSerializer):
    productid = serializers.CharField(source='product.productid')
    lastname = serializers.CharField(source='user.lastname')
    firstname = serializers.CharField(source='user.firstname')
    class Meta:
        model =StockHistory
        fields = ['historyid','productid','oldvalue','newvalue','remarks','lastname','firstname','date']

class CategoryHistorySerializer(serializers.ModelSerializer):
    categoryid = serializers.CharField(source='category.categoryid')
    lastname = serializers.CharField(source='user.lastname')
    firstname = serializers.CharField(source='user.firstname')
    class Meta:
        model =StockHistory
        fields = ['historyid','categoryid','oldvalue','newvalue','remarks','lastname','firstname','date']