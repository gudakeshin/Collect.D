// -------------------------------------------------------------------------
// 6. Collections Queue Component (src/components/CollectionsQueue.tsx)
// -------------------------------------------------------------------------
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import apiClient from '../services/apiClient';
import CallLogger from './CallLogger';

interface Invoice {
    id: number;
    account_number: string;
    customer_name: string;
    amount: number;
    due_date: string;
    status: string;
}

export const CollectionsQueue: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const { data, isLoading, error } = useQuery<Invoice[]>({
        queryKey: ['invoices'],
        queryFn: async () => {
            const response = await apiClient.get('/invoices/');
            return response.data;
        }
    });

    const columnDefs: ColDef[] = [
        { field: 'account_number', headerName: 'Account Number' },
        { field: 'customer_name', headerName: 'Customer Name' },
        { field: 'amount', headerName: 'Amount' },
        { field: 'due_date', headerName: 'Due Date' },
        { field: 'status', headerName: 'Status' },
    ];

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading invoices</Alert>;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Collections Queue
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={data}
                        columnDefs={columnDefs}
                        onRowClicked={(event) => setSelectedInvoice(event.data)}
                    />
                </div>
            </Paper>
            {selectedInvoice && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Call Logger - {selectedInvoice.customer_name}
                    </Typography>
                    <CallLogger invoiceId={selectedInvoice.id} />
                </Paper>
            )}
        </Box>
    );
};

