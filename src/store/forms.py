from django import forms

from store.models import Store

class SaveStoreForm(forms.ModelForm):
    storename = forms.CharField(max_length=50)
    storeno = forms.CharField(max_length=50)
    status = forms.IntegerField()
    typeid = forms.IntegerField()
    address = forms.CharField(max_length=200)
    class Meta:
        model = Store
        fields = ('storename','storeno','status','typeid','address')