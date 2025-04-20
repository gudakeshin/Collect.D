from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class UserCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credentials')
    api_key = models.CharField(max_length=100, unique=True, blank=True, null=True)
    secret_key = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username}'s credentials"

class LogFile(models.Model):
    LOG_TYPES = (
        ('auth', 'Authentication'),
        ('error', 'Error'),
        ('info', 'Information'),
        ('debug', 'Debug'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='log_files')
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=1000)
    log_type = models.CharField(max_length=10, choices=LOG_TYPES)
    size = models.BigIntegerField()  # Size in bytes
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['log_type']),
        ]

    def __str__(self):
        return f"{self.file_name} ({self.log_type})"
