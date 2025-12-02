# PayPal Checkout Sandbox Setup Guide

This guide will help you set up PayPal Checkout in sandbox/test mode for your VolVid AI application.

## Step 1: Create a PayPal Developer Account

1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Click "Sign Up" or "Log In" if you already have a PayPal account
3. Complete the account setup process

## Step 2: Create a Sandbox App

1. Log in to your PayPal Developer Dashboard
2. Navigate to **Dashboard** → **My Apps & Credentials**
3. Click **Create App** (or use an existing app)
4. Fill in the app details:
   - **App Name**: VolVid AI (or your preferred name)
   - **Merchant**: Select your sandbox business account
5. Click **Create App**

## Step 3: Get Your Sandbox Client ID

1. After creating the app, you'll see your **Sandbox** credentials
2. Copy the **Client ID** (starts with `A...` or `AY...`)
3. This is your sandbox client ID for testing

**Note**: Keep your **Secret** key secure - you'll need it for server-side operations if you implement them later.

## Step 4: Configure Environment Variables

Add your PayPal sandbox client ID to your `.env` file:

```env
# PayPal Sandbox Client ID
VITE_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
```

**Important**: 
- Never commit your `.env` file with real keys to version control
- The `.env` file is already in `.gitignore` for security

## Step 5: Test the Payment Flow

### Using PayPal Sandbox Test Accounts:

1. **Create Sandbox Test Accounts:**
   - In PayPal Developer Dashboard, go to **Accounts** → **Sandbox** → **Create Account**
   - Create a **Personal** account (for testing buyer)
   - Create a **Business** account (for testing merchant)

2. **Test Payment Flow:**
   - In your app, go to the Billing page
   - Click on any credit package
   - Click the PayPal button
   - You'll be redirected to PayPal sandbox
   - Log in with your sandbox **Personal** account credentials
   - Complete the payment
   - You'll be redirected back to your app
   - Credits should be added to your account automatically

### Test Account Credentials:

PayPal provides default sandbox accounts, but you can create custom ones:

**Default Sandbox Personal Account:**
- Email: `sb-xxxxx@personal.example.com` (provided by PayPal)
- Password: (set when creating account)

**Default Sandbox Business Account:**
- Email: `sb-xxxxx@business.example.com` (provided by PayPal)
- Password: (set when creating account)
image.png
## Step 6: Verify Payment Success

After a successful test payment:

1. **Check Firebase:**
   - User's credits should be updated in the `users` collection
   - A new transaction should be created in the `transactions` collection

2. **Check PayPal Dashboard:**
   - Go to **Dashboard** → **Sandbox** → **Transactions**
   - You'll see all test transactions
   - Click on a transaction to see details

## Step 7: Switch to Live Mode (When Ready)

1. **Complete PayPal Account Verification:**
   - Verify your business information
   - Complete identity verification
   - Link your bank account

2. **Get Live Credentials:**
   - In PayPal Developer Dashboard, switch to **Live** mode
   - Go to **My Apps & Credentials**
   - Copy your **Live Client ID**

3. **Update Environment Variables:**
   - Update `VITE_PAYPAL_CLIENT_ID` with your live client ID
   - Deploy your application

4. **Test with Real Payments:**
   - Use small amounts for initial testing
   - Verify transactions in PayPal Dashboard

## Troubleshooting

### PayPal Button Not Showing:
- Check that `VITE_PAYPAL_CLIENT_ID` is set in your `.env` file
- Verify the client ID is correct (sandbox client ID for testing)
- Check browser console for errors
- Ensure you're signed in to your app

### Payment Succeeds but Credits Not Added:
- Check browser console for errors
- Verify Firebase connection
- Check that user document exists in Firebase
- Verify transaction was created in `transactions` collection

### PayPal Redirect Issues:
- Ensure your app URL is added to PayPal app settings (if required)
- Check that you're using sandbox credentials for testing
- Verify the PayPal SDK is loading correctly

### CORS Errors:
- PayPal SDK should handle CORS automatically
- If issues persist, check PayPal app settings

## Security Notes

- **Never expose your Secret key** in frontend code
- Always use environment variables for sensitive keys
- Use sandbox credentials for development and testing
- Only use live credentials in production
- Regularly rotate your API keys
- Monitor transactions in PayPal Dashboard

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs)
- [PayPal Checkout Integration Guide](https://developer.paypal.com/docs/checkout)
- [PayPal Sandbox Testing Guide](https://developer.paypal.com/docs/api-basics/sandbox/)
- [PayPal API Reference](https://developer.paypal.com/docs/api/orders/v2/)

## Credit Packages

The current credit packages are:
- **12 Credits** - $1.00
- **60 Credits** - $5.00 (Popular)
- **120 Credits** - $10.00

You can modify these in `src/pages/Billing.tsx` in the `creditPackages` array.

