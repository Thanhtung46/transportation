from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import User, PasswordResetOTP

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email không tồn tại trong hệ thống.")
        return value

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp_code = serializers.CharField(max_length=6, required=True)
    
    def validate(self, attrs):
        email = attrs['email']
        otp_code = attrs['otp_code']
        
        try:
            otp = PasswordResetOTP.objects.get(
                email=email, 
                otp_code=otp_code,
                is_used=False
            )
            
            if otp.is_expired():
                raise serializers.ValidationError("Mã OTP đã hết hạn.")
            
            attrs['otp'] = otp
            return attrs
            
        except PasswordResetOTP.DoesNotExist:
            raise serializers.ValidationError("Mã OTP không hợp lệ.")  # 👈 SỬA Ở ĐÂY

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp_code = serializers.CharField(max_length=6, required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)
    
    def validate(self, attrs):
        # Check password match
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Mật khẩu mới không khớp."})
        
        # Verify OTP
        email = attrs['email']
        otp_code = attrs['otp_code']
        
        try:
            otp = PasswordResetOTP.objects.get(
                email=email, 
                otp_code=otp_code,
                is_used=False
            )
            
            if otp.is_expired():
                raise serializers.ValidationError("Mã OTP đã hết hạn.")  # 👈 VÀ Ở ĐÂY
            
            attrs['otp'] = otp
            return attrs
            
        except PasswordResetOTP.DoesNotExist:
            raise serializers.ValidationError("Mã OTP không hợp lệ.")  # 👈 VÀ Ở ĐÂY