from django.contrib import admin
from .models import Game,Image,Review,Cart,CartItem,Order,OrderItem

# Register your models here.

class ImageAdmin(admin.ModelAdmin):
    list_display = ('game', 'url')
    list_per_page =8 # No of records per page 
   
admin.site.register(Game)
admin.site.register(Image,ImageAdmin)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)






