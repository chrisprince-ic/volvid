// PayPal configuration
export const getPayPalClientId = () => {
  return import.meta.env.VITE_PAYPAL_CLIENT_ID || "";
};

// Initialize PayPal SDK
export const initPayPal = (clientId: string) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined" || !(window as any).paypal) {
      reject(new Error("PayPal SDK not loaded"));
      return;
    }

    // PayPal SDK is already loaded via script tag
    resolve();
  });
};

// Declare PayPal types for TypeScript
declare global {
  interface Window {
    paypal?: {
      Buttons: {
        render: (options: any, selector: string) => any;
      };
    };
  }
}



