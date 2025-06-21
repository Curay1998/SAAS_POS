'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, AuthService } from '@/lib/auth';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (
        email: string,
        password: string,
        name: string,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    const authService = AuthService.getInstance();

    useEffect(() => {
        // Check for existing session on mount
        const initializeAuth = async () => {
            const user = authService.getCurrentUser();
            
            if (user) {
                // If we have a stored user, try to verify with server
                try {
                    const freshUser = await authService.fetchCurrentUser();
                    setAuthState({
                        user: freshUser,
                        isLoading: false,
                        isAuthenticated: !!freshUser,
                    });
                } catch (error) {
                    // Token is invalid, clear local storage
                    setAuthState({
                        user: null,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const result = await authService.login(email, password);

        if (result.success && result.user) {
            setAuthState({
                user: result.user,
                isLoading: false,
                isAuthenticated: true,
            });
            return { success: true };
        } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            return { success: false, error: result.error };
        }
    };

    const register = async (email: string, password: string, name: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const result = await authService.register(email, password, name);

        if (result.success && result.user) {
            setAuthState({
                user: result.user,
                isLoading: false,
                isAuthenticated: true,
            });
            return { success: true };
        } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            return { success: false, error: result.error };
        }
    };

    const logout = async () => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        
        await authService.logout();
        setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
        });
    };

    const isAdmin = () => {
        return authService.isAdmin();
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                register,
                logout,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
