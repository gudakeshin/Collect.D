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
} from '@mui/material';
import {
    Add as AddIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface Invoice {
    id: number;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Overdue' | 'Pending';
    createdAt: string;
}

const columns: GridColDef[] = [
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
    { field: 'dueDate', headerName: 'Due Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
];

// Sample data
const invoices: Invoice[] = [
    {
        id: 1,
        invoiceNumber: 'INV-001',
        customerName: 'ABC Corp',
        amount: 50000,
        dueDate: '2024-05-01',
        status: 'Pending',
        createdAt: '2024-04-01',
    },
    {
        id: 2,
        invoiceNumber: 'INV-002',
        customerName: 'XYZ Ltd',
        amount: 75000,
        dueDate: '2024-04-15',
        status: 'Overdue',
        createdAt: '2024-03-15',
    },
    {
        id: 3,
        invoiceNumber: 'INV-003',
        customerName: 'PQR Industries',
        amount: 30000,
        dueDate: '2024-04-30',
        status: 'Paid',
        createdAt: '2024-03-30',
    },
];

const Invoices: React.FC = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreateInvoice = () => {
        navigate('/invoices/create');
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting invoices...');
    };

    const filteredInvoices = invoices.filter((invoice) =>
        Object.values(invoice).some((value) =>
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
                        <Typography variant="h4">Invoices</Typography>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateInvoice}
                                sx={{ mr: 2 }}
                            >
                                Create Invoice
                            </Button>
                            <Tooltip title="Export Invoices">
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
                                label="Search Invoices"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <FilterIcon sx={{ mr: 1 }} />,
                                }}
                            />
                        </Box>
                        <DataGrid<Invoice>
                            rows={filteredInvoices}
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

export default Invoices; 