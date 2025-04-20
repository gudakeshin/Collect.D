from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from ..models import (
    CompanySettings, OfficeLocation, BankAccount, TaxSetting,
    NotificationTemplate, NotificationSettings, SecuritySettings,
    IntegrationSettings, APICredential
)

User = get_user_model()

class SettingsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create company settings
        self.company = CompanySettings.objects.create(
            user=self.user,
            name='Test Company',
            address='123 Test St',
            tax_id='TEST123',
            phone='1234567890',
            email='company@test.com'
        )

    def test_company_settings_list(self):
        url = reverse('company-settings-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_company_settings_detail(self):
        url = reverse('company-settings-detail', args=[self.company.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Company')

    def test_company_settings_update(self):
        url = reverse('company-settings-detail', args=[self.company.id])
        data = {
            'name': 'Updated Company',
            'address': '456 New St',
            'tax_id': 'NEW123',
            'phone': '9876543210',
            'email': 'new@company.com'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Company')

    def test_office_location_crud(self):
        # Create
        url = reverse('office-locations-list')
        data = {
            'company': self.company.id,
            'name': 'Main Office',
            'address': '789 Office St',
            'phone': '1122334455',
            'email': 'office@test.com',
            'is_headquarters': True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        location_id = response.data['id']

        # Read
        url = reverse('office-locations-detail', args=[location_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Main Office')

        # Update
        data = {'name': 'Updated Office'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Office')

        # Delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_bank_account_crud(self):
        # Create
        url = reverse('bank-accounts-list')
        data = {
            'company': self.company.id,
            'account_name': 'Test Account',
            'account_number': '123456789',
            'bank_name': 'Test Bank',
            'ifsc_code': 'TEST0001',
            'branch': 'Test Branch',
            'is_primary': True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        account_id = response.data['id']

        # Read
        url = reverse('bank-accounts-detail', args=[account_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['account_name'], 'Test Account')

        # Update
        data = {'account_name': 'Updated Account'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['account_name'], 'Updated Account')

        # Delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_notification_settings_crud(self):
        # Create (automatically created with user)
        settings = NotificationSettings.objects.get(user=self.user)
        url = reverse('notification-settings-detail', args=[settings.id])

        # Read
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['email_notifications'])

        # Update
        data = {
            'email_notifications': False,
            'sms_notifications': True
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['email_notifications'])
        self.assertTrue(response.data['sms_notifications'])

    def test_security_settings_crud(self):
        # Create (automatically created with user)
        settings = SecuritySettings.objects.get(user=self.user)
        url = reverse('security-settings-detail', args=[settings.id])

        # Read
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['two_factor_auth'])

        # Update
        data = {
            'two_factor_auth': True,
            'session_timeout': 60
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['two_factor_auth'])
        self.assertEqual(response.data['session_timeout'], 60)

    def test_integration_settings_crud(self):
        # Create
        url = reverse('integration-settings-list')
        data = {
            'company': self.company.id,
            'service': 'quickbooks',
            'settings': {'api_url': 'https://api.quickbooks.com'}
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        integration_id = response.data['id']

        # Read
        url = reverse('integration-settings-detail', args=[integration_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['service'], 'quickbooks')

        # Update
        data = {'settings': {'api_url': 'https://new.quickbooks.com'}}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['settings']['api_url'], 'https://new.quickbooks.com')

        # Delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_api_credential_crud(self):
        # Create integration first
        integration = IntegrationSettings.objects.create(
            company=self.company,
            service='quickbooks'
        )

        # Create credential
        url = reverse('api-credentials-list')
        data = {
            'integration': integration.id,
            'api_key': 'test_key',
            'api_secret': 'test_secret',
            'environment': 'production'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        credential_id = response.data['id']

        # Read
        url = reverse('api-credentials-detail', args=[credential_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['api_key'], 'test_key')

        # Update
        data = {'api_key': 'new_key'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['api_key'], 'new_key')

        # Delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthorized_access(self):
        # Create another user
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        other_company = CompanySettings.objects.create(
            user=other_user,
            name='Other Company',
            address='789 Other St',
            tax_id='OTHER123',
            phone='5556667777',
            email='other@company.com'
        )

        # Try to access other user's company settings
        url = reverse('company-settings-detail', args=[other_company.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Try to update other user's company settings
        data = {'name': 'Hacked Company'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_validation_errors(self):
        # Try to create office location with invalid email
        url = reverse('office-locations-list')
        data = {
            'company': self.company.id,
            'name': 'Invalid Office',
            'address': '123 Invalid St',
            'phone': '1234567890',
            'email': 'invalid-email'  # Invalid email format
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Try to create bank account without required fields
        url = reverse('bank-accounts-list')
        data = {
            'company': self.company.id,
            'account_name': 'Invalid Account'
            # Missing required fields
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 