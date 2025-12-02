# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/65210d98-78c6-4bfc-9c14-429ca607e5cc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/65210d98-78c6-4bfc-9c14-429ca607e5cc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Setup

Before running the application, you need to configure the following:

1. Create a `.env` file in the root directory
2. Add all required keys (see below)
3. The `.env` file is already in `.gitignore` to keep your keys secure

### Required Environment Variables:

```env
# Kie AI API
VITE_KIE_AI_API_KEY=your_actual_api_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=volvid-2afd0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=volvid-2afd0
VITE_FIREBASE_STORAGE_BUCKET=volvid-2afd0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=428692290057
VITE_FIREBASE_APP_ID=1:428692290057:web:7050f50d1948e7362056d8
VITE_FIREBASE_MEASUREMENT_ID=G-PEQ4EWSJSR

# PayPal (Sandbox)
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id_here

```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- PayPal Checkout (Sandbox for payments)
- Kie AI API (Sora 2 text-to-video)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/65210d98-78c6-4bfc-9c14-429ca607e5cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
