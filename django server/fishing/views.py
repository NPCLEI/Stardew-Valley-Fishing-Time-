from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def fishing(rqst):
    return render(rqst,'fishing.html')