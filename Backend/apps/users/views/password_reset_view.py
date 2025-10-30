from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt  # 👈 THÊM
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from ..models import User, PasswordResetOTP
from ..serializers.password_reset_serializer import (
    ForgotPasswordSerializer, 
    VerifyOTPSerializer,
    ResetPasswordSerializer
)
@csrf_exempt  # 👈 THÊM DÒNG NÀY

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Gửi OTP đến email để reset password"""
    serializer = ForgotPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Xóa các OTP cũ của email này
        PasswordResetOTP.objects.filter(
            email=email, 
            is_used=False,
            expires_at__gt=timezone.now()
        ).update(is_used=True)
        
        # Tạo OTP mới
        otp = PasswordResetOTP.objects.create(email=email)
        
        # TODO: Gửi email với OTP (tạm thời log ra console)
        print(f"🔐 OTP for {email}: {otp.otp_code}")
        
        return Response({
            "message": "Mã OTP đã được gửi đến email của bạn.",
            "expires_at": otp.expires_at,
            "debug_otp": otp.otp_code  # Chỉ để test, xóa trong production
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt  # 👈 THÊM
@permission_classes([AllowAny])
def verify_otp(request):
    """Xác thực OTP"""
    serializer = VerifyOTPSerializer(data=request.data)
    
    if serializer.is_valid():
        otp = serializer.validated_data['otp']
        
        return Response({
            "message": "Mã OTP hợp lệ.",
            "email": otp.email,
            "expires_at": otp.expires_at
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt  # 👈 THÊM
@permission_classes([AllowAny])
def reset_password(request):
    """Reset password với OTP đã xác thực"""
    serializer = ResetPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']
        otp = serializer.validated_data['otp']
        
        try:
            # Tìm user
            user = User.objects.get(email=email)
            
            # Đổi password
            user.set_password(new_password)
            user.save()
            
            # Đánh dấu OTP đã sử dụng
            otp.mark_used()
            
            # Xóa tất cả OTP cũ của user này
            PasswordResetOTP.objects.filter(
                email=email, 
                is_used=False
            ).update(is_used=True)
            
            return Response({
                "message": "Đổi mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới."
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {"error": "User không tồn tại."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)