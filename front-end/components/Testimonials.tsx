'use client';

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Project Manager',
        company: 'TechCorp',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        content:
            'TaskFlow has completely transformed how our team collaborates. The intuitive interface and powerful automation features have increased our productivity by 40%.',
        rating: 5,
    },
    {
        name: 'Michael Chen',
        role: 'CEO',
        company: 'StartupXYZ',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        content:
            'As a growing startup, we needed a solution that could scale with us. TaskFlow has been perfect - from 5 team members to 50, it just works.',
        rating: 5,
    },
    {
        name: 'Emily Rodriguez',
        role: 'Operations Director',
        company: 'Global Solutions',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        content:
            "The analytics and reporting features give us incredible insights into our team's performance. We can now make data-driven decisions with confidence.",
        rating: 5,
    },
    {
        name: 'David Kim',
        role: 'Team Lead',
        company: 'Design Studio',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        content:
            'The collaboration features are outstanding. Our remote team feels more connected than ever, and project delivery has never been smoother.',
        rating: 5,
    },
    {
        name: 'Lisa Thompson',
        role: 'Product Manager',
        company: 'InnovateCo',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        content:
            "TaskFlow's automation capabilities have saved us countless hours. What used to take days now happens automatically in the background.",
        rating: 5,
    },
    {
        name: 'James Wilson',
        role: 'CTO',
        company: 'TechFlow',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        content:
            'The security features and enterprise-grade infrastructure give us peace of mind. Our data is safe, and the platform is incredibly reliable.',
        rating: 5,
    },
];

export function Testimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const currentData = testimonials[currentTestimonial];

    return (
        <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>

                    {/* Floating dots with animation (These are small and might be okay, but can also be hidden if desired) */}
                    <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce delay-100"></div>
                    <div className="absolute top-40 left-16 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-bounce delay-300"></div>
                    <div className="absolute bottom-32 right-32 w-2 h-2 bg-indigo-400 rounded-full opacity-50 animate-bounce delay-500"></div>
                    <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce delay-700"></div>
                    <div className="absolute top-60 right-40 w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-bounce delay-900"></div>
                </div>

                {/* Enhanced Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                        <Star className="w-4 h-4 fill-current" />
                        Testimonials
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Join thousands of satisfied users who have transformed their workflow with
                        our platform
                    </p>
                </div>

                {/* Enhanced Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Side - Enhanced Profile Pictures Grid */}
                    <div className="flex-shrink-0 order-2 lg:order-1">
                        <div className="relative">
                            <div className="grid grid-cols-3 gap-4 w-fit">
                                {testimonials.slice(0, 6).map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className={`w-20 h-20 rounded-2xl overflow-hidden border-3 shadow-xl transition-all duration-500 cursor-pointer hover:scale-110 hover:shadow-2xl ${
                                            index === currentTestimonial
                                                ? 'border-blue-500 ring-4 ring-blue-200 dark:ring-blue-800 scale-110'
                                                : 'border-white dark:border-gray-600 hover:border-blue-300'
                                        } ${index === 1 ? 'rounded-lg' : ''}`}
                                        onClick={() => {
                                            setCurrentTestimonial(index);
                                            setIsAutoPlaying(false);
                                        }}
                                    >
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Stats overlay */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        4.9/5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Enhanced Testimonial Card */}
                    <div className="flex-1 max-w-3xl order-1 lg:order-2">
                        <div className="relative">
                            {/* Navigation buttons */}
                            <div className="absolute -top-4 right-0 flex gap-2 z-10">
                                <button
                                    onClick={prevTestimonial}
                                    className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative transition-all duration-500 hover:shadow-3xl">
                                {/* Enhanced Quote Icon */}
                                <div className="absolute top-6 right-8">
                                    <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800" />
                                </div>

                                {/* Testimonial Content with Animation */}
                                <div className="space-y-6">
                                    <div className="flex">
                                        {[...Array(currentData.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg md:text-xl font-medium">
                                        "{currentData.content}"
                                    </blockquote>
                                </div>

                                {/* Enhanced Author Info */}
                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                                        <img
                                            src={currentData.image}
                                            alt={currentData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {currentData.name}
                                        </h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                                            {currentData.role}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {currentData.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress indicator */}
                                <div className="flex gap-2 mt-6 justify-center">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentTestimonial(index);
                                                setIsAutoPlaying(false);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentTestimonial
                                                    ? 'bg-blue-500 w-8'
                                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                            }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 text-center">
                    <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">1000+ Happy Customers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                            <span className="text-sm font-medium">4.9/5 Average Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">99% Satisfaction Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
