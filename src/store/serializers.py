from rest_framework import serializers
from store.models import Store,StoreType,StoreHistory

class StoreSerializer(serializers.ModelSerializer):
    storetype = serializers.CharField(source='storetype.typename')
    typeid = serializers.CharField(source='storetype.typeid')
    class Meta:
        model =Store
        fields = ['storeid','storename','storeno','status','storetype','typeid','address','dateadded']
