from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanySettingsViewSet,
    OfficeLocationViewSet,
    BankAccountViewSet,
    TaxSettingViewSet,
    NotificationTemplateViewSet,
    NotificationSettingsViewSet,
    SecuritySettingsViewSet,
    IntegrationSettingsViewSet,
    APICredentialViewSet,
    AuditLogViewSet,
    InvoiceSettingViewSet,
    PaymentSettingViewSet
)

router = DefaultRouter()
router.register(r'company-settings', CompanySettingsViewSet)
router.register(r'office-locations', OfficeLocationViewSet)
router.register(r'bank-accounts', BankAccountViewSet)
router.register(r'tax-settings', TaxSettingViewSet)
router.register(r'notification-templates', NotificationTemplateViewSet)
router.register(r'notification-settings', NotificationSettingsViewSet)
router.register(r'security-settings', SecuritySettingsViewSet)
router.register(r'integration-settings', IntegrationSettingsViewSet)
router.register(r'api-credentials', APICredentialViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'invoice-settings', InvoiceSettingViewSet)
router.register(r'payment-settings', PaymentSettingViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 