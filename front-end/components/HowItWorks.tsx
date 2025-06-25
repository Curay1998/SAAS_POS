'use client';

import { UserPlus, Settings, Rocket, BarChart } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: 'Set Up Your Team',
        description:
            'Invite team members and set up your workspace in minutes. Define roles and permissions for seamless collaboration.',
        step: '01',
    },
    {
        icon: Settings,
        title: 'Configure Workflows',
        description:
            "Create custom workflows that match your team's processes. Set up automation rules and approval chains.",
        step: '02',
    },
    {
        icon: Rocket,
        title: 'Launch Projects',
        description:
            'Start managing projects with our intuitive interface. Create tasks, set deadlines, and track progress in real-time.',
        step: '03',
    },
    {
        icon: BarChart,
        title: 'Analyze & Optimize',
        description:
            'Use our analytics dashboard to gain insights into team performance and continuously improve your processes.',
        step: '04',
    },
];

export function HowItWorks() {
    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 bg-[size:20px_20px] opacity-50"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl hidden md:block"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                        Simple Process
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
                        Get started in
                        <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            4 simple steps
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        From setup to success, we'll guide you through every step of your journey
                        with our intuitive platform
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-20 left-full w-full h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 dark:from-blue-800 dark:via-indigo-700 dark:to-blue-800 z-0">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                </div>
                            )}

                            {/* Step Card */}
                            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 group-hover:scale-105 z-10">
                                {/* Step Number */}
                                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                                    {step.step}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="relative bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-950/80 backdrop-blur-xl rounded-3xl p-12 border border-white/30 dark:border-gray-700/50 max-w-3xl mx-auto shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
                        <div className="relative">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                Ready to Start?
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">
                                Ready to transform your workflow?
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of teams who have already revolutionized their
                                project management with our cutting-edge platform
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                                    <span className="relative z-10">Start Your Free Trial</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 flex items-center">
                                    Watch Demo
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4h6zM4 20h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
