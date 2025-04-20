import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import DataVisualization from '../components/DataVisualization';
import { dataService } from '../services/api';

const Dashboard: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Collection Performance */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="line"
                        dataEndpoint="getCollectionPerformance"
                        title="Collection Performance"
                        xAxisKey="date"
                        yAxisKey="collectionRate"
                        color="#4caf50"
                    />
                </Grid>

                {/* DSO Analytics */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="bar"
                        dataEndpoint="getDSOAnalytics"
                        title="Days Sales Outstanding"
                        xAxisKey="month"
                        yAxisKey="dso"
                        color="#2196f3"
                    />
                </Grid>

                {/* Risk Scores Distribution */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="pie"
                        dataEndpoint="getRiskScores"
                        title="Risk Score Distribution"
                        xAxisKey="riskCategory"
                        yAxisKey="count"
                    />
                </Grid>

                {/* Strategy Effectiveness */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="bar"
                        dataEndpoint="getStrategyEffectiveness"
                        title="Collection Strategy Effectiveness"
                        xAxisKey="strategy"
                        yAxisKey="successRate"
                        color="#ff9800"
                    />
                </Grid>

                {/* Payment Trends */}
                <Grid item xs={12}>
                    <DataVisualization
                        type="line"
                        dataEndpoint="getPayments"
                        title="Payment Trends"
                        xAxisKey="date"
                        yAxisKey="amount"
                        color="#9c27b0"
                    />
                </Grid>

                {/* Customer Interactions */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="bar"
                        dataEndpoint="getCustomerInteractions"
                        title="Customer Interactions"
                        xAxisKey="interactionType"
                        yAxisKey="count"
                        color="#f44336"
                    />
                </Grid>

                {/* Disputes Overview */}
                <Grid item xs={12} md={6}>
                    <DataVisualization
                        type="pie"
                        dataEndpoint="getDisputes"
                        title="Dispute Categories"
                        xAxisKey="category"
                        yAxisKey="count"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 