'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/auth/login');
    };

    const handleStartTrial = () => {
        if (isAuthenticated) {
            router.push('/dashboard');
        } else {
            router.push('/auth/register');
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    const handleAdmin = () => {
        router.push('/admin');
    };

    return (
        <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => router.push('/')}
                                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                                aria-label="TaskFlow Home"
                            >
                                TaskFlow
                            </button>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
                        <div className="relative group">
                            {/* Assuming this might become a dropdown. If not, it should be an <a> tag. */}
                            <button
                                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                // Add aria-expanded and aria-controls if it becomes a dropdown
                            >
                                Features
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                        <a
                            href="#pricing"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Pricing
                        </a>
                        <a
                            href="#about"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Welcome, {user?.name}
                                </span>
                                <button
                                    onClick={handleDashboard}
                                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <User className="h-4 w-4 mr-1" />
                                    Dashboard
                                </button>
                                {isAdmin() && (
                                    <button
                                        onClick={handleAdmin}
                                        className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                    >
                                        <Shield className="h-4 w-4 mr-1" />
                                        Admin
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={handleSignIn}
                                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={handleStartTrial}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Start Free Trial
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu-nav"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Overlay */}
            {isMenuOpen && (
                <div id="mobile-menu-nav" className="md:hidden absolute top-16 inset-x-0 z-40 transform shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto" role="navigation" aria-label="Mobile menu">
                        <a
                            href="#features"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                        >
                            Pricing
                        </a>
                        <a
                            href="#about"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                        >
                            Contact
                        </a>
                        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                            {isAuthenticated ? (
                                <div className="px-3 space-y-2">
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        Welcome, {user?.name}
                                    </div>
                                    <button
                                        onClick={() => { handleDashboard(); setIsMenuOpen(false); }}
                                        className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        <User className="h-5 w-5 mr-2" />
                                        Dashboard
                                    </button>
                                    {isAdmin() && (
                                        <button
                                            onClick={() => { handleAdmin(); setIsMenuOpen(false); }}
                                            className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                        >
                                            <Shield className="h-5 w-5 mr-2" />
                                            Admin Panel
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="px-3 space-y-2">
                                    <button
                                        onClick={() => { handleSignIn(); setIsMenuOpen(false); }}
                                        className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => { handleStartTrial(); setIsMenuOpen(false); }}
                                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-base font-medium transition-colors"
                                    >
                                        Start Free Trial
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
