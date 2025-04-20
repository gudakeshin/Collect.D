from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from app_settings.models import (
    CompanySettings, OfficeLocation, BankAccount, TaxSetting,
    NotificationTemplate, NotificationSettings, SecuritySettings,
    IntegrationSettings, APICredential, AuditLog
)

User = get_user_model()

def create_audit_log(user, action, details, request=None):
    """
    Helper function to create audit log entries
    """
    ip_address = None
    user_agent = None
    if request:
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT')

    AuditLog.objects.create(
        user=user,
        action=action,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent
    )

@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """
    Create notification and security settings for new users
    """
    if created:
        NotificationSettings.objects.create(user=instance)
        SecuritySettings.objects.create(user=instance)

@receiver(post_save, sender=CompanySettings)
def log_company_settings_changes(sender, instance, created, **kwargs):
    """
    Log company settings changes
    """
    action = 'company_settings_created' if created else 'company_settings_updated'
    details = {
        'company_id': instance.id,
        'name': instance.name,
        'tax_id': instance.tax_id,
        'currency': instance.currency,
        'timezone': instance.timezone
    }
    create_audit_log(instance.user, action, details)

@receiver(post_save, sender=BankAccount)
def handle_primary_bank_account(sender, instance, created, **kwargs):
    """
    Ensure only one primary bank account exists per company
    """
    if instance.is_primary:
        BankAccount.objects.filter(
            company=instance.company,
            is_primary=True
        ).exclude(id=instance.id).update(is_primary=False)

@receiver(post_save, sender=OfficeLocation)
def handle_headquarters(sender, instance, created, **kwargs):
    """
    Ensure only one headquarters exists per company
    """
    if instance.is_headquarters:
        OfficeLocation.objects.filter(
            company=instance.company,
            is_headquarters=True
        ).exclude(id=instance.id).update(is_headquarters=False)

@receiver(post_save, sender=SecuritySettings)
def handle_failed_login_attempts(sender, instance, **kwargs):
    """
    Handle account locking after multiple failed login attempts
    """
    if instance.failed_login_attempts >= 5:
        user = instance.user
        user.is_active = False
        user.save()
        create_audit_log(
            user,
            'account_locked',
            {'reason': 'multiple_failed_login_attempts'}
        )

@receiver(post_save, sender=IntegrationSettings)
def log_integration_changes(sender, instance, created, **kwargs):
    """
    Log integration settings changes
    """
    action = 'integration_created' if created else 'integration_updated'
    details = {
        'service': instance.service,
        'is_active': instance.is_active,
        'settings': instance.settings
    }
    create_audit_log(instance.company.user, action, details)

@receiver(post_delete, sender=APICredential)
def log_api_credential_deletion(sender, instance, **kwargs):
    """
    Log API credential deletions
    """
    details = {
        'integration': instance.integration.service,
        'environment': instance.environment
    }
    create_audit_log(
        instance.integration.company.user,
        'api_credential_deleted',
        details
    )

@receiver(pre_save, sender=NotificationTemplate)
def validate_template_variables(sender, instance, **kwargs):
    """
    Validate template variables before saving
    """
    required_vars = {'company_name', 'user_name', 'date'}
    if not all(var in instance.variables for var in required_vars):
        instance.variables.update({var: '' for var in required_vars}) 