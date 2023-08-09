from django import forms

from inventory.models import Product
from order.models import Order,OrderItem,OrderPayment

class SaveOrderForm(forms.ModelForm):
    customername = forms.CharField(max_length=100,required=False)
    customeraddress = forms.CharField(max_length=250,required=False)
    customertin = forms.CharField(max_length=20,required=False)
    salesinvoice = forms.CharField(max_length=20)
    referenceno = forms.CharField(max_length=20)
    totalamount = forms.FloatField()
    amounttendered = forms.FloatField()
    orderdate = forms.DateField()
    class Meta:
        model = Order
        fields = ('salesinvoice','referenceno','customername','customeraddress','totalamount','amounttendered','orderdate')