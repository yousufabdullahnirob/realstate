from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from .models import Apartment
from .serializers import RegisterSerializer

# Create your views here.

def login_view(request):
    return render(request, 'core/login.html')

def apartment_list_view(request):
    apartments = Apartment.objects.all()
    return render(request, 'core/apartment_list.html', {'apartments': apartments})

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class CustomLoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user = None
        try:
            u = User.objects.get(username=username)
            if u.check_password(password):
                user = u
        except User.DoesNotExist:
            pass

        if user:
            return Response({"message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
