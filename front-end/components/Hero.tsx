'use client';

import { ArrowRight, Play, Sparkles, Users, Zap } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative pt-16 pb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mt-12 relative z-10">
                    {/* Animated Badge */}

                    <div className="inline-flex items-center mb-8">
                        <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 p-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
                            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full px-6 py-3 border border-white/50 dark:border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ✨ Now with AI-Powered Insights
                                    </span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Revolutionary Main Headline */}
                    <div className="relative mb-8">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                            <span className="block mb-2">
                                <span className="relative">
                                    Manage your team's
                                    <div className="absolute -top-4 -right-8 w-8 h-8 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
                                </span>
                            </span>
                            <span className="block relative mb-2">
                                <span className="relative inline-block">
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-30 animate-pulse"></span>
                                    <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black">
                                        workflow
                                    </span>
                                </span>
                            </span>
                            <span className="block">
                                <span className="relative">
                                    like never before
                                    <div className="absolute -bottom-4 -left-8 w-6 h-6 bg-purple-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
                                </span>
                            </span>
                        </h1>

                        {/* Floating decorative elements */}
                        <div className="absolute top-0 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-float"></div>
                        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-float delay-1000"></div>
                        <div className="absolute bottom-0 left-1/3 w-5 h-5 bg-pink-400/30 rounded-full animate-float delay-2000"></div>
                    </div>

                    {/* Enhanced Subheadline */}

                    {/* Enhanced Feature highlights */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto">
                        {[
                            {
                                icon: Users,
                                text: '50k+ Teams',
                                color: 'blue',
                                bgColor: 'from-blue-500 to-cyan-500',
                            },
                            {
                                icon: Zap,
                                text: 'AI-Powered',
                                color: 'purple',
                                bgColor: 'from-purple-500 to-pink-500',
                            },
                            {
                                icon: Sparkles,
                                text: 'Real-time Sync',
                                color: 'indigo',
                                bgColor: 'from-indigo-500 to-purple-500',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 px-6 py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-r ${item.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                ></div>
                                <div className="relative flex items-center space-x-3">
                                    <div
                                        className={`p-2 rounded-xl bg-gradient-to-r ${item.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revolutionary CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-500 flex items-center shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <span className="relative z-10">Start Free Trial</span>
                            <ArrowRight className="relative z-10 ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                        <button className="group relative overflow-hidden border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center backdrop-blur-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Play className="relative z-10 mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />

                            <span className="relative z-10">Watch Demo</span>
                        </button>
                    </div>

                    {/* Premium Social Proof */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center mb-8 px-6 py-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg">
                            <div className="flex items-center space-x-2 mr-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                    LIVE
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-bold">
                                Trusted by{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    50,000+
                                </span>{' '}
                                teams worldwide
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center max-w-4xl mx-auto">
                            {[
                                { name: 'Microsoft', gradient: 'from-blue-600 to-blue-800' },
                                { name: 'Spotify', gradient: 'from-green-600 to-green-800' },
                                { name: 'Airbnb', gradient: 'from-red-600 to-pink-600' },
                                { name: 'Netflix', gradient: 'from-red-600 to-red-800' },
                                { name: 'Uber', gradient: 'from-gray-800 to-gray-900' },
                            ].map((company, index) => (
                                <div
                                    key={index}
                                    className="group relative p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r ${company.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                                    ></div>
                                    <div className="relative text-lg font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                        {company.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                =======
                {/* Enhanced Hero Image/Dashboard Preview */}
                <div className="mt-12 relative">
                    {/* Floating elements around the dashboard */}
                    <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -top-4 -right-12 w-12 h-12 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-500"></div>

                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 px-8 py-6 border-b border-gray-200/50 dark:border-gray-600/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg animate-pulse delay-200"></div>
                                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg animate-pulse delay-400"></div>
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    TaskFlow Dashboard
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg w-3/4 animate-pulse"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700 rounded-lg animate-pulse"></div>
                                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-lg w-5/6 animate-pulse delay-100"></div>
                                        <div className="h-4 bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800 dark:to-yellow-700 rounded-lg w-4/6 animate-pulse delay-200"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg w-2/3 animate-pulse delay-300"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-lg w-5/6 animate-pulse delay-400"></div>
                                        <div className="h-4 bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 rounded-lg animate-pulse delay-500"></div>
                                        <div className="h-4 bg-gradient-to-r from-indigo-200 to-indigo-300 dark:from-indigo-800 dark:to-indigo-700 rounded-lg w-3/4 animate-pulse delay-600"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded-lg w-1/2 animate-pulse delay-700"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gradient-to-r from-teal-200 to-teal-300 dark:from-teal-800 dark:to-teal-700 rounded-lg w-4/6 animate-pulse delay-800"></div>
                                        <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-700 rounded-lg w-5/6 animate-pulse delay-900"></div>
                                        <div className="h-4 bg-gradient-to-r from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-700 rounded-lg animate-pulse delay-1000"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
