from django.contrib import admin
from django.urls import path

from promodo_app.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path("" , pro_home , name="pro_home")
]
