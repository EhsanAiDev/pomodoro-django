from django.contrib import admin
from django.urls import path
from pomodoro_app.views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path("" , pomo_home , name="pomo_home")
]
