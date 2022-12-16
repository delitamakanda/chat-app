from .models import CustomUser
from django.db.models import Q

class EmailAuthenticationBackend(object):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            qs = CustomUser.objects.filter(
                Q(email__iexact=username) | Q(phone__iexact=username)
            ).distinct()
            if qs.count() == 1:
                user_obj = qs.first()
                if user_obj.check_password(password):
                    return user_obj
        except CustomUser.DoesNotExist:
            return None

    def get_user(self, phone_number):
        try:
            return CustomUser.objects.get(phone=phone_number)
        except CustomUser.DoesNotExist:
            return None

    def clean_phone_number(self, phone_number):
        phone_number = self.cleaned_data['phone_number']
        if CustomUser.objects.filter(phone=phone_number).exists():
            raise forms.ValidationError("Phone number already exists")
        return phone_number

    def clean_email(self, email):
        email = self.cleaned_data['email']
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists")
        return email