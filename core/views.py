from rest_framework import status, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Apartment, User, Project
from .serializers import ApartmentSerializer, RegistrationSerializer, LoginSerializer, UserSerializer, ProjectSerializer
from .permissions import IsAdminRole

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "User registered successfully",
            "user_id": user.id,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class CustomLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        required_role = serializer.validated_data.get('role')

        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Authenticate
        user = authenticate(username=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if active
        if not user.is_active:
            return Response({"detail": "Account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check role if provided
        if required_role and user.role != required_role:
            return Response({"detail": f"Unauthorized role. Access denied for {required_role}."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate Tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['created_at', 'launch_date']

    def perform_create(self, serializer):
        serializer.save()

class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_destroy(self, instance):
        # Soft delete: set is_active = False
        if instance.apartments.count() > 0:
            # Business logic: Cannot delete if apartments exist
            from rest_framework import serializers
            raise serializers.ValidationError({"detail": "Cannot delete project with existing apartments."})
        
        instance.is_active = False
        instance.save()

class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
