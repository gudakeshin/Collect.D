import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Receipt as InvoicesIcon,
    Payment as PaymentsIcon,
    Assessment as ReportsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Invoices', icon: <InvoicesIcon />, path: '/dashboard/invoices' },
    { text: 'Payments', icon: <PaymentsIcon />, path: '/dashboard/payments' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/dashboard/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

const MainMenu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                width: 240,
                bgcolor: 'background.paper',
                height: '100vh',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default MainMenu; 