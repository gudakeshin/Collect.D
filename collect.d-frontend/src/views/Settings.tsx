import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment,
    Avatar
} from '@mui/material';
import {
    Save as SaveIcon,
    Help as HelpIcon,
    Backup as BackupIcon,
    Restore as RestoreIcon,
    Compare as CompareIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Receipt as ReceiptIcon,
    Payment as PaymentIcon,
    LocationOn as LocationIcon,
    AccountBalance as BankIcon,
    Description as DocumentIcon,
    Email as EmailIcon,
    History as HistoryIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
}

interface CompanySettings {
    name: string;
    address: string;
    taxId: string;
    currency: string;
    timezone: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    paymentReminders: boolean;
    overdueAlerts: boolean;
    reportGeneration: boolean;
}

interface SecuritySettings {
    twoFactorAuth: boolean;
    passwordChangeRequired: boolean;
    sessionTimeout: number;
}

interface IntegrationSettings {
    accountingSoftware: string;
    paymentGateway: string;
    emailService: string;
    crm: string;
    documentManagement: string;
    analytics: string;
    apiKeys: {
        [key: string]: string;
    };
}

interface ValidationErrors {
    [key: string]: string;
}

interface OfficeLocation {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
}

interface BankAccount {
    id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branch: string;
}

interface TaxSetting {
    id: string;
    type: string;
    number: string;
    rate: number;
}

interface NotificationTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
}

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

interface InvoiceSetting {
    id: string;
    prefix: string;
    nextNumber: number;
    terms: string;
    notes: string;
    footer: string;
    logo: string;
    signature: string;
}

interface PaymentSetting {
    id: string;
    defaultPaymentMethod: string;
    paymentTerms: string;
    lateFeePercentage: number;
    gracePeriod: number;
    currency: string;
    bankAccount: string;
}

const Settings: React.FC = () => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState(0);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [backupDialogOpen, setBackupDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [compareDialogOpen, setCompareDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [userProfile, setUserProfile] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: '',
    });

    const [companySettings, setCompanySettings] = useState<CompanySettings>({
        name: '',
        address: '',
        taxId: '',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        paymentReminders: true,
        overdueAlerts: true,
        reportGeneration: false,
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorAuth: false,
        passwordChangeRequired: false,
        sessionTimeout: 30,
    });

    const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
        accountingSoftware: '',
        paymentGateway: '',
        emailService: '',
        crm: '',
        documentManagement: '',
        analytics: '',
        apiKeys: {},
    });

    const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [taxSettings, setTaxSettings] = useState<TaxSetting[]>([]);
    const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);

    const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSetting>({
        id: '',
        prefix: 'INV',
        nextNumber: 1,
        terms: '',
        notes: '',
        footer: '',
        logo: '',
        signature: '',
    });

    const [paymentSettings, setPaymentSettings] = useState<PaymentSetting>({
        id: '',
        defaultPaymentMethod: 'bank_transfer',
        paymentTerms: 'net_30',
        lateFeePercentage: 2,
        gracePeriod: 7,
        currency: 'INR',
        bankAccount: '',
    });

    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
    const [showAddBankDialog, setShowAddBankDialog] = useState(false);
    const [showAddTaxDialog, setShowAddTaxDialog] = useState(false);
    const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    useEffect(() => {
        const fetchAllSettings = async () => {
            try {
                setLoading(true);
                const [
                    profileResponse,
                    companyResponse,
                    notificationResponse,
                    securityResponse,
                    integrationResponse,
                    locationsResponse,
                    bankResponse,
                    taxResponse,
                    templatesResponse,
                    auditResponse
                ] = await Promise.all([
                    api.get('/api/auth/me/'),
                    api.get('/api/settings/company/'),
                    api.get('/api/settings/notifications/'),
                    api.get('/api/settings/security/'),
                    api.get('/api/settings/integrations/'),
                    api.get('/api/settings/locations/'),
                    api.get('/api/settings/bank-accounts/'),
                    api.get('/api/settings/tax/'),
                    api.get('/api/settings/notification-templates/'),
                    api.get('/api/settings/audit-logs/')
                ]);

                setUserProfile(profileResponse.data);
                setCompanySettings(companyResponse.data);
                setNotificationSettings(notificationResponse.data);
                setSecuritySettings(securityResponse.data);
                setIntegrationSettings(integrationResponse.data);
                setOfficeLocations(locationsResponse.data);
                setBankAccounts(bankResponse.data);
                setTaxSettings(taxResponse.data);
                setNotificationTemplates(templatesResponse.data);
                setAuditLogs(auditResponse.data);
            } catch (err) {
                setError('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchAllSettings();
    }, []);

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    };

    const validateIFSC = (ifsc: string): boolean => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (formData: any, type: string): boolean => {
        const errors: ValidationErrors = {};

        switch (type) {
            case 'location':
                if (!formData.name?.trim()) errors.name = 'Location name is required';
                if (!formData.address?.trim()) errors.address = 'Address is required';
                if (!formData.phone?.trim()) {
                    errors.phone = 'Phone number is required';
                } else if (!validatePhoneNumber(formData.phone)) {
                    errors.phone = 'Invalid phone number format';
                }
                if (!formData.email?.trim()) {
                    errors.email = 'Email is required';
                } else if (!validateEmail(formData.email)) {
                    errors.email = 'Invalid email format';
                }
                break;

            case 'bank':
                if (!formData.accountName?.trim()) errors.accountName = 'Account name is required';
                if (!formData.bankName?.trim()) errors.bankName = 'Bank name is required';
                if (!formData.accountNumber?.trim()) errors.accountNumber = 'Account number is required';
                if (!formData.ifscCode?.trim()) {
                    errors.ifscCode = 'IFSC code is required';
                } else if (!validateIFSC(formData.ifscCode)) {
                    errors.ifscCode = 'Invalid IFSC code format';
                }
                if (!formData.branch?.trim()) errors.branch = 'Branch is required';
                break;

            case 'tax':
                if (!formData.type?.trim()) errors.type = 'Tax type is required';
                if (!formData.number?.trim()) errors.number = 'Tax number is required';
                if (!formData.rate) {
                    errors.rate = 'Tax rate is required';
                } else if (formData.rate < 0 || formData.rate > 100) {
                    errors.rate = 'Tax rate must be between 0 and 100';
                }
                break;

            case 'template':
                if (!formData.name?.trim()) errors.name = 'Template name is required';
                if (!formData.subject?.trim()) errors.subject = 'Subject is required';
                if (!formData.body?.trim()) errors.body = 'Body is required';
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEdit = (item: any, type: string) => {
        setEditingItem(item);
        switch (type) {
            case 'location':
                setShowAddLocationDialog(true);
                break;
            case 'bank':
                setShowAddBankDialog(true);
                break;
            case 'tax':
                setShowAddTaxDialog(true);
                break;
            case 'template':
                setShowAddTemplateDialog(true);
                break;
        }
    };

    const handleDelete = async (item: any, type: string) => {
        try {
            setLoading(true);
            let endpoint = '';
            switch (type) {
                case 'location':
                    endpoint = `/api/settings/locations/${item.id}/`;
                    break;
                case 'bank':
                    endpoint = `/api/settings/bank-accounts/${item.id}/`;
                    break;
                case 'tax':
                    endpoint = `/api/settings/tax/${item.id}/`;
                    break;
                case 'template':
                    endpoint = `/api/settings/notification-templates/${item.id}/`;
                    break;
            }

            await api.delete(endpoint);
            setSuccess(true);
            setShowDeleteConfirm(false);
            setItemToDelete(null);

            // Refresh the list
            const fetchData = async () => {
                try {
                    const response = await api.get(endpoint.replace(`/${item.id}/`, '/'));
                    switch (type) {
                        case 'location':
                            setOfficeLocations(response.data);
                            break;
                        case 'bank':
                            setBankAccounts(response.data);
                            break;
                        case 'tax':
                            setTaxSettings(response.data);
                            break;
                        case 'template':
                            setNotificationTemplates(response.data);
                            break;
                    }
                } catch (err) {
                    setError('Failed to refresh data');
                }
            };

            fetchData();
        } catch (err) {
            setError('Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setShowDeleteConfirm(true);
    };

    const handleSaveUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            setValidationErrors({});

            // Validate required fields
            const errors: Record<string, string> = {};
            if (!userProfile.firstName) errors.firstName = 'First name is required';
            if (!userProfile.lastName) errors.lastName = 'Last name is required';
            if (!userProfile.email) errors.email = 'Email is required';
            if (!userProfile.phone) errors.phone = 'Phone number is required';

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }

            const response = await api.post('/settings/user-profile/', userProfile);
            setUserProfile(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save user profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCompany = async () => {
        if (!validateForm(companySettings, 'company')) return;

        try {
            setLoading(true);
            const response = await api.put('/api/settings/company/', companySettings);
            setCompanySettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save company settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.put('/api/settings/notifications/', notificationSettings);
            setNotificationSettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecurity = async () => {
        try {
            setLoading(true);
            const response = await api.put('/api/settings/security/', securitySettings);
            setSecuritySettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save security settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIntegrations = async () => {
        try {
            setLoading(true);
            const response = await api.put('/api/settings/integrations/', integrationSettings);
            setIntegrationSettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save integration settings');
        } finally {
            setLoading(false);
        }
    };

    const handleBackupSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/settings/backup/');
            const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `settings-backup-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setSuccess(true);
        } catch (err) {
            setError('Failed to backup settings');
        } finally {
            setLoading(false);
            setBackupDialogOpen(false);
        }
    };

    const handleRestoreSettings = async (file: File) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            await api.post('/api/settings/restore/', formData);
            setSuccess(true);
        } catch (err) {
            setError('Failed to restore settings');
        } finally {
            setLoading(false);
            setRestoreDialogOpen(false);
        }
    };

    const handleCompareSettings = async (file: File) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/api/settings/compare/', formData);
            // Show comparison results in dialog
            setSuccess(true);
        } catch (err) {
            setError('Failed to compare settings');
        } finally {
            setLoading(false);
            setCompareDialogOpen(false);
        }
    };

    const handleSaveInvoiceSettings = async () => {
        try {
            setLoading(true);
            const response = await api.put('/api/settings/invoice/', invoiceSettings);
            setInvoiceSettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save invoice settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaymentSettings = async () => {
        try {
            setLoading(true);
            const response = await api.put('/api/settings/payment/', paymentSettings);
            setPaymentSettings(response.data);
            setSuccess(true);
        } catch (err) {
            setError('Failed to save payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLocation = async (location: OfficeLocation) => {
        try {
            setLoading(true);
            const response = await api.post('/api/settings/locations/', location);
            setOfficeLocations([...officeLocations, response.data]);
            setSuccess(true);
            setShowAddLocationDialog(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to add location');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLocation = async (location: OfficeLocation) => {
        try {
            setLoading(true);
            const response = await api.put(`/api/settings/locations/${location.id}/`, location);
            setOfficeLocations(officeLocations.map(loc => 
                loc.id === location.id ? response.data : loc
            ));
            setSuccess(true);
            setShowAddLocationDialog(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to update location');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBankAccount = async (account: BankAccount) => {
        try {
            setLoading(true);
            const response = await api.post('/api/settings/bank-accounts/', account);
            setBankAccounts([...bankAccounts, response.data]);
            setSuccess(true);
            setShowAddBankDialog(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to add bank account');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTaxSetting = async (tax: TaxSetting) => {
        try {
            setLoading(true);
            const response = await api.post('/api/settings/tax/', tax);
            setTaxSettings([...taxSettings, response.data]);
            setSuccess(true);
            setShowAddTaxDialog(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to add tax setting');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTemplate = async (template: NotificationTemplate) => {
        try {
            setLoading(true);
            const response = await api.post('/api/settings/notification-templates/', template);
            setNotificationTemplates([...notificationTemplates, response.data]);
            setSuccess(true);
            setShowAddTemplateDialog(false);
            setEditingItem(null);
        } catch (err) {
            setError('Failed to add template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Settings</Typography>
                <Box>
                    <Tooltip title="Search Settings">
                        <IconButton onClick={() => setSearchTerm('')}>
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Help">
                        <IconButton onClick={() => setHelpDialogOpen(true)}>
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Backup Settings">
                        <IconButton onClick={() => setBackupDialogOpen(true)}>
                            <BackupIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Restore Settings">
                        <IconButton onClick={() => setRestoreDialogOpen(true)}>
                            <RestoreIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Compare Settings">
                        <IconButton onClick={() => setCompareDialogOpen(true)}>
                            <CompareIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Profile" icon={<PersonIcon />} />
                <Tab label="Company" icon={<BusinessIcon />} />
                <Tab label="Notifications" icon={<NotificationsIcon />} />
                <Tab label="Security" icon={<SecurityIcon />} />
                <Tab label="Integrations" icon={<SettingsIcon />} />
                <Tab label="Invoice" icon={<ReceiptIcon />} />
                <Tab label="Payment" icon={<PaymentIcon />} />
                <Tab label="Locations" icon={<LocationIcon />} />
                <Tab label="Bank Accounts" icon={<BankIcon />} />
                <Tab label="Tax" icon={<DocumentIcon />} />
                <Tab label="Templates" icon={<EmailIcon />} />
                <Tab label="Audit Logs" icon={<HistoryIcon />} />
            </Tabs>

            {/* User Profile Section */}
            {activeTab === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">User Profile</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Avatar
                                sx={{ width: 100, height: 100 }}
                                src={userProfile.avatar}
                            >
                                {userProfile.firstName[0]}
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={userProfile.firstName}
                                onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                                error={!!validationErrors.firstName}
                                helperText={validationErrors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={userProfile.lastName}
                                onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                                error={!!validationErrors.lastName}
                                helperText={validationErrors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={userProfile.email}
                                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                                error={!!validationErrors.email}
                                helperText={validationErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                                error={!!validationErrors.phone}
                                helperText={validationErrors.phone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveUserProfile}
                                fullWidth
                                disabled={loading}
                            >
                                Save Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Company Settings Section */}
            {activeTab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <BusinessIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Company Settings</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                value={companySettings.name}
                                onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                                error={!!validationErrors.companyName}
                                helperText={validationErrors.companyName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={companySettings.address}
                                onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                                multiline
                                rows={2}
                                error={!!validationErrors.address}
                                helperText={validationErrors.address}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tax ID"
                                value={companySettings.taxId}
                                onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                                error={!!validationErrors.taxId}
                                helperText={validationErrors.taxId}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Currency</InputLabel>
                                <Select
                                    value={companySettings.currency}
                                    label="Currency"
                                    onChange={(e) => setCompanySettings({
                                        ...companySettings,
                                        currency: e.target.value
                                    })}
                                >
                                    <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                                    <MenuItem value="EUR">Euro (€)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Timezone</InputLabel>
                                <Select
                                    value={companySettings.timezone}
                                    label="Timezone"
                                    onChange={(e) => setCompanySettings({
                                        ...companySettings,
                                        timezone: e.target.value
                                    })}
                                >
                                    <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
                                    <MenuItem value="America/New_York">New York (EST)</MenuItem>
                                    <MenuItem value="Europe/London">London (GMT)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveCompany}
                                fullWidth
                                disabled={loading}
                            >
                                Save Company Settings
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Notification Settings Section */}
            {activeTab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <NotificationsIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Notification Preferences</Typography>
                    </Box>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Email Notifications"
                                secondary="Receive notifications via email"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={notificationSettings.emailNotifications}
                                    onChange={(e) => setNotificationSettings({
                                        ...notificationSettings,
                                        emailNotifications: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Payment Reminders"
                                secondary="Get reminders for upcoming payments"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={notificationSettings.paymentReminders}
                                    onChange={(e) => setNotificationSettings({
                                        ...notificationSettings,
                                        paymentReminders: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Overdue Alerts"
                                secondary="Receive alerts for overdue payments"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={notificationSettings.overdueAlerts}
                                    onChange={(e) => setNotificationSettings({
                                        ...notificationSettings,
                                        overdueAlerts: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Report Generation"
                                secondary="Get notified when reports are generated"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={notificationSettings.reportGeneration}
                                    onChange={(e) => setNotificationSettings({
                                        ...notificationSettings,
                                        reportGeneration: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveNotifications}
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        Save Notification Settings
                    </Button>
                </Paper>
            )}

            {/* Security Settings Section */}
            {activeTab === 3 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <SecurityIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Security Settings</Typography>
                    </Box>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Two-Factor Authentication"
                                secondary="Enable 2FA for additional security"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={securitySettings.twoFactorAuth}
                                    onChange={(e) => setSecuritySettings({
                                        ...securitySettings,
                                        twoFactorAuth: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Password Change Required"
                                secondary="Force password change every 90 days"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={securitySettings.passwordChangeRequired}
                                    onChange={(e) => setSecuritySettings({
                                        ...securitySettings,
                                        passwordChangeRequired: e.target.checked
                                    })}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Session Timeout"
                                secondary="Minutes of inactivity before logout"
                            />
                            <ListItemSecondaryAction>
                                <Select
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings({
                                        ...securitySettings,
                                        sessionTimeout: Number(e.target.value)
                                    })}
                                    size="small"
                                >
                                    <MenuItem value={15}>15 minutes</MenuItem>
                                    <MenuItem value={30}>30 minutes</MenuItem>
                                    <MenuItem value={60}>1 hour</MenuItem>
                                    <MenuItem value={120}>2 hours</MenuItem>
                                </Select>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveSecurity}
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        Save Security Settings
                    </Button>
                </Paper>
            )}

            {/* Integration Settings Section */}
            {activeTab === 4 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <SettingsIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Integration Settings</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {/* Accounting Software */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Accounting Software</InputLabel>
                                <Select
                                    value={integrationSettings.accountingSoftware}
                                    label="Accounting Software"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        accountingSoftware: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="tally">Tally</MenuItem>
                                    <MenuItem value="quickbooks">QuickBooks</MenuItem>
                                    <MenuItem value="xero">Xero</MenuItem>
                                    <MenuItem value="zoho">Zoho Books</MenuItem>
                                    <MenuItem value="freshbooks">FreshBooks</MenuItem>
                                    <MenuItem value="wave">Wave</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Payment Gateway */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Gateway</InputLabel>
                                <Select
                                    value={integrationSettings.paymentGateway}
                                    label="Payment Gateway"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        paymentGateway: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="razorpay">Razorpay</MenuItem>
                                    <MenuItem value="stripe">Stripe</MenuItem>
                                    <MenuItem value="paypal">PayPal</MenuItem>
                                    <MenuItem value="paytm">Paytm</MenuItem>
                                    <MenuItem value="instamojo">Instamojo</MenuItem>
                                    <MenuItem value="ccavenue">CCAvenue</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Email Service */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Email Service</InputLabel>
                                <Select
                                    value={integrationSettings.emailService}
                                    label="Email Service"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        emailService: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="sendgrid">SendGrid</MenuItem>
                                    <MenuItem value="mailgun">Mailgun</MenuItem>
                                    <MenuItem value="smtp">SMTP</MenuItem>
                                    <MenuItem value="mailchimp">Mailchimp</MenuItem>
                                    <MenuItem value="amazon-ses">Amazon SES</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* CRM */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>CRM</InputLabel>
                                <Select
                                    value={integrationSettings.crm}
                                    label="CRM"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        crm: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="hubspot">HubSpot</MenuItem>
                                    <MenuItem value="salesforce">Salesforce</MenuItem>
                                    <MenuItem value="zoho-crm">Zoho CRM</MenuItem>
                                    <MenuItem value="pipedrive">Pipedrive</MenuItem>
                                    <MenuItem value="freshsales">Freshsales</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Document Management */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Document Management</InputLabel>
                                <Select
                                    value={integrationSettings.documentManagement}
                                    label="Document Management"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        documentManagement: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="dropbox">Dropbox</MenuItem>
                                    <MenuItem value="google-drive">Google Drive</MenuItem>
                                    <MenuItem value="onedrive">OneDrive</MenuItem>
                                    <MenuItem value="box">Box</MenuItem>
                                    <MenuItem value="sharepoint">SharePoint</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Analytics */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Analytics</InputLabel>
                                <Select
                                    value={integrationSettings.analytics}
                                    label="Analytics"
                                    onChange={(e) => setIntegrationSettings({
                                        ...integrationSettings,
                                        analytics: e.target.value
                                    })}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="google-analytics">Google Analytics</MenuItem>
                                    <MenuItem value="mixpanel">Mixpanel</MenuItem>
                                    <MenuItem value="amplitude">Amplitude</MenuItem>
                                    <MenuItem value="hotjar">Hotjar</MenuItem>
                                    <MenuItem value="matomo">Matomo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* API Keys Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                API Keys
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(integrationSettings.apiKeys).map(([key, value]) => (
                                    <Grid item xs={12} md={6} key={key}>
                                        <TextField
                                            fullWidth
                                            label={`${key} API Key`}
                                            value={value}
                                            onChange={(e) => setIntegrationSettings({
                                                ...integrationSettings,
                                                apiKeys: {
                                                    ...integrationSettings.apiKeys,
                                                    [key]: e.target.value
                                                }
                                            })}
                                            type="password"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveIntegrations}
                                fullWidth
                                disabled={loading}
                            >
                                Save Integration Settings
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Invoice Settings Section */}
            {activeTab === 5 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <ReceiptIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Invoice Settings</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Invoice Prefix"
                                value={invoiceSettings.prefix}
                                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Next Invoice Number"
                                type="number"
                                value={invoiceSettings.nextNumber}
                                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, nextNumber: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Terms & Conditions"
                                multiline
                                rows={3}
                                value={invoiceSettings.terms}
                                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, terms: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                multiline
                                rows={2}
                                value={invoiceSettings.notes}
                                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, notes: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Footer"
                                multiline
                                rows={2}
                                value={invoiceSettings.footer}
                                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footer: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveInvoiceSettings}
                                fullWidth
                                disabled={loading}
                            >
                                Save Invoice Settings
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Payment Settings Section */}
            {activeTab === 6 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <PaymentIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Payment Settings</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Default Payment Method</InputLabel>
                                <Select
                                    value={paymentSettings.defaultPaymentMethod}
                                    label="Default Payment Method"
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, defaultPaymentMethod: e.target.value })}
                                >
                                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                    <MenuItem value="credit_card">Credit Card</MenuItem>
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="check">Check</MenuItem>
                                    <MenuItem value="upi">UPI</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Terms</InputLabel>
                                <Select
                                    value={paymentSettings.paymentTerms}
                                    label="Payment Terms"
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentTerms: e.target.value })}
                                >
                                    <MenuItem value="net_15">Net 15</MenuItem>
                                    <MenuItem value="net_30">Net 30</MenuItem>
                                    <MenuItem value="net_45">Net 45</MenuItem>
                                    <MenuItem value="net_60">Net 60</MenuItem>
                                    <MenuItem value="due_on_receipt">Due on Receipt</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Late Fee Percentage"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                value={paymentSettings.lateFeePercentage}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, lateFeePercentage: parseFloat(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Grace Period"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                                }}
                                value={paymentSettings.gracePeriod}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, gracePeriod: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Currency</InputLabel>
                                <Select
                                    value={paymentSettings.currency}
                                    label="Currency"
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                                >
                                    <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                                    <MenuItem value="EUR">Euro (€)</MenuItem>
                                    <MenuItem value="GBP">British Pound (£)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Default Bank Account</InputLabel>
                                <Select
                                    value={paymentSettings.bankAccount}
                                    label="Default Bank Account"
                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccount: e.target.value })}
                                >
                                    {bankAccounts.map((account) => (
                                        <MenuItem key={account.id} value={account.id}>
                                            {account.bankName} - {account.accountNumber}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSavePaymentSettings}
                                fullWidth
                                disabled={loading}
                            >
                                Save Payment Settings
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Office Locations Section */}
            {activeTab === 7 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Office Locations</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingItem(null);
                                setShowAddLocationDialog(true);
                            }}
                        >
                            Add Location
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {officeLocations.map((location) => (
                                    <TableRow key={location.id}>
                                        <TableCell>{location.name}</TableCell>
                                        <TableCell>{location.address}</TableCell>
                                        <TableCell>{location.phone}</TableCell>
                                        <TableCell>{location.email}</TableCell>
                                        <TableCell>
                                            <IconButton 
                                                size="small"
                                                onClick={() => handleEdit(location, 'location')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDeleteClick(location)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Bank Accounts Section */}
            {activeTab === 8 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BankIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Bank Accounts</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddBankDialog(true)}
                        >
                            Add Bank Account
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Account Name</TableCell>
                                    <TableCell>Bank Name</TableCell>
                                    <TableCell>Account Number</TableCell>
                                    <TableCell>IFSC Code</TableCell>
                                    <TableCell>Branch</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bankAccounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>{account.accountName}</TableCell>
                                        <TableCell>{account.bankName}</TableCell>
                                        <TableCell>{account.accountNumber}</TableCell>
                                        <TableCell>{account.ifscCode}</TableCell>
                                        <TableCell>{account.branch}</TableCell>
                                        <TableCell>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Tax Settings Section */}
            {activeTab === 9 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DocumentIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Tax Settings</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddTaxDialog(true)}
                        >
                            Add Tax
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Number</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {taxSettings.map((tax) => (
                                    <TableRow key={tax.id}>
                                        <TableCell>{tax.type}</TableCell>
                                        <TableCell>{tax.number}</TableCell>
                                        <TableCell>{tax.rate}%</TableCell>
                                        <TableCell>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Notification Templates Section */}
            {activeTab === 10 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Notification Templates</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddTemplateDialog(true)}
                        >
                            Add Template
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notificationTemplates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>{template.name}</TableCell>
                                        <TableCell>{template.subject}</TableCell>
                                        <TableCell>
                                            <IconButton size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Audit Logs Section */}
            {activeTab === 11 && (
                <Paper sx={{ p: 3 }}>
                    <List>
                        {auditLogs.map((log) => (
                            <ListItem key={log.id} divider>
                                <ListItemText
                                    primary={log.action}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {log.user}
                                            </Typography>
                                            <Typography variant="body2">
                                                {log.details}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Help Dialog */}
            <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Settings Help</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        This page allows you to manage all your application settings. Here's what you can do:
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Profile Settings"
                                secondary="Update your personal information, profile picture, and contact details"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Company Settings"
                                secondary="Manage company information, locations, bank accounts, and tax settings"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Notification Settings"
                                secondary="Configure how and when you receive notifications"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Security Settings"
                                secondary="Manage security features like 2FA, password policies, and session settings"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Integration Settings"
                                secondary="Connect with external services and manage API keys"
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Backup Dialog */}
            <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
                <DialogTitle>Backup Settings</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        This will create a backup of all your current settings. The backup file can be used to restore your settings later.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleBackupSettings} variant="contained" disabled={loading}>
                        Backup
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Restore Dialog */}
            <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
                <DialogTitle>Restore Settings</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Select a backup file to restore your settings. This will overwrite your current settings.
                    </Typography>
                    <input
                        type="file"
                        accept=".json"
                        onChange={(e) => e.target.files?.[0] && handleRestoreSettings(e.target.files[0])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Compare Dialog */}
            <Dialog open={compareDialogOpen} onClose={() => setCompareDialogOpen(false)}>
                <DialogTitle>Compare Settings</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" paragraph>
                        Select a backup file to compare with your current settings.
                    </Typography>
                    <input
                        type="file"
                        accept=".json"
                        onChange={(e) => e.target.files?.[0] && handleCompareSettings(e.target.files[0])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompareDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Add Location Dialog */}
            <Dialog open={showAddLocationDialog} onClose={() => setShowAddLocationDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Location' : 'Add Office Location'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location Name"
                                value={editingItem?.name || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                error={!!validationErrors.name}
                                helperText={validationErrors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                multiline
                                rows={3}
                                value={editingItem?.address || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                                error={!!validationErrors.address}
                                helperText={validationErrors.address}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                value={editingItem?.phone || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                                error={!!validationErrors.phone}
                                helperText={validationErrors.phone}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editingItem?.email || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                                error={!!validationErrors.email}
                                helperText={validationErrors.email}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowAddLocationDialog(false);
                        setEditingItem(null);
                    }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={() => {
                            if (validateForm(editingItem, 'location')) {
                                if (editingItem?.id) {
                                    handleUpdateLocation(editingItem);
                                } else {
                                    handleAddLocation(editingItem);
                                }
                            }
                        }} 
                        disabled={loading}
                    >
                        {editingItem?.id ? 'Update' : 'Add'} Location
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => {
                            if (itemToDelete) {
                                handleDelete(itemToDelete, 'location');
                            }
                        }}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Bank Account Dialog */}
            <Dialog open={showAddBankDialog} onClose={() => setShowAddBankDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Bank Account</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Account Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Branch"
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddBankDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => {}} disabled={loading}>
                        Add Bank Account
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Tax Dialog */}
            <Dialog open={showAddTaxDialog} onClose={() => setShowAddTaxDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Tax</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tax Type"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tax Number"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tax Rate"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddTaxDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => {}} disabled={loading}>
                        Add Tax
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Template Dialog */}
            <Dialog open={showAddTemplateDialog} onClose={() => setShowAddTemplateDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Notification Template</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Template Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Body"
                                multiline
                                rows={6}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddTemplateDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => {}} disabled={loading}>
                        Add Template
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                message="Operation completed successfully"
            />
        </Box>
    );
};

export default Settings; 