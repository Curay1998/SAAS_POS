import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const metadata: Metadata = {
    title: 'TaskFlow - Project Management & Team Collaboration Platform',
    description:
        "Transform your team's productivity with TaskFlow. Intuitive project management, powerful automation, and seamless collaboration tools for teams of all sizes.",
    keywords:
        'project management, team collaboration, task management, productivity, workflow automation, project planning',
    authors: [{ name: 'TaskFlow Team' }],
    openGraph: {
        title: 'TaskFlow - Project Management & Team Collaboration Platform',
        description:
            "Transform your team's productivity with TaskFlow. Intuitive project management, powerful automation, and seamless collaboration tools.",
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TaskFlow - Project Management & Team Collaboration Platform',
        description:
            "Transform your team's productivity with TaskFlow. Intuitive project management, powerful automation, and seamless collaboration tools.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ToastProvider>
                    <AuthProvider>
                        <NotificationProvider>
                            {children}
                        </NotificationProvider>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
