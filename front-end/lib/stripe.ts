import { loadStripe, Stripe } from '@stripe/stripe-js';

// Validate Stripe configuration
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured');
}

const stripePromise: Promise<Stripe | null> = stripePublicKey 
  ? loadStripe(stripePublicKey)
  : Promise.resolve(null);

export default stripePromise;

export { loadStripe };

export const isStripeConfigured = (): boolean => {
  return !!stripePublicKey;
};