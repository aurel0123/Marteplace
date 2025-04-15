from django.contrib import admin
from .models import *
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()

# Supprimer le modèle de groupe de l'administrateur. Nous ne l'utilisons pas.

class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email' ,'username','type_user', 'is_staff', 'is_active',)
    list_filter = ('email','username','is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'username' ,'phone','type_user', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions',)}),   #'is_customer' , 'is_seller'
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'type_user', 'username' , 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)




#admin.site.unregister(User)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Vendeuradditional)
admin.site.register(Categorie)
