from django.test import TestCase
from django.contrib.auth import get_user_model

class UserModelTestCase(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            phone='0606747541', password='testpass')
        self.assertEqual(user.phone, '0606747541')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(phone='')
        with self.assertRaises(ValueError):
            User.objects.create_user(phone='', password='testpass')

    def test_create_superuser(self):
        User = get_user_model()
        user = User.objects.create_superuser(
            phone='0606747541', password='testpass')
        self.assertEqual(user.phone, '0606747541')
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(phone='0606747541', password='testpass', is_superuser=False)