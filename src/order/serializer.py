from rest_framework import serializers
from order.models import Order,OrderItem,OrderPayment

class OrderSerializer(serializers.ModelSerializer):
    storeid = serializers.CharField(source='store.storeid')
    storename = serializers.CharField(source='store.storename')
    class Meta:
        model =Order
        fields = ['orderid','storeid','storename','invoiceno','referenceno','customername','totalamount','balance','orderstatus','dateadded','customeraddress','orderdate']

class OrderDetailsSerializer(serializers.ModelSerializer):
    storeid = serializers.CharField(source='store.storeid')
    storename = serializers.CharField(source='store.storename')
    class Meta:
        model =Order
        fields = ['orderid','storeid','storename','invoiceno','referenceno','customername','totalamount','balance','orderstatus','dateadded','customeraddress','customertin','orderdate']

class OrderItemSerializer(serializers.ModelSerializer):
    productname = serializers.CharField(source='product.productname')
    sku = serializers.CharField(source='product.sku')
    shortcode = serializers.CharField(source='product.shortcode')
    orderid = serializers.CharField(source='order.orderid')
    class Meta:
        model =OrderItem
        fields = ['orderid','orderitemid','quantity','unitprice','productname','sku','shortcode']

class PaymentSerializer(serializers.ModelSerializer):
    orderid = serializers.CharField(source='Order.orderid')
    class Meta:
        model =OrderPayment
        fields = ['orderid','amount','amounttendered','dateadded']
