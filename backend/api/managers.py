from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):

    """
    custom user model manager where email and phone is the unique user identifiers
    for authentication instead of usernames
    """
    def create_user(self, phone, password, **extra_fields):
        """
        create and save a user with the given email, phone and password
        """
        if not phone:
            raise ValueError(_('the phone must be set'))
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, phone, password, **extra_fields):
        """
        create and save a superuser with the given email, phone and password
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('superuser must have is_staff=True'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('superuser must have is_superuser=True'))
        return self.create_user(phone, password, **extra_fields)