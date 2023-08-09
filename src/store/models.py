from django.db import models
from django.utils.timezone import now
# from account.models import Account

# Create your models here.
class StoreType(models.Model):
    typeid = models.AutoField(primary_key=True)
    typename = models.CharField(max_length=50)

    class Meta:
        db_table="tblStoreType"

class Store(models.Model):
    storeid = models.AutoField(primary_key=True)
    storename = models.CharField(max_length=50)
    storeno = models.CharField(max_length=50,default='',unique=True)
    status = models.IntegerField(default=0) #1 = active, 2 = inactive
    storetype = models.ForeignKey(StoreType, on_delete=models.SET_DEFAULT,null=False,default=1)
    address = models.CharField(max_length=200,default='')
    dateadded = models.DateTimeField(default=now)

    class Meta:
        db_table="tblStore"

    def __str__(self) -> str:
        return self.storename + ' ('+self.storeno+')'

class StoreHistory(models.Model):
    historyid = models.AutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.SET_DEFAULT,null=False,default=0)
    oldvalue = models.CharField(max_length=50,default='')
    newvalue = models.CharField(max_length=50,default='')
    remarks = models.CharField(max_length=200,default='')
    user = models.ForeignKey('account.Account', on_delete=models.SET_DEFAULT,null=False,default=1)
    date = models.DateTimeField(default=now)

    class Meta:
        db_table="tblStoreHistory"