from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from store.models import Store

# Create your models here.

class MyAccountManager(BaseUserManager):
    def create_user(self,email,lastname,firstname,username,password=None):
        if not email:
            return ValueError("Invalid email address")
        if not username:
            return ValueError("Invalid username")
        if not lastname:
            return ValueError("Invalid lastname")
        if not firstname:
            return ValueError("Invalid firstname")
        
        user = self.model(
            email = self.normalize_email(email),
            username=username,
            lastname=lastname,
            firstname=firstname
            )

        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self,email,lastname,firstname,username,password):
        user = self.create_user(
            email = self.normalize_email(email),
            username=username,
            password = password,
            lastname = lastname,
            firstname = firstname
            )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self.db)
        return user


class Account(AbstractBaseUser):
    email               =models.EmailField(verbose_name="email",max_length=60,unique=True)
    username            =models.CharField(max_length=30,unique=True)
    date_joined         =models.DateTimeField(verbose_name="date_joined",auto_now_add=True)
    last_login          =models.DateTimeField(verbose_name="last_login",auto_now_add=True)
    is_admin            =models.BooleanField(default=False)
    is_active           =models.BooleanField(default=True)
    is_staff            =models.BooleanField(default=False)
    is_superuser        =models.BooleanField(default=False)
    lastname            =models.CharField(max_length=30)
    firstname           =models.CharField(max_length=30)
    # shop                =models.IntegerField(default=1)
    store = models.ForeignKey(Store, on_delete=models.SET_DEFAULT,null=False,default=1)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS =['username','lastname','firstname']

    objects = MyAccountManager()

    def __str__(self) -> str:
        return self.email
    
    def has_perm(self,perm,obj=None):
        return self.is_admin
    
    def has_module_perms(self,app_label):
        return True
    
