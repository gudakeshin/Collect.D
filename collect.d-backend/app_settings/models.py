from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

User = get_user_model()

class CompanySettings(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Company Settings')
        verbose_name_plural = _('Company Settings')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.TextField()
    tax_id = models.CharField(max_length=50)
    currency = models.CharField(max_length=3, default='INR')
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} Settings"

class OfficeLocation(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Office Location')
        verbose_name_plural = _('Office Locations')

    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='locations')
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    is_headquarters = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.company.name}"

class BankAccount(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Bank Account')
        verbose_name_plural = _('Bank Accounts')

    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='bank_accounts')
    account_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=20)
    branch = models.CharField(max_length=255)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account_name} - {self.bank_name}"

class TaxSetting(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Tax Setting')
        verbose_name_plural = _('Tax Settings')

    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='tax_settings')
    type = models.CharField(max_length=50)  # e.g., GST, VAT, etc.
    number = models.CharField(max_length=50)  # Tax registration number
    rate = models.DecimalField(max_digits=5, decimal_places=2, 
                             validators=[MinValueValidator(0), MaxValueValidator(100)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} - {self.number}"

class NotificationTemplate(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Notification Template')
        verbose_name_plural = _('Notification Templates')

    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='notification_templates')
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    variables = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class NotificationSettings(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Notification Settings')
        verbose_name_plural = _('Notification Settings')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=False)
    payment_reminders = models.BooleanField(default=True)
    overdue_alerts = models.BooleanField(default=True)
    report_generation = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Notification Settings"

class SecuritySettings(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Security Settings')
        verbose_name_plural = _('Security Settings')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    two_factor_auth = models.BooleanField(default=False)
    ip_whitelist = models.JSONField(default=list)
    session_timeout = models.IntegerField(default=30)  # in minutes
    last_password_change = models.DateTimeField(auto_now_add=True)
    failed_login_attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Security Settings"

class IntegrationSettings(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Integration Settings')
        verbose_name_plural = _('Integration Settings')
        unique_together = ('company', 'service')

    INTEGRATION_CHOICES = (
        ('quickbooks', 'QuickBooks'),
        ('zoho', 'Zoho Books'),
        ('xero', 'Xero'),
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('mailchimp', 'Mailchimp'),
        ('sendgrid', 'SendGrid'),
        ('hubspot', 'HubSpot'),
        ('salesforce', 'Salesforce'),
        ('dropbox', 'Dropbox'),
        ('google_drive', 'Google Drive'),
        ('google_analytics', 'Google Analytics'),
        ('mixpanel', 'Mixpanel'),
    )

    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE, related_name='integrations')
    service = models.CharField(max_length=50, choices=INTEGRATION_CHOICES)
    is_active = models.BooleanField(default=True)
    settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.service}"

class APICredential(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('API Credential')
        verbose_name_plural = _('API Credentials')

    integration = models.ForeignKey(IntegrationSettings, on_delete=models.CASCADE, related_name='credentials')
    api_key = models.CharField(max_length=255)
    api_secret = models.CharField(max_length=255)
    environment = models.CharField(max_length=20, default='production')
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.integration.service} Credentials"

class AuditLog(models.Model):
    class Meta:
        app_label = 'app_settings'
        verbose_name = _('Audit Log')
        verbose_name_plural = _('Audit Logs')
        ordering = ['-timestamp']

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=50)
    details = models.JSONField()
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"

class InvoiceSetting(models.Model):
    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE)
    prefix = models.CharField(max_length=10, default='INV')
    next_number = models.IntegerField(default=1)
    due_days = models.IntegerField(default=30)
    terms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

class PaymentSetting(models.Model):
    company = models.ForeignKey(CompanySettings, on_delete=models.CASCADE)
    payment_methods = models.JSONField(default=list)
    late_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    grace_period_days = models.IntegerField(default=7)
    auto_reminder_days = models.IntegerField(default=3)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
