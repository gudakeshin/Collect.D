import React from 'react';
import { Box, Typography } from '@mui/material';

interface DataVisualizationProps {
    type: 'line' | 'bar' | 'pie';
    dataEndpoint: string;
    title: string;
    xAxisKey: string;
    yAxisKey: string;
    color?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
    type,
    dataEndpoint,
    title,
    xAxisKey,
    yAxisKey,
    color = '#1976d2'
}) => {
    return (
        <Box>
            <Typography variant="h6">{title}</Typography>
            {/* Add your data visualization components here */}
            <Typography>Visualization type: {type}</Typography>
            <Typography>Data endpoint: {dataEndpoint}</Typography>
            <Typography>X-Axis: {xAxisKey}</Typography>
            <Typography>Y-Axis: {yAxisKey}</Typography>
            <Typography>Color: {color}</Typography>
        </Box>
    );
};

export default DataVisualization; 