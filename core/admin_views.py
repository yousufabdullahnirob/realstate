"""
Admin-only views for CSV exports, due date management, and advanced booking controls
"""
import csv
from datetime import datetime
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from .models import Booking, Apartment, Project, User
from .permissions import IsAdminRole


class AdminSetBookingDueDateView(APIView):
    """Admin endpoint to set final payment due date for a booking"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            due_date = request.data.get('final_payment_due_date')
            
            if not due_date:
                return Response(
                    {"error": "final_payment_due_date is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.final_payment_due_date = due_date
            booking.save()
            
            # Notify user
            from .models import Notification
            Notification.objects.create(
                user=booking.user,
                message=f"Final payment due date set to {due_date} for booking {booking.booking_reference}",
                type=Notification.Type.APPROVAL
            )
            
            return Response({
                "message": "Due date set successfully",
                "booking_id": booking.id,
                "due_date": booking.final_payment_due_date
            })
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class ApartmentsCSVExportView(APIView):
    """Export apartments data to CSV with project and status information"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        apartments = Apartment.objects.select_related('project').all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="apartments_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Title', 'Location', 'Project', 'Price (BDT)', 'Floor Area (sqft)',
            'Bedrooms', 'Bathrooms', 'Status', 'Approved', 'Total Views', 'Created At'
        ])
        
        for apt in apartments:
            writer.writerow([
                apt.id,
                apt.title,
                apt.location,
                apt.project.name if apt.project else 'N/A',
                f"{apt.price:,.0f}",
                apt.floor_area_sqft,
                apt.bedrooms,
                apt.bathrooms,
                apt.status,
                'Yes' if apt.is_approved else 'No',
                apt.total_views,
                apt.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


class ProjectsCSVExportView(APIView):
    """Export projects data to CSV with apartment counts and status"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        projects = Project.objects.prefetch_related('apartments').all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="projects_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Name', 'Location', 'Status', 'Total Units', 'Total Floors',
            'Available Units', 'Booked Units', 'Sold Units', 'Launch Date', 'Active'
        ])
        
        for proj in projects:
            available = proj.apartments.filter(status='available').count()
            booked = proj.apartments.filter(status='booked').count()
            sold = proj.apartments.filter(status='sold').count()
            
            writer.writerow([
                proj.id,
                proj.name,
                proj.location,
                proj.status,
                proj.total_units,
                proj.total_floors,
                available,
                booked,
                sold,
                proj.launch_date.strftime('%Y-%m-%d') if proj.launch_date else 'N/A',
                'Yes' if proj.is_active else 'No'
            ])
        
        return response


class BookingsCSVExportView(APIView):
    """Export bookings data to CSV with status, payments, and due dates"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        bookings = Booking.objects.select_related('user', 'apartment', 'apartment__project').all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="bookings_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Booking ID', 'Reference', 'Tenant Email', 'Apartment', 'Project',
            'Advance Amount (BDT)', 'Status', 'Transaction ID', 'Payment Received',
            'Due Date', 'Locked', 'Booking Date', 'Notes'
        ])
        
        for booking in bookings:
            notes = ''
            if booking.cancelled_by_admin:
                notes = f"Cancelled by admin: {booking.cancellation_reason}"
            
            writer.writerow([
                booking.id,
                booking.booking_reference,
                booking.user.email,
                booking.apartment.title,
                booking.apartment.project.name if booking.apartment.project else 'N/A',
                f"{booking.advance_amount:,.0f}",
                booking.status,
                booking.transaction_id or 'N/A',
                'Yes' if booking.transaction_id else 'No',
                booking.final_payment_due_date.strftime('%Y-%m-%d') if booking.final_payment_due_date else 'N/A',
                'Yes' if booking.is_locked else 'No',
                booking.booking_date.strftime('%Y-%m-%d %H:%M:%S'),
                notes
            ])
        
        return response


class SalesCSVExportView(APIView):
    """Export sales data to CSV with revenue breakdown"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        from .models import Sale
        sales = Sale.objects.select_related('apartment', 'buyer', 'booking').all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="sales_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Sale ID', 'Apartment', 'Buyer Email', 'Booking Reference',
            'Final Price (BDT)', 'Sale Date'
        ])
        
        for sale in sales:
            writer.writerow([
                sale.id,
                sale.apartment.title,
                sale.buyer.email,
                sale.booking.booking_reference if sale.booking else 'N/A',
                f"{sale.final_price:,.0f}",
                sale.sale_date.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


class AdminBookingCancelView(APIView):
    """Admin-only endpoint to force cancel a confirmed booking with reason"""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            reason = request.data.get('reason', 'Cancelled by admin')
            
            # Admin can cancel ANY booking
            booking.status = 'cancelled'
            booking.cancelled_by_admin = True
            booking.cancellation_reason = reason
            booking.is_locked = False  # Unlock so no security issues
            booking.save()
            
            # Revert apartment status
            apartment = booking.apartment
            if apartment.status == 'booked':
                apartment.status = 'available'
                apartment.save()
            
            # Notify user
            from .models import Notification
            Notification.objects.create(
                user=booking.user,
                message=f"Your booking {booking.booking_reference} has been cancelled by admin. Reason: {reason}",
                type=Notification.Type.APPROVAL
            )
            
            return Response({
                "message": "Booking cancelled by admin",
                "reason": reason
            })
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )
