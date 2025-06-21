'use client';

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { Pricing } from '@/components/Pricing';
import { Testimonials } from '@/components/Testimonials';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { StickyNote } from 'lucide-react';

export default function Page() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Header />

            {/* Quick Access to Sticky Notes */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link
                    href="/notes"
                    className="flex items-center justify-center w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
                    title="Open Sticky Notes"
                >
                    <StickyNote className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </Link>
            </div>

            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
