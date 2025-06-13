from django.shortcuts import render

# Create your views here.
def pomo_home(r):
    return render(r , "pomodoro/pomo_home.html")