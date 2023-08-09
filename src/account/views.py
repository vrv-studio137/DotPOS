from django.shortcuts import render, redirect
from django.contrib.auth import login,authenticate,logout
from account.forms import AccountAuthenticationForm

# Create your views here.

def logout_view(request):
    logout(request)
    return redirect('login')

def login_view(request):
    context={}

    user = request.user
    if user.is_authenticated:
        return redirect('products')
    
    if request.POST:
        form = AccountAuthenticationForm(request.POST)
        if form.is_valid():
            email = request.POST['email']
            password = request.POST['password']
            print('form valid')
            user = authenticate(email = email, password = password)
            if user:
                login(request,user)
                return redirect('products')
    else:
        form = AccountAuthenticationForm()

    context['login_form'] = form
    print(context)
    return render(request, 'account/login.html',context)