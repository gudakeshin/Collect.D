import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface Payment {
    id: number;
    paymentNumber: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque' | 'Credit Card';
    status: 'Completed' | 'Pending' | 'Failed';
}

const columns: GridColDef[] = [
    { field: 'paymentNumber', headerName: 'Payment #', width: 150 },
    { field: 'invoiceNumber', headerName: 'Invoice #', width: 150 },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    {
        field: 'amount',
        headerName: 'Amount',
        width: 150,
        valueFormatter: (params: { value: number }) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
            }).format(params.value);
        },
    },
    { field: 'paymentDate', headerName: 'Payment Date', width: 150 },
    {
        field: 'paymentMethod',
        headerName: 'Payment Method',
        width: 150,
        renderCell: (params) => (
            <Chip
                label={params.value}
                size="small"
                color={
                    params.value === 'Bank Transfer'
                        ? 'primary'
                        : params.value === 'Cash'
                        ? 'success'
                        : params.value === 'Cheque'
                        ? 'warning'
                        : 'info'
                }
            />
        ),
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => (
            <Chip
                label={params.value}
                size="small"
                color={
                    params.value === 'Completed'
                        ? 'success'
                        : params.value === 'Pending'
                        ? 'warning'
                        : 'error'
                }
            />
        ),
    },
];

// Sample data
const payments: Payment[] = [
    {
        id: 1,
        paymentNumber: 'PAY-001',
        invoiceNumber: 'INV-001',
        customerName: 'ABC Corp',
        amount: 50000,
        paymentDate: '2024-04-15',
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
    },
    {
        id: 2,
        paymentNumber: 'PAY-002',
        invoiceNumber: 'INV-002',
        customerName: 'XYZ Ltd',
        amount: 75000,
        paymentDate: '2024-04-16',
        paymentMethod: 'Cheque',
        status: 'Pending',
    },
    {
        id: 3,
        paymentNumber: 'PAY-003',
        invoiceNumber: 'INV-003',
        customerName: 'PQR Industries',
        amount: 30000,
        paymentDate: '2024-04-17',
        paymentMethod: 'Credit Card',
        status: 'Failed',
    },
];

const Payments: React.FC = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleRecordPayment = () => {
        navigate('/payments/record');
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting payments...');
    };

    const filteredPayments = payments.filter((payment) =>
        Object.values(payment).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
                        <Typography variant="h4">Payments</Typography>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleRecordPayment}
                                sx={{ mr: 2 }}
                            >
                                Record Payment
                            </Button>
                            <Tooltip title="Export Payments">
                                <IconButton onClick={handleExport}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Search Payments"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <FilterIcon sx={{ mr: 1 }} />,
                                }}
                            />
                        </Box>
                        <DataGrid<Payment>
                            rows={filteredPayments}
                            columns={columns}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    fontSize: '0.875rem',
                                },
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Payments; 