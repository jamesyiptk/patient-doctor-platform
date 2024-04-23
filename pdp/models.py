from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    CATEGORY_CHOICES = [
        ('1', 'General'),
        ('2', 'Internal medicine'),
        ('3', 'Surgical'),
        ('4', 'Stomatology'),
        ('5', 'Dermatology'),
        ('6', 'Obstetrics and Gynecology'),
    ]
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES,unique=True)


class Post(models.Model):
    title = models.CharField(max_length=255,default="general question")
    author = models.ForeignKey(User, on_delete=models.CASCADE,default='1')
    content = models.TextField(default='Empty article')
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,default='General')

    def __str__(self):
        return f'id={self.id}, content="{self.content}"'


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.user.username
    user = models.OneToOneField(User, default=None, on_delete=models.PROTECT)


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=16, blank=True)
    specialty = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    hospital = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to='doctor_photos', blank=True)  # New field

    def __str__(self):
        return self.user.username


class Comment(models.Model):
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE,default='1')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.title

    @property
    def category_name(self):
        return self.category.get_name_display()  # Assuming 'name' has choices and is not a ForeignKey.