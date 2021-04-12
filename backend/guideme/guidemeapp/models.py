from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
import os

def images_path():
    return r'./images' #‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·

class Type(models.Model):
    name = models.CharField(max_length=50)

class Activity(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.FilePathField(path=images_path())
    latitude = models.DecimalField(max_digits=7, decimal_places=5)
    longitude = models.DecimalField(max_digits=8, decimal_places=5)
    website = models.CharField(max_length=200, null=True)
    types = models.ManyToManyField(Type)

class Rating(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, default=None)
    note = models.IntegerField()
    comment = models.TextField()