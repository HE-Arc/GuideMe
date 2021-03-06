from django.contrib import admin
from django.urls import include, path
from guidemeapp import views

urlpatterns = [
    path('', include('guidemeapp.urls')),
    path('admin/', admin.site.urls),
]
