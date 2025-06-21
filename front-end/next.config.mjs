import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    /**
     * Add headers globally to loosen the Content-Security-Policy so that
     * Stripe Elements (js.stripe.com) and the hCaptcha challenge they load
     * can work in both development and production.
     */
    async headers() {
        // NOTE: each directive must be on the same line when ultimately sent
        // so we strip extra whitespace at the end.
        const ContentSecurityPolicy = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.hcaptcha.com;
            frame-src 'self' https://js.stripe.com https://*.hcaptcha.com;
            connect-src 'self' https://api.stripe.com https://*.stripe.com https://*.hcaptcha.com http://127.0.0.1:49353 https://127.0.0.1:49353 http://localhost:3000 http://localhost:8000 https://www.google-analytics.com https://analytics.google.com https://play.google.com https://www.recaptcha.net https://www.gstatic.com https://*.ingest.sentry.io https://api.segment.io https://csp.withgoogle.com;
            worker-src 'self' blob: https://js.stripe.com;
            img-src * data: blob:;
            style-src 'self' 'unsafe-inline';
        `.replace(/\s{2,}/g, ' ').trim();

        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: ContentSecurityPolicy,
                    },
                ],
            },
        ];
    },
};
export default nextConfig;
