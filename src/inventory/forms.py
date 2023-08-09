from django import forms

from inventory.models import ProductCategory
from inventory.models import Product

class SaveProductCategoryForm(forms.ModelForm):
    shortcode = forms.CharField(max_length=10)
    categoryname = forms.CharField(max_length=50)

    class Meta:
        model = ProductCategory
        fields = ('shortcode','categoryname')

    # def clean_categoryname(self):
    #     categoryname = self.cleaned_data['categoryname']
    #     if self.is_valid():
    #         try:
    #             category = ProductCategory.objects.exclude(pk=self.instance.pk)
    #         except ProductCategory.DoesNotExist:
    #             return categoryname
    #         raise forms.ValidationError('Category name is already in use.')
            
class SaveProductForm(forms.ModelForm):
    sku = forms.CharField(max_length=20)
    shortcode = forms.CharField(max_length=10)
    productname = forms.CharField(max_length=50)
    categoryid = forms.IntegerField()
    description = forms.CharField(max_length=50)
    barcode = forms.CharField(max_length=20)
    brand = forms.CharField(max_length=100)
    status= forms.IntegerField()
    class Meta:
        model = Product
        fields = ('sku','shortcode','productname','categoryid','description','barcode','status','brand')

    # def clean_sku(self):
    #     sku = self.cleaned_data['sku']
    #     if self.is_valid():
    #         try:
    #             product = Product.objects.exclude(pk=self.instance.pk)
    #         except Product.DoesNotExist:
    #             return sku
    #         raise forms.ValidationError('SKU '+sku+' is already in use.')