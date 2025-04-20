import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface UserData {
    email: string;
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/user/`, {
                headers: {
                    Authorization: `Bearer ${tokens?.access}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        }
    }, [tokens]);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('userData');
        
        if (accessToken && refreshToken && userData) {
            setTokens({ access: accessToken, refresh: refreshToken });
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (tokens?.access) {
            fetchUser();
        }
    }, [tokens, fetchUser]);

    const login = useCallback(async (username: string, password: string) => {
        try {
            const response = await authService.login(username, password);
            const { access, refresh, user } = response;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('userData', JSON.stringify(user));
            setTokens({ access, refresh });
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        try {
            const response = await authService.register({ username, email, password });
            const { access, refresh, user } = response;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('userData', JSON.stringify(user));
            setTokens({ access, refresh });
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userData');
            setTokens(null);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

