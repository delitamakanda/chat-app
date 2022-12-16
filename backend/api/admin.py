from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Contact, Conversation, Message, Attachment, Group

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'phone', 'display_name', 'is_staff', 'is_active',]
    list_filter = ('is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'display_name', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'display_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'phone',)
    ordering = ('email', 'phone',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Contact)
admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Attachment)
admin.site.register(Group)

