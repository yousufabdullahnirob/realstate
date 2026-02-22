from django.shortcuts import render
from rest_framework import generics
from .models import Apartment
from .serializers import ApartmentSerializer

# Create your views here.

def apartment_list_view(request):
    apartments = Apartment.objects.all()
    return render(request, 'core/apartment_list.html', {'apartments': apartments})

class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
