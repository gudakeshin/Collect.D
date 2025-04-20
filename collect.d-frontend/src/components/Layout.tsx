// -------------------------------------------------------------------------
// 4. Basic Layout Component (src/components/Layout.tsx)
// -------------------------------------------------------------------------
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import MainMenu from './MainMenu';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Collect.D
                    </Typography>
                </Toolbar>
            </AppBar>
            <MainMenu />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    height: '100vh',
                    overflow: 'auto',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar /> {/* This creates space for the fixed AppBar */}
                <Container maxWidth="xl">
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;
