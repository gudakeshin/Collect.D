import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Tabs,
    Tab,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Print as PrintIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`report-tabpanel-${index}`}
            aria-labelledby={`report-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// Sample data for charts
const agingData = [
    { name: 'Current', value: 500000 },
    { name: '1-30 Days', value: 300000 },
    { name: '31-60 Days', value: 200000 },
    { name: '61-90 Days', value: 100000 },
    { name: '>90 Days', value: 50000 },
];

const paymentTrendsData = [
    { month: 'Jan', collected: 450000, overdue: 150000 },
    { month: 'Feb', collected: 520000, overdue: 180000 },
    { month: 'Mar', collected: 480000, overdue: 200000 },
    { month: 'Apr', collected: 550000, overdue: 220000 },
    { month: 'May', collected: 600000, overdue: 250000 },
];

const customerData = [
    { name: 'ABC Corp', totalInvoices: 15, totalAmount: 750000, overdueAmount: 150000 },
    { name: 'XYZ Ltd', totalInvoices: 12, totalAmount: 600000, overdueAmount: 200000 },
    { name: 'PQR Industries', totalInvoices: 8, totalAmount: 400000, overdueAmount: 100000 },
    { name: 'DEF Solutions', totalInvoices: 10, totalAmount: 500000, overdueAmount: 75000 },
];

const Reports: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting report...');
    };

    const handlePrint = () => {
        // TODO: Implement print functionality
        console.log('Printing report...');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Typography variant="h4">Reports</Typography>
                        <Box>
                            <Tooltip title="Export Report">
                                <IconButton onClick={handleExport} sx={{ mr: 1 }}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Report">
                                <IconButton onClick={handlePrint}>
                                    <PrintIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label="Aging Analysis" />
                            <Tab label="Payment Trends" />
                            <Tab label="Customer Analytics" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Aging Summary
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={agingData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <ChartTooltip />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke="#8884d8"
                                                        name="Amount (₹)"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Aging Details
                                            </Typography>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Period</TableCell>
                                                            <TableCell align="right">Amount (₹)</TableCell>
                                                            <TableCell align="right">% of Total</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {agingData.map((row) => (
                                                            <TableRow key={row.name}>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell align="right">
                                                                    {new Intl.NumberFormat('en-IN', {
                                                                        style: 'currency',
                                                                        currency: 'INR',
                                                                    }).format(row.value)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {((row.value / agingData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Payment Trends
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={paymentTrendsData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <ChartTooltip />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="collected"
                                                        stroke="#4caf50"
                                                        name="Collected (₹)"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="overdue"
                                                        stroke="#f44336"
                                                        name="Overdue (₹)"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Customer Analytics
                                            </Typography>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Customer</TableCell>
                                                            <TableCell align="right">Total Invoices</TableCell>
                                                            <TableCell align="right">Total Amount (₹)</TableCell>
                                                            <TableCell align="right">Overdue Amount (₹)</TableCell>
                                                            <TableCell align="right">Overdue %</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {customerData.map((row) => (
                                                            <TableRow key={row.name}>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell align="right">{row.totalInvoices}</TableCell>
                                                                <TableCell align="right">
                                                                    {new Intl.NumberFormat('en-IN', {
                                                                        style: 'currency',
                                                                        currency: 'INR',
                                                                    }).format(row.totalAmount)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {new Intl.NumberFormat('en-IN', {
                                                                        style: 'currency',
                                                                        currency: 'INR',
                                                                    }).format(row.overdueAmount)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {((row.overdueAmount / row.totalAmount) * 100).toFixed(1)}%
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports; 