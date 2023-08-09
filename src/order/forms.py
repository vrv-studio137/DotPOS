from django import forms
from order.models import Order,OrderPayment

class SaveOrderForm(forms.ModelForm):
    referenceno = forms.CharField(max_length=100)
    customername = forms.CharField(max_length=100)
    customeraddress = forms.CharField(max_length=200)
    customertin = forms.CharField(max_length=20)
    class Meta:
        model = Order
        fields = ('referenceno','customername','customeraddress','customertin')

class SavePaymentForm(forms.ModelForm):
    amount = forms.FloatField()
    dateadded = forms.DateField()
    class Meta:
        model = OrderPayment
        fields = ('amount','dateadded')