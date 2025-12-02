import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, CreditCard, Check, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { db, runTransaction, doc, collection, addDoc, serverTimestamp, increment } from "@/lib/firebase";
import { getPayPalClientId } from "@/lib/paypal";

const Billing = () => {
  const { user, credits } = useAuth();
  const { toast } = useToast();
  const [loadingPayPal, setLoadingPayPal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ credits: number; price: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paypalContainerId] = useState(() => `paypal-container-${Date.now()}-${Math.random()}`);
  const paypalLoadedRef = useRef(false);
  const paypalButtonInstanceRef = useRef<any>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Credit packages: price in dollars -> credits
  const creditPackages = [
    { credits: 12, price: 1, popular: false },
    { credits: 60, price: 5, popular: true },
    { credits: 120, price: 10, popular: false },
  ];

  // Handle purchase button click
  const handlePurchaseClick = (pack: { credits: number; price: number }) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase credits",
        variant: "destructive",
      });
      return;
    }
    setSelectedPackage(pack);
    setIsDialogOpen(true);
  };

  // Render PayPal button in modal
  const renderPayPalButton = () => {
    if (!window.paypal || !user || !selectedPackage) {
      console.warn("PayPal render conditions not met:", {
        hasPayPal: !!window.paypal,
        hasUser: !!user,
        hasPackage: !!selectedPackage,
      });
      setLoadingPayPal(false);
      return;
    }

    const container = document.getElementById(paypalContainerId);
    if (!container || !isDialogOpen) {
      console.warn("Container not found or dialog closed:", {
        hasContainer: !!container,
        isDialogOpen,
      });
      setLoadingPayPal(false);
      return;
    }
    
    // Clear existing button instance
    paypalButtonInstanceRef.current = null;
    
    // Clear container using innerHTML to avoid React cleanup issues
    container.innerHTML = "";
    // Ensure container is visible
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const currentContainer = document.getElementById(paypalContainerId);
      if (!currentContainer || !isDialogOpen) {
        console.warn("Container lost or dialog closed during render");
        setLoadingPayPal(false);
        return;
      }
      
      // Ensure container is visible before rendering
      currentContainer.style.display = 'block';
      currentContainer.style.visibility = 'visible';
      currentContainer.style.opacity = '1';
      
      try {
        console.log("Rendering PayPal button with package:", selectedPackage);
        const buttons = window.paypal!.Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 50,
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `${selectedPackage.credits} Credits`,
                  amount: {
                    value: selectedPackage.price.toString(),
                    currency_code: "USD",
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              setLoadingPayPal(true);
              const order = await actions.order.capture();
              
              if (!user) {
                throw new Error("User not authenticated");
              }
              
              // Update credits in Firebase
              await runTransaction(db as any, async (tx) => {
                const userRef = doc(db, "users", user.uid);
                
                // Add credits
                tx.update(userRef, { credits: increment(selectedPackage.credits) });
                
                // Record transaction
                const transactionsRef = collection(db, "transactions");
                tx.set(doc(transactionsRef), {
                  userId: user.uid,
                  type: "purchase",
                  credits: selectedPackage.credits,
                  amount: selectedPackage.price,
                  paymentId: order.id,
                  paymentMethod: "paypal",
                  status: "completed",
                  createdAt: serverTimestamp(),
                });
              });

              toast({
                title: "Payment successful!",
                description: `Added ${selectedPackage.credits} credits to your account`,
              });
              
              // Close dialog after successful payment
              setIsDialogOpen(false);
              setSelectedPackage(null);
            } catch (error) {
              console.error("Payment error:", error);
              toast({
                title: "Payment failed",
                description: error instanceof Error ? error.message : "Failed to process payment",
                variant: "destructive",
              });
            } finally {
              setLoadingPayPal(false);
            }
          },
          onError: (err: any) => {
            console.error("PayPal error:", err);
            toast({
              title: "Payment error",
              description: "An error occurred during payment processing",
              variant: "destructive",
            });
            setLoadingPayPal(false);
          },
          onCancel: () => {
            setLoadingPayPal(false);
          },
        });
        
        paypalButtonInstanceRef.current = buttons;
        console.log("Attempting to render PayPal button in container:", currentContainer);
        
        buttons.render(currentContainer).then(() => {
          console.log("PayPal button rendered successfully");
          // Ensure container is visible
          if (currentContainer) {
            currentContainer.style.display = 'block';
            currentContainer.style.visibility = 'visible';
            currentContainer.style.opacity = '1';
            currentContainer.style.width = '100%';
            currentContainer.style.minHeight = '200px';
            
            // Check if button was actually rendered
            const hasButton = currentContainer.querySelector('div') || currentContainer.children.length > 0;
            console.log("Button rendered check:", hasButton, "Children:", currentContainer.children.length);
            
            if (!hasButton) {
              console.warn("PayPal button container is empty after render");
            }
          }
          setLoadingPayPal(false);
        }).catch((error: any) => {
          console.error("PayPal button render error:", error);
          toast({
            title: "Payment button error",
            description: error?.message || "Failed to load PayPal button. Please check your PayPal client ID.",
            variant: "destructive",
          });
          setLoadingPayPal(false);
        });
      } catch (error) {
        console.error("Error rendering PayPal button:", error);
        toast({
          title: "Payment button error",
          description: error instanceof Error ? error.message : "Failed to load PayPal button",
          variant: "destructive",
        });
        setLoadingPayPal(false);
      }
    }, 300);
    
    cleanupTimeoutRef.current = timer;
  };

  // Load PayPal SDK dynamically
  useEffect(() => {
    const clientId = getPayPalClientId();
    if (!clientId || paypalLoadedRef.current) return;

    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      paypalLoadedRef.current = true;
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src*="paypal.com/sdk"]`);
    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.paypal) {
          paypalLoadedRef.current = true;
          clearInterval(checkLoaded);
        }
      }, 100);
      
      setTimeout(() => clearInterval(checkLoaded), 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      paypalLoadedRef.current = true;
      console.log("PayPal SDK loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      toast({
        title: "PayPal SDK failed to load",
        description: "Please check your internet connection and PayPal client ID",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove the script - PayPal SDK should persist
    };
  }, []);

  // Render PayPal button when dialog opens
  useEffect(() => {
    if (!isDialogOpen) {
      // Clean up when dialog closes
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
      const container = document.getElementById(paypalContainerId);
      if (container) {
        try {
          container.innerHTML = "";
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      paypalButtonInstanceRef.current = null;
      setLoadingPayPal(false);
      return;
    }

    // Only proceed if we have a package and user
    if (!selectedPackage || !user) {
      return;
    }

    // Check if PayPal SDK is loaded
    if (!paypalLoadedRef.current) {
      const clientId = getPayPalClientId();
      if (!clientId) {
        toast({
          title: "PayPal not configured",
          description: "Please set VITE_PAYPAL_CLIENT_ID in your .env file",
          variant: "destructive",
        });
        setIsDialogOpen(false);
        return;
      }
      
      console.log("Waiting for PayPal SDK to load...");
      // Wait for SDK to load
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          console.log("PayPal SDK detected!");
          paypalLoadedRef.current = true;
          clearInterval(checkPayPal);
          if (selectedPackage && user && isDialogOpen) {
            setLoadingPayPal(true);
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              renderPayPalButton();
            }, 200);
          }
        }
      }, 100);
      
      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkPayPal);
        if (!paypalLoadedRef.current) {
          console.error("PayPal SDK failed to load after 10 seconds");
          toast({
            title: "PayPal SDK failed to load",
            description: "Please check your PayPal client ID and try again",
            variant: "destructive",
          });
          setLoadingPayPal(false);
        }
      }, 10000);
      
      return () => {
        clearInterval(checkPayPal);
        clearTimeout(timeout);
        if (cleanupTimeoutRef.current) {
          clearTimeout(cleanupTimeoutRef.current);
          cleanupTimeoutRef.current = null;
        }
      };
    }

    // SDK is loaded, render the button
    if (paypalLoadedRef.current && selectedPackage && user) {
      console.log("PayPal SDK loaded, rendering button...");
      setLoadingPayPal(true);
      // Small delay to ensure container is in DOM
      const renderTimer = setTimeout(() => {
        renderPayPalButton();
      }, 200);
      
      return () => {
        clearTimeout(renderTimer);
        if (cleanupTimeoutRef.current) {
          clearTimeout(cleanupTimeoutRef.current);
          cleanupTimeoutRef.current = null;
        }
      };
    }
  }, [isDialogOpen, selectedPackage, user, paypalContainerId]);

  const transactions = [
    { id: 1, description: "Initial signup bonus", amount: "+50 credits", date: "Jan 15, 2025" },
    { id: 2, description: "Video generation", amount: "-5 credits", date: "Jan 16, 2025" },
    { id: 3, description: "Video generation", amount: "-5 credits", date: "Jan 17, 2025" },
    { id: 4, description: "Credit purchase", amount: "+24 credits", date: "Jan 18, 2025" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Billing & Credits</h1>
          <p className="text-muted-foreground">Manage your credits and view transaction history</p>
        </div>

        {/* Current Balance */}
        <Card className="glass-card p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial opacity-30" />
          <div className="relative z-10 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-5xl font-bold text-primary mb-2">
              {typeof credits === "number" ? `${credits} Credits` : "Credits"}
            </div>
            <p className="text-muted-foreground">
              {typeof credits === "number" ? `Enough for ${Math.floor(credits / 5)} videos` : "Loading..."}
            </p>
          </div>
        </Card>

        {/* Purchase Credits */}
        <Card className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Purchase Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {creditPackages.map((pack) => (
              <Card
                key={pack.credits}
                className={`glass-card p-6 text-center hover:glow-primary transition-all ${
                  pack.popular ? "border-primary glow-primary" : ""
                }`}
              >
                {pack.popular && (
                  <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-2">
                    Popular
                  </div>
                )}
                <div className="text-3xl font-bold mb-2">{pack.credits}</div>
                <div className="text-sm text-muted-foreground mb-4">Credits</div>
                <div className="text-2xl font-bold text-primary mb-4">
                  ${pack.price}
                </div>
                <Button
                  className={pack.popular ? "glow-primary w-full" : "w-full"}
                  onClick={() => handlePurchaseClick(pack)}
                  disabled={!user}
                >
                  {!user ? "Sign in to purchase" : "Purchase"}
                </Button>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>Secure payment powered by PayPal</span>
          </div>
        </Card>

        {/* PayPal Checkout Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden [&>button]:hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/90 to-primary px-6 py-4 flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-white text-lg font-semibold">
                    Complete Payment
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-sm">
                    Secure checkout with PayPal
                  </DialogDescription>
                </div>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity text-white hover:bg-white/10 p-1"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              {selectedPackage && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Package</span>
                    <span className="font-semibold">{selectedPackage.credits} Credits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-2xl font-bold text-primary">${selectedPackage.price}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">${selectedPackage.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Button Container */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your payment is secured by PayPal</span>
                </div>
                <div className="min-h-[200px] flex flex-col items-center justify-center relative">
                  {(!paypalLoadedRef.current || loadingPayPal) && isDialogOpen && (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground absolute inset-0 justify-center z-10 bg-background/80 backdrop-blur-sm rounded">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading payment options...</span>
                      {!getPayPalClientId() && (
                        <span className="text-xs text-destructive">
                          PayPal client ID not configured. Check your .env file.
                        </span>
                      )}
                    </div>
                  )}
                  {/* PayPal container - isolated from React's DOM management */}
                  <div
                    id={paypalContainerId}
                    className="w-full min-h-[200px] relative z-0 flex items-center justify-center"
                    suppressHydrationWarning
                  />
                  {/* Debug info - remove in production */}
                  {isDialogOpen && (
                    <div className="mt-4 text-xs text-muted-foreground">
                      SDK Loaded: {paypalLoadedRef.current ? 'Yes' : 'No'} | 
                      Loading: {loadingPayPal ? 'Yes' : 'No'} | 
                      Client ID: {getPayPalClientId() ? 'Set' : 'Missing'}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
                <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction History */}
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
                <div className={`font-semibold ${
                  transaction.amount.startsWith("+") ? "text-secondary" : "text-muted-foreground"
                }`}>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
