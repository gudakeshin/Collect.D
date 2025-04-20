// -------------------------------------------------------------------------
// 5. AR Dashboard Component (src/components/ArDashboard.tsx)
// -------------------------------------------------------------------------
import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const ArDashboard: React.FC = () => {
    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await apiClient.get('/users/me/');
            return response.data;
        }
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error loading user data</Typography>;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Collect.D
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Hello, {user?.first_name || user?.username}!
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Your Account
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Username:</strong> {user?.username}</Typography>
                        <Typography><strong>Email:</strong> {user?.email}</Typography>
                        <Typography><strong>Name:</strong> {user?.first_name} {user?.last_name}</Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography>• View Reports</Typography>
                        <Typography>• Manage Credentials</Typography>
                        <Typography>• Upload Logs</Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};
