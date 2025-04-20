// -------------------------------------------------------------------------
// 7. Call Logger Component (src/components/CallLogger.tsx)
// -------------------------------------------------------------------------
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Box, Paper } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

const callSchema = z.object({
    disposition: z.string().min(1, 'Disposition is required'),
    notes: z.string().optional(),
    followUpDate: z.string().optional(),
});

type CallFormData = z.infer<typeof callSchema>;

interface CallLoggerProps {
    invoiceId: number;
}

const CallLogger: React.FC<CallLoggerProps> = ({ invoiceId }) => {
    const { handleSubmit, formState: { errors } } = useForm<CallFormData>({
        resolver: zodResolver(callSchema),
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (data: CallFormData) => {
            const response = await apiClient.post(`/calls/${invoiceId}/`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
        },
    });

    const onSubmit = (data: CallFormData) => {
        mutation.mutate(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
                label="Disposition"
                select
                fullWidth
                margin="normal"
                error={!!errors.disposition}
                helperText={errors.disposition?.message}
            >
                <option value="Contacted">Contacted</option>
                <option value="Voicemail Left">Voicemail Left</option>
                <option value="No Answer">No Answer</option>
                <option value="Wrong Number">Wrong Number</option>
            </TextField>

            <TextField
                label="Notes"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                error={!!errors.notes}
                helperText={errors.notes?.message}
            />

            <TextField
                label="Follow-up Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.followUpDate}
                helperText={errors.followUpDate?.message}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? 'Saving...' : 'Save Call Log'}
            </Button>

            {mutation.isError && (
                <Paper sx={{ mt: 2, p: 2, backgroundColor: 'error.main', color: 'error.contrastText' }}>
                    Error saving call log: {mutation.error.message}
                </Paper>
            )}
        </Box>
    );
};

export default CallLogger;
