from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from ..models import User, EmailVerification, PhoneVerification
from ..serializers import UserDetailSerializer, UserUpdateSerializer, EmailVerificationSerializer

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile"""
    if request.method == 'GET':
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserDetailSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_email_verification(request):
    """Send email verification code"""
    user = request.user
    
    # Delete existing verifications
    EmailVerification.objects.filter(user=user).delete()
    
    # Create new verification
    expires_at = timezone.now() + timedelta(hours=24)
    verification = EmailVerification.objects.create(
        user=user,
        email=user.email,
        expires_at=expires_at
    )
    
    # TODO: Send email with verification code
    # send_verification_email(user.email, verification.code)
    
    return Response({
        'message': 'Verification code sent to your email',
        'expires_at': expires_at
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email(request):
    """Verify email with code"""
    serializer = EmailVerificationSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        
        try:
            verification = EmailVerification.objects.get(
                user=request.user,
                email=email,
                code=code,
                is_verified=False
            )
            
            if verification.is_expired():
                return Response(
                    {'error': 'Verification code has expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Mark as verified
            verification.is_verified = True
            verification.save()
            
            # Update user
            request.user.email_verified = True
            if not request.user.is_verified:
                request.user.is_verified = True
            request.user.save()
            
            return Response({'message': 'Email verified successfully'})
            
        except EmailVerification.DoesNotExist:
            return Response(
                {'error': 'Invalid verification code'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_avatar(request):
    """Upload user avatar"""
    if 'avatar' not in request.FILES:
        return Response(
            {'error': 'No avatar file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = request.user
    user.avatar = request.FILES['avatar']
    user.save()
    
    return Response({
        'message': 'Avatar uploaded successfully',
        'avatar_url': user.avatar.url if user.avatar else None
    })