from django import forms
from django.contrib.auth import authenticate

from account.models import Account

class AccountAuthenticationForm(forms.Form):
    email = forms.EmailField(label = 'email',widget=forms.TextInput)
    password = forms.CharField(label = 'password',widget=forms.PasswordInput)

    class Meta:
        model = Account
        fields = ('email','password')

    def clean(self):
        if self.is_valid():
            email = self.cleaned_data['email']
            password = self.cleaned_data['password']
            if not authenticate(email = email, password = password):
                raise forms.ValidationError('Invalid login credentials',code='invalid')
