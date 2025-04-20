import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Invoices</Typography>
                        <Typography variant="h4">0</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Payments</Typography>
                        <Typography variant="h4">0</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Pending Invoices</Typography>
                        <Typography variant="h4">0</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Customers</Typography>
                        <Typography variant="h4">0</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 