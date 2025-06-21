# 🚀 Complete Stripe Configuration Guide

This guide walks you through setting up Stripe for your SaaS Sticky Note application, from account creation to production deployment.

## 📋 Table of Contents

1. [Stripe Account Setup](#1-stripe-account-setup)
2. [Backend Configuration (Laravel)](#2-backend-configuration-laravel)
3. [Frontend Configuration (Next.js)](#3-frontend-configuration-nextjs)
4. [Creating Products & Prices in Stripe](#4-creating-products--prices-in-stripe)
5. [Webhook Configuration](#5-webhook-configuration)
6. [Testing Setup](#6-testing-setup)
7. [Production Deployment](#7-production-deployment)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Stripe Account Setup

### Step 1.1: Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create an account
3. Complete email verification
4. Fill out your business information

### Step 1.2: Get API Keys
1. Navigate to **Dashboard** → **Developers** → **API Keys**
2. Note down your keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### Step 1.3: Enable Test Mode
- Make sure you're in **Test mode** (toggle in top left)
- Test mode allows you to test without real money

---

## 2. Backend Configuration (Laravel)

### Step 2.1: Environment Variables

Add these variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET=sk_test_your_stripe_secret_key_here
CASHIER_CURRENCY=usd
CASHIER_LOGGER=daily

# Webhook Configuration (we'll add this later)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 2.2: Replace Test Keys

Replace the placeholder keys with your actual Stripe keys:

1. **Backend** (`/back-end/.env`):
   ```env
   STRIPE_KEY=pk_test_51...  # Your actual publishable key
   STRIPE_SECRET=sk_test_51...  # Your actual secret key
   ```

### Step 2.3: Verify Laravel Cashier Configuration

Check that Cashier is properly configured in `config/services.php`:

```php
'stripe' => [
    'model' => App\Models\User::class,
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook' => [
        'secret' => env('STRIPE_WEBHOOK_SECRET'),
        'tolerance' => env('STRIPE_WEBHOOK_TOLERANCE', 300),
    ],
],
```

---

## 3. Frontend Configuration (Next.js)

### Step 3.1: Environment Variables

Add to your `/front-end/.env.local` file:

```env
# Next.js environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### Step 3.2: Replace Frontend Keys

Update with your actual publishable key:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...  # Your actual publishable key
```

⚠️ **Important**: Only use the **publishable key** in frontend environment variables. Never expose your secret key in frontend code.

---

## 4. Creating Products & Prices in Stripe

### Step 4.1: Create Products in Stripe Dashboard

1. Go to **Dashboard** → **Products** → **Add product**
2. Create three products:

#### Product 1: Starter Plan
- **Name**: Starter
- **Description**: Perfect for individuals and small teams getting started
- **Pricing**: 
  - One-time or Recurring: **Recurring**
  - Price: **$0.00**
  - Billing period: **Monthly**
- Click **Save product**
- **Copy the Price ID** (starts with `price_`)

#### Product 2: Professional Plan
- **Name**: Professional  
- **Description**: Ideal for growing teams and businesses
- **Pricing**:
  - One-time or Recurring: **Recurring**
  - Price: **$15.00**
  - Billing period: **Monthly**
- Click **Save product**
- **Copy the Price ID** (starts with `price_`)

#### Product 3: Enterprise Plan
- **Name**: Enterprise
- **Description**: For large organizations with advanced needs
- **Pricing**:
  - One-time or Recurring: **Recurring**
  - Price: **$49.00**
  - Billing period: **Monthly**
- Click **Save product**
- **Copy the Price ID** (starts with `price_`)

### Step 4.2: Update Database with Stripe IDs

Run this in your Laravel backend to update plans with Stripe IDs:

```bash
cd back-end
php artisan tinker
```

Then execute:

```php
// Update Starter Plan
$starter = App\Models\Plan::where('name', 'Starter')->first();
$starter->stripe_price_id = 'price_1234567890abcdef';  // Replace with actual Price ID
$starter->stripe_product_id = 'prod_1234567890abcdef';  // Replace with actual Product ID
$starter->save();

// Update Professional Plan
$pro = App\Models\Plan::where('name', 'Professional')->first();
$pro->stripe_price_id = 'price_abcdef1234567890';  // Replace with actual Price ID
$pro->stripe_product_id = 'prod_abcdef1234567890';  // Replace with actual Product ID
$pro->save();

// Update Enterprise Plan
$enterprise = App\Models\Plan::where('name', 'Enterprise')->first();
$enterprise->stripe_price_id = 'price_fedcba0987654321';  // Replace with actual Price ID
$enterprise->stripe_product_id = 'prod_fedcba0987654321';  // Replace with actual Product ID
$enterprise->save();
```

---

## 5. Webhook Configuration

### Step 5.1: Install ngrok (for local testing)

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/download

# Create account at https://ngrok.com and get auth token
ngrok authtoken YOUR_AUTH_TOKEN
```

### Step 5.2: Expose Local Laravel Server

```bash
# Start your Laravel server
cd back-end
php artisan serve  # Runs on http://localhost:8000

# In another terminal, expose it
ngrok http 8000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 5.3: Create Webhook Endpoint in Stripe

1. Go to **Dashboard** → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-ngrok-url.ngrok.io/stripe/webhook`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_`)

### Step 5.4: Add Webhook Secret to Environment

Add to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### Step 5.5: Create Webhook Route (if not exists)

Add to `routes/web.php`:

```php
Route::post('/stripe/webhook', function (Request $request) {
    return response('OK', 200);
})->middleware('api');
```

---

## 6. Testing Setup

### Step 6.1: Test Credit Cards

Use these test card numbers:

- **Successful payment**: `4242424242424242`
- **Declined payment**: `4000000000000002`
- **Requires authentication**: `4000002500003155`

**Test card details:**
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Step 6.2: Test the Flow

1. **Start your servers**:
   ```bash
   # Backend
   cd back-end
   php artisan serve

   # Frontend  
   cd front-end
   npm run dev

   # ngrok (for webhooks)
   ngrok http 8000
   ```

2. **Test subscription flow**:
   - Go to `http://localhost:3000`
   - Navigate to pricing page
   - Click "Subscribe Now" on Professional plan
   - Use test card: `4242424242424242`
   - Complete the subscription

3. **Verify in Stripe Dashboard**:
   - Go to **Dashboard** → **Customers**
   - See your test customer
   - Check **Dashboard** → **Subscriptions**

### Step 6.3: Test Webhook Events

1. Make a test subscription
2. Go to **Dashboard** → **Developers** → **Webhooks**
3. Click your webhook endpoint
4. Check the **Recent deliveries** tab
5. Verify events are being received

---

## 7. Production Deployment

### Step 7.1: Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live mode**
2. Go to **Dashboard** → **Developers** → **API Keys**
3. Get your live keys:
   - Live publishable key (starts with `pk_live_`)
   - Live secret key (starts with `sk_live_`)

### Step 7.2: Update Production Environment

**Backend production `.env`**:
```env
STRIPE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

**Frontend production environment**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
NEXT_PUBLIC_API_URL=https://your-production-api.com/api/v1
```

### Step 7.3: Update Webhook URLs

1. Go to **Dashboard** → **Developers** → **Webhooks**
2. Update webhook URL to your production domain:
   - `https://your-production-api.com/stripe/webhook`

### Step 7.4: Recreate Products in Live Mode

Repeat Step 4 in Live mode to create your products and update your database with live Price IDs.

---

## 8. Troubleshooting

### Common Issues & Solutions

#### 🔴 "No such price" error
**Solution**: Verify the `stripe_price_id` in your database matches the Price ID in Stripe Dashboard.

#### 🔴 Webhook not receiving events
**Solutions**:
- Check webhook URL is accessible
- Verify webhook secret in environment
- Check Stripe webhook logs for delivery failures

#### 🔴 "Invalid API key" error
**Solutions**:
- Verify you're using the correct key for your mode (test/live)
- Check environment variables are loaded correctly
- Restart your application after changing environment variables

#### 🔴 Payment fails immediately
**Solutions**:
- Verify you're using test cards in test mode
- Check browser console for JavaScript errors
- Verify Stripe publishable key is correct

#### 🔴 Frontend can't connect to backend
**Solutions**:
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend server is running
- Check CORS configuration

### Debug Commands

**Test Stripe connection**:
```bash
cd back-end
php artisan tinker
\Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
\Stripe\Customer::all(['limit' => 1]);
```

**Check environment variables**:
```bash
cd back-end
php artisan config:show | grep stripe
```

**Test webhook locally**:
```bash
stripe listen --forward-to localhost:8000/stripe/webhook
```

---

## 🎉 Congratulations!

You've successfully configured Stripe for your SaaS application! Your users can now:

- ✅ View dynamic pricing plans
- ✅ Subscribe to paid plans
- ✅ Manage their subscriptions
- ✅ Upgrade/downgrade plans
- ✅ Cancel subscriptions

### Next Steps

1. **Customize** your pricing plans in Stripe Dashboard
2. **Add** more subscription features (trials, coupons, etc.)
3. **Monitor** your subscriptions in Stripe Dashboard
4. **Set up** email notifications for subscription events
5. **Implement** usage-based billing if needed

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review **Stripe Dashboard** → **Logs** for errors
3. Check **Laravel logs** in `storage/logs/laravel.log`
4. Consult [Stripe Documentation](https://stripe.com/docs)
5. Review [Laravel Cashier Documentation](https://laravel.com/docs/billing)

---

*Happy coding! 🚀*