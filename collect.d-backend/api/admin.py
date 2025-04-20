from django.contrib import admin
from .models import UserCredentials, LogFile

@admin.register(UserCredentials)
class UserCredentialsAdmin(admin.ModelAdmin):
    list_display = ('user', 'api_key', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user__username', 'api_key')

@admin.register(LogFile)
class LogFileAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'user', 'log_type', 'size', 'created_at', 'is_archived')
    list_filter = ('log_type', 'is_archived', 'created_at')
    search_fields = ('file_name', 'user__username')
    readonly_fields = ('created_at', 'last_modified')
