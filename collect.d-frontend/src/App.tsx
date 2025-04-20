// -------------------------------------------------------------------------
// 3. Main Application Setup (src/App.tsx)
// -------------------------------------------------------------------------
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/customers"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Customers />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/invoices"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Invoices />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/payments"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Payments />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Reports />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Settings />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

