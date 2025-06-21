'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { ...toast, id };
        
        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message: string, title?: string) => {
        addToast({ type: 'success', message, title });
    };

    const error = (message: string, title?: string) => {
        addToast({ type: 'error', message, title });
    };

    const info = (message: string, title?: string) => {
        addToast({ type: 'info', message, title });
    };

    const warning = (message: string, title?: string) => {
        addToast({ type: 'warning', message, title });
    };

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            info,
            warning
        }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';
            default:
                return 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400';
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 flex-shrink-0" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 flex-shrink-0" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
            case 'info':
                return <Info className="h-5 w-5 flex-shrink-0" />;
            default:
                return <Info className="h-5 w-5 flex-shrink-0" />;
        }
    };

    return (
        <div className={`border rounded-lg p-4 shadow-lg transition-all duration-300 transform animate-in slide-in-from-right ${getToastStyles()}`}>
            <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <p className="text-sm font-medium mb-1">
                            {toast.title}
                        </p>
                    )}
                    <p className="text-sm">
                        {toast.message}
                    </p>
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}