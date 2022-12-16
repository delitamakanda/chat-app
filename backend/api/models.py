import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = None
    email = models.EmailField(_("e-mail address"), unique=True, max_length=255, blank=True, null=True)
    phone = models.CharField(_("phone number"), unique=True, max_length=20)
    display_name = models.CharField(_("display name"), max_length=255, blank=True, null=True)
    is_active = models.BooleanField(_("active"), default=True)
    is_staff = models.BooleanField(_("staff status"), default=False)
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)


    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.phone

    def get_short_name(self):
        return self.display_name


class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="rel_to_set")
    user_from = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="rel_from_set")
    username = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)
    display_name = models.CharField(max_length=255)
    conversation_id = models.UUIDField(editable=False, blank=True, null=True)
    last_active_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-last_active_at"]

    def __str__(self):
        return self.phone_number

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.phone_number
        if not self.display_name:
            self.display_name = self.phone_number
        return super(Contact, self).save(*args, **kwargs)

CustomUser.add_to_class('following', models.ManyToManyField('self', through=Contact, related_name='followers', symmetrical=False))

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact_id = models.UUIDField(editable=False, blank=True, null=True)
    group_id = models.UUIDField(editable=False, blank=True, null=True)
    pinned_message_id = models.UUIDField(blank=True, null=True, unique=True)
    is_pinned = models.BooleanField(default=False)
    is_muted = models.BooleanField(default=False)
    last_active_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    archived_at = models.DateTimeField(blank=True, null=True, editable=False)

    def __str__(self):
        return str(self.id)


class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message_id = models.UUIDField(editable=False, blank=True, null=True)
    filename = models.CharField(max_length=255)
    file_url = models.CharField(max_length=255)
    file_type = models.CharField(max_length=255)
    file_size = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_url


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation_id = models.UUIDField(editable=False, blank=True, null=True)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    reactions = models.TextField(blank=True, null=True)
    attachements = models.ManyToManyField(Attachment, related_name="attachements")
    read_at = models.DateTimeField(blank=True, null=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)
    conversation_id = models.UUIDField(editable=False, blank=True, null=True)
    contacts = models.ManyToManyField(Contact, related_name="groups")
    created_at = models.DateTimeField(auto_now_add=True)
    archived_at = models.DateTimeField(blank=True, null=True, editable=False)

    def __str__(self):
        return self.name

