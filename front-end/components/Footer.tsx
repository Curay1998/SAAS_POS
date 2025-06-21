'use client';
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Linkedin,
} from 'lucide-react';
const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Integrations', href: '#' },
        { name: 'API', href: '#' },
        { name: 'Security', href: '#' },
    ],

    company: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Contact', href: '#' },
    ],

    resources: [
        { name: 'Help Center', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Community', href: '#' },
        { name: 'Webinars', href: '#' },
    ],

    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'GDPR', href: '#' },
        { name: 'Compliance', href: '#' },
    ],
};
export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {' '}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {' '}
                {/* Main Footer Content */}{' '}
                <div className="py-16">
                    {' '}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                        {' '}
                        {/* Company Info */}{' '}
                        <div className="lg:col-span-2">
                            {' '}
                            <h3 className="text-2xl font-bold text-blue-400 mb-4">
                                {' '}
                                TaskFlow{' '}
                            </h3>{' '}
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {' '}
                                Empowering teams worldwide to collaborate better, work smarter, and
                                achieve more together. Transform your workflow with TaskFlow.{' '}
                            </p>{' '}
                            {/* Contact Info */}{' '}
                            <div className="space-y-3">
                                {' '}
                                <div className="flex items-center text-gray-300">
                                    {' '}
                                    <Mail className="w-5 h-5 mr-3" /> hello@taskflow.com{' '}
                                </div>{' '}
                                <div className="flex items-center text-gray-300">
                                    {' '}
                                    <Phone className="w-5 h-5 mr-3" /> +1 (555) 123-4567{' '}
                                </div>{' '}
                                <div className="flex items-center text-gray-300">
                                    {' '}
                                    <MapPin className="w-5 h-5 mr-3" /> San Francisco, CA{' '}
                                </div>{' '}
                            </div>{' '}
                        </div>{' '}
                        {/* Product Links */}{' '}
                        <div>
                            {' '}
                            <h4 className="font-semibold mb-4"> Product </h4>{' '}
                            <ul className="space-y-3">
                                {' '}
                                {footerLinks.product.map((link, index) => (
                                    <li key={index}>
                                        {' '}
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors"
                                        >
                                            {' '}
                                            {link.name}{' '}
                                        </a>{' '}
                                    </li>
                                ))}{' '}
                            </ul>{' '}
                        </div>{' '}
                        {/* Company Links */}{' '}
                        <div>
                            {' '}
                            <h4 className="font-semibold mb-4"> Company </h4>{' '}
                            <ul className="space-y-3">
                                {' '}
                                {footerLinks.company.map((link, index) => (
                                    <li key={index}>
                                        {' '}
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors"
                                        >
                                            {' '}
                                            {link.name}{' '}
                                        </a>{' '}
                                    </li>
                                ))}{' '}
                            </ul>{' '}
                        </div>{' '}
                        {/* Resources Links */}{' '}
                        <div>
                            {' '}
                            <h4 className="font-semibold mb-4"> Resources </h4>{' '}
                            <ul className="space-y-3">
                                {' '}
                                {footerLinks.resources.map((link, index) => (
                                    <li key={index}>
                                        {' '}
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors"
                                        >
                                            {' '}
                                            {link.name}{' '}
                                        </a>{' '}
                                    </li>
                                ))}{' '}
                            </ul>{' '}
                        </div>{' '}
                        {/* Legal Links */}{' '}
                        <div>
                            {' '}
                            <h4 className="font-semibold mb-4"> Legal </h4>{' '}
                            <ul className="space-y-3">
                                {' '}
                                {footerLinks.legal.map((link, index) => (
                                    <li key={index}>
                                        {' '}
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors"
                                        >
                                            {' '}
                                            {link.name}{' '}
                                        </a>{' '}
                                    </li>
                                ))}{' '}
                            </ul>{' '}
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
                {/* Newsletter Signup */}{' '}
                <div className="py-8 border-t border-gray-800">
                    {' '}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        {' '}
                        <div className="mb-4 md:mb-0">
                            {' '}
                            <h4 className="font-semibold mb-2"> Stay updated </h4>{' '}
                            <p className="text-gray-300">
                                {' '}
                                Get the latest news and updates from TaskFlow{' '}
                            </p>{' '}
                        </div>{' '}
                        <div className="flex w-full md:w-auto">
                            {' '}
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white"
                            />{' '}
                            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r-lg transition-colors">
                                {' '}
                                Subscribe{' '}
                            </button>{' '}
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
                {/* Bottom Footer */}{' '}
                <div className="py-8 border-t border-gray-800">
                    {' '}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        {' '}
                        <div className="text-gray-400 mb-4 md:mb-0">
                            {' '}
                            © 2024 TaskFlow. All rights reserved.{' '}
                        </div>{' '}
                        {/* Social Links */}{' '}
                        <div className="flex space-x-6">
                            {' '}
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                {' '}
                                <Facebook className="w-5 h-5" />{' '}
                            </a>{' '}
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                {' '}
                                <Twitter className="w-5 h-5" />{' '}
                            </a>{' '}
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                {' '}
                                <Linkedin className="w-5 h-5" />{' '}
                            </a>{' '}
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                {' '}
                                <Instagram className="w-5 h-5" />{' '}
                            </a>{' '}
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
            </div>{' '}
        </footer>
    );
}
