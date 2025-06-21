# 🚀 Quick Stripe Setup Guide

## 1. Super Admin Login Credentials
- **Email:** `admin@taskflow.com`
- **Password:** `admin123`

## 2. Complete Stripe Setup (Step by Step)

### Step 2.1: Get Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up/Login to your Stripe account
3. Make sure you're in **Test mode** (toggle in top left)
4. Go to **Developers** → **API Keys**
5. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2.2: Add Keys to Backend
Add these to your `/back-end/.env` file:
```env
STRIPE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET=sk_test_your_actual_secret_key
CASHIER_CURRENCY=usd
CASHIER_LOGGER=daily
```

### Step 2.3: Add Keys to Frontend
Add to your `/front-end/.env.local` file:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Step 2.4: Create Stripe Products
In Stripe Dashboard, go to **Products** → **Add product** and create:

#### Product 1: Professional Plan
- **Name:** Professional
- **Description:** Ideal for growing teams and businesses
- **Pricing:** Recurring, $15.00/month
- Copy the **Price ID** (starts with `price_`)

#### Product 2: Enterprise Plan  
- **Name:** Enterprise
- **Description:** For large organizations with advanced needs
- **Pricing:** Recurring, $49.00/month
- Copy the **Price ID** (starts with `price_`)

### Step 2.5: Update Database with Stripe IDs
```bash
cd back-end
php artisan tinker
```

Then run:
```php
// Update Professional Plan
$pro = App\Models\Plan::where('name', 'Professional')->first();
$pro->stripe_price_id = 'price_YOUR_PROFESSIONAL_PRICE_ID';
$pro->save();

// Update Enterprise Plan
$enterprise = App\Models\Plan::where('name', 'Enterprise')->first();
$enterprise->stripe_price_id = 'price_YOUR_ENTERPRISE_PRICE_ID';
$enterprise->save();

exit
```

### Step 2.6: Setup Webhooks (Optional for Testing)
1. Install ngrok: `brew install ngrok`
2. Start backend: `php artisan serve`
3. In new terminal: `ngrok http 8000`
4. Copy the https URL (e.g., `https://abc123.ngrok.io`)
5. In Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
6. **Endpoint URL:** `https://your-ngrok-url.ngrok.io/stripe/webhook`
7. **Events:** Select these:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
8. Copy the **Signing secret** (starts with `whsec_`)
9. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret`

## 3. Test the Complete System

### Start Backend:
```bash
cd back-end
php artisan serve
```

### Start Frontend:
```bash
cd front-end
npm run dev
```

### Testing Flow:
1. **Admin Access:**
   - Go to `http://localhost:3000/auth/login`
   - Login with `admin@taskflow.com` / `admin123`
   - Navigate to admin dashboard to manage plans

2. **Customer Trial:**
   - Register a new customer account
   - Go to subscription/pricing page
   - Start a 14-day trial for Professional plan
   - Or 7-day trial for Enterprise plan

3. **Test Cards:**
   - **Success:** `4242424242424242`
   - **Decline:** `4000000000000002`
   - **Expiry:** Any future date (12/34)
   - **CVC:** Any 3 digits (123)

## 4. Current Features Working

✅ **Super Admin:**
- Login with `admin@taskflow.com` / `admin123`
- Manage all plans (CRUD operations)
- View user subscriptions and payments

✅ **Plans Available:**
- **Starter:** Free plan (no trial needed)
- **Professional:** $15/month with 14-day trial
- **Enterprise:** $49/month with 7-day trial

✅ **Customer Features:**
- Start free trials without payment method
- Subscribe to paid plans after trial
- Trial automatically expires and requires payment
- Cancel subscriptions anytime

✅ **Stripe Integration:**
- Full Laravel Cashier integration
- Webhook handling for subscription events
- Trial period management
- Payment processing

## 5. What Happens Next

1. **Trial Users:** Can access full plan features during trial
2. **Trial Expiration:** User must add payment method to continue
3. **Paid Subscriptions:** Full access until cancelled
4. **Cancellations:** Users moved back to free plan

## 6. Admin Dashboard Features

- View all users and their subscription status
- Manage plans (add, edit, delete, archive)
- Toggle trial periods for plans
- Monitor subscription revenue and metrics

---

🎉 **You're all set!** The system now has complete Stripe integration with trials working end-to-end.