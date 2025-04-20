from django.contrib import admin # type: ignore
from django.utils.html import format_html # type: ignore
from app_settings.models import (
    CompanySettings, OfficeLocation, BankAccount, TaxSetting,
    NotificationTemplate, NotificationSettings, SecuritySettings,
    IntegrationSettings, APICredential, AuditLog
)

@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'updated_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)

@admin.register(OfficeLocation)
class OfficeLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'is_headquarters', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('is_headquarters', 'created_at')

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'account_number', 'is_primary', 'created_at')
    search_fields = ('bank_name', 'account_number')
    list_filter = ('is_primary', 'created_at')

@admin.register(TaxSetting)
class TaxSettingAdmin(admin.ModelAdmin):
    list_display = ('type', 'number', 'rate', 'is_active', 'created_at')
    search_fields = ('type', 'number')
    list_filter = ('is_active', 'created_at')

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'is_active', 'created_at')
    search_fields = ('name', 'subject')
    list_filter = ('is_active', 'created_at')

@admin.register(NotificationSettings)
class NotificationSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'sms_notifications', 'push_notifications', 'updated_at')
    list_filter = ('email_notifications', 'sms_notifications', 'push_notifications')

@admin.register(SecuritySettings)
class SecuritySettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'two_factor_auth', 'session_timeout', 'updated_at')
    list_filter = ('two_factor_auth',)

@admin.register(IntegrationSettings)
class IntegrationSettingsAdmin(admin.ModelAdmin):
    list_display = ('service', 'is_active', 'created_at', 'updated_at')
    search_fields = ('service',)
    list_filter = ('is_active', 'created_at')

@admin.register(APICredential)
class APICredentialAdmin(admin.ModelAdmin):
    list_display = ('integration', 'api_key', 'environment', 'created_at')
    search_fields = ('api_key', 'environment')
    list_filter = ('environment', 'created_at')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp', 'ip_address')
    search_fields = ('action', 'details')
    list_filter = ('action', 'timestamp')
    readonly_fields = ('timestamp',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
