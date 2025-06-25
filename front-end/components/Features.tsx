'use client';

import {
    Calendar,
    Users,
    BarChart3,
    Zap,
    Shield,
    Globe,
    Clock,
    MessageSquare,
    Target,
} from 'lucide-react';

const features = [
    {
        icon: Calendar,
        title: 'Project Planning',
        description:
            'Plan and organize projects with intuitive timelines, milestones, and dependencies.',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description:
            'Bring your team together with real-time collaboration tools and shared workspaces.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description:
            'Get insights into team performance with detailed reports and customizable dashboards.',
    },
    {
        icon: Zap,
        title: 'Automation',
        description:
            'Automate repetitive tasks and workflows to save time and reduce manual errors.',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description:
            'Bank-level security with SSO, 2FA, and compliance with SOC 2 and GDPR standards.',
    },
    {
        icon: Globe,
        title: 'Global Access',
        description:
            'Access your work from anywhere with our cloud-based platform and mobile apps.',
    },
    {
        icon: Clock,
        title: 'Time Tracking',
        description: 'Track time spent on tasks and projects with built-in timers and reporting.',
    },
    {
        icon: MessageSquare,
        title: 'Communication Hub',
        description:
            'Centralize team communication with comments, mentions, and notification management.',
    },
    {
        icon: Target,
        title: 'Goal Setting',
        description: 'Set and track goals with OKRs, KPIs, and progress visualization tools.',
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            ✨ Comprehensive Feature Set
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Everything you need to
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            {' '}
                            succeed
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Powerful features designed to streamline your workflow and boost team
                        productivity with cutting-edge technology
                    </p>
                </div>
                =======
                {/* Features Grid */}
                <div className="relative mb-20">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {features.slice(0, 6).map((feature, index) => {
                            const gradients = [
                                'from-blue-500 to-cyan-500',
                                'from-purple-500 to-pink-500',
                                'from-green-500 to-emerald-500',
                                'from-orange-500 to-red-500',
                                'from-indigo-500 to-purple-500',
                                'from-teal-500 to-blue-500',
                            ];

                            const bgGradients = [
                                'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
                                'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                                'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                                'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
                                'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
                                'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20',
                            ];

                            const shadowColors = [
                                'group-hover:shadow-blue-500/25',
                                'group-hover:shadow-purple-500/25',
                                'group-hover:shadow-green-500/25',
                                'group-hover:shadow-orange-500/25',
                                'group-hover:shadow-indigo-500/25',
                                'group-hover:shadow-teal-500/25',
                            ];

                            return (
                                <div
                                    key={index}
                                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgGradients[index]} border border-white/20 dark:border-gray-700/50 backdrop-blur-xl transition-all duration-700 hover:scale-105 hover:-translate-y-4 hover:shadow-2xl ${shadowColors[index]}`}
                                >
                                    {/* Animated background pattern */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </div>

                                    {/* Card content */}
                                    <div className="relative z-10 p-8 h-full flex flex-col">
                                        {/* Icon with unique positioning */}
                                        <div className="relative mb-8">
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-r ${gradients[index]} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
                                            ></div>
                                            <div
                                                className={`relative w-20 h-20 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                                            >
                                                <feature.icon className="h-10 w-10 text-white drop-shadow-lg" />
                                            </div>
                                            {/* Floating number indicator */}
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 shadow-lg border-2 border-gray-100 dark:border-gray-700">
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base mb-6">
                                                {feature.description}
                                            </p>
                                        </div>

                                        {/* Interactive bottom section */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <div
                                                className={`flex items-center text-transparent bg-clip-text bg-gradient-to-r ${gradients[index]} font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}
                                            >
                                                <span className="text-sm">Explore</span>
                                                <svg
                                                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex space-x-1">
                                                <div
                                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradients[index]} opacity-60`}
                                                ></div>
                                                <div
                                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradients[index]} opacity-40`}
                                                ></div>
                                                <div
                                                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradients[index]} opacity-20`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corner accent */}
                                    <div
                                        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradients[index]} opacity-10 transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700`}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                ======= =======
                {/* Feature Highlight */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-3xl p-8 md:p-16">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl hidden lg:block"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl hidden lg:block"></div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 mb-6">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    🤖 AI-Powered
                                </span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    AI-Powered
                                </span>{' '}
                                Insights
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Our advanced AI analyzes your team's work patterns and provides
                                intelligent recommendations to optimize productivity and predict
                                project outcomes with unprecedented accuracy.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center text-gray-700 dark:text-gray-300 text-lg">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                                    Predictive project timeline analysis with 95% accuracy
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300 text-lg">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                                    Automated task prioritization based on impact
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300 text-lg">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex-shrink-0"></div>
                                    Smart resource allocation with real-time optimization
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
                            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                        AI Insights Dashboard
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                            Live
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            Project completion
                                        </span>
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                            87%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full w-[87%] shadow-lg"></div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Estimated completion
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            3 days ahead
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                98%
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Accuracy
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                24/7
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Monitoring
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                =======
            </div>
        </section>
    );
}
