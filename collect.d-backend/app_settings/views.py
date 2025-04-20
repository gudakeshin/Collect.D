from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from app_settings.models import (
    CompanySettings, OfficeLocation, BankAccount, TaxSetting,
    NotificationTemplate, NotificationSettings, SecuritySettings,
    IntegrationSettings, APICredential, AuditLog,
    InvoiceSetting, PaymentSetting
)
from app_settings.serializers import (
    CompanySettingsSerializer, OfficeLocationSerializer, BankAccountSerializer,
    TaxSettingSerializer, NotificationTemplateSerializer, NotificationSettingsSerializer,
    SecuritySettingsSerializer, IntegrationSettingsSerializer, APICredentialSerializer,
    AuditLogSerializer, InvoiceSettingSerializer, PaymentSettingSerializer
)

User = get_user_model()

# Create your views here.

class CompanySettingsViewSet(viewsets.ModelViewSet):
    queryset = CompanySettings.objects.all()
    serializer_class = CompanySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CompanySettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OfficeLocationViewSet(viewsets.ModelViewSet):
    queryset = OfficeLocation.objects.all()
    serializer_class = OfficeLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return OfficeLocation.objects.filter(company__user=self.request.user)

class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BankAccount.objects.filter(company__user=self.request.user)

class TaxSettingViewSet(viewsets.ModelViewSet):
    queryset = TaxSetting.objects.all()
    serializer_class = TaxSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaxSetting.objects.filter(company__user=self.request.user)

class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NotificationTemplate.objects.filter(company__user=self.request.user)

class NotificationSettingsViewSet(viewsets.ModelViewSet):
    queryset = NotificationSettings.objects.all()
    serializer_class = NotificationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NotificationSettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SecuritySettingsViewSet(viewsets.ModelViewSet):
    queryset = SecuritySettings.objects.all()
    serializer_class = SecuritySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SecuritySettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IntegrationSettingsViewSet(viewsets.ModelViewSet):
    queryset = IntegrationSettings.objects.all()
    serializer_class = IntegrationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IntegrationSettings.objects.filter(company__user=self.request.user)

class APICredentialViewSet(viewsets.ModelViewSet):
    queryset = APICredential.objects.all()
    serializer_class = APICredentialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return APICredential.objects.filter(company__user=self.request.user)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AuditLog.objects.filter(user=self.request.user)

class InvoiceSettingViewSet(viewsets.ModelViewSet):
    queryset = InvoiceSetting.objects.all()
    serializer_class = InvoiceSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InvoiceSetting.objects.filter(company__user=self.request.user)

class PaymentSettingViewSet(viewsets.ModelViewSet):
    queryset = PaymentSetting.objects.all()
    serializer_class = PaymentSettingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentSetting.objects.filter(company__user=self.request.user)
