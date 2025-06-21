'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden">
                    <div className="px-8 py-16 md:px-16 md:py-20 text-center text-white relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                        </div>

                        <div className="relative z-10">
                            {/* Main Headline */}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Ready to revolutionize your
                                <br />
                                team's productivity?
                            </h2>

                            {/* Subheadline */}
                            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                                Join thousands of teams who have transformed their workflow with
                                TaskFlow. Start your free trial today - no credit card required.
                            </p>

                            {/* Benefits List */}
                            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
                                <div className="flex items-center text-blue-100">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    14-day free trial
                                </div>
                                <div className="flex items-center text-blue-100">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    No credit card required
                                </div>
                                <div className="flex items-center text-blue-100">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Cancel anytime
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center group">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200">
                                    Schedule Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 pt-8 border-t border-blue-500/30">
                                <p className="text-blue-200 mb-4">Trusted by industry leaders</p>
                                <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                                    <div className="text-lg font-semibold">Microsoft</div>
                                    <div className="text-lg font-semibold">Spotify</div>
                                    <div className="text-lg font-semibold">Airbnb</div>
                                    <div className="text-lg font-semibold">Netflix</div>
                                    <div className="text-lg font-semibold">Uber</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
