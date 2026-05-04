"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Free",
    priceId: "",
    price: 0,
    features: ["3 Social Accounts", "10 Scheduled Posts / month", "Basic Engagement Stats"],
  },
  {
    name: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || "price_pro_monthly",
    price: 29,
    features: ["15 Social Accounts", "Unlimited Scheduled Posts", "500 AI Auto-Replies / month", "Advanced Analytics"],
  },
  {
    name: "Agency",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AGENCY_MONTHLY || "price_agency_monthly",
    price: 99,
    features: ["Unlimited Social Accounts", "Unlimited Scheduled Posts", "Unlimited AI Auto-Replies", "White-label Reports"],
  },
];

export default function BillingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user"); // Assuming there's an API to get current user data
      if (res.ok) {
        const data = await res.json();
        setDbUser(data);
      }
    };
    fetchUser();
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!priceId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Could not open billing portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and billing information.</p>
        </div>
        {dbUser?.stripeCustomerId && (
          <Button variant="outline" onClick={handlePortal} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            Manage in Stripe
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the <span className="text-brand-indigo font-bold uppercase">{dbUser?.plan || "free"}</span> plan.</CardDescription>
          </CardHeader>
          <CardContent>
            {dbUser?.stripeSubscriptionId ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Your subscription is active.</span>
                </div>
                {dbUser.stripeCurrentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    Next billing date: {new Date(dbUser.stripeCurrentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Upgrade to unlock more features and higher limits.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Usage Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* This would ideally be dynamic */}
             <div className="space-y-1">
               <div className="flex justify-between text-xs">
                 <span>Social Accounts</span>
                 <span>?/3</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-brand-indigo h-full w-[33%]" />
               </div>
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-xs">
                 <span>Posts (this month)</span>
                 <span>?/10</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-brand-indigo h-full w-[10%]" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={`glass-card relative ${dbUser?.plan === plan.name.toLowerCase() ? 'border-brand-indigo ring-1 ring-brand-indigo' : ''}`}>
            {dbUser?.plan === plan.name.toLowerCase() && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-indigo text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Current Plan
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-3xl font-bold mt-2">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-brand-indigo flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button 
                className="w-full" 
                variant={dbUser?.plan === plan.name.toLowerCase() ? "outline" : "default"}
                disabled={loading || dbUser?.plan === plan.name.toLowerCase() || plan.name === "Free"}
                onClick={() => handleCheckout(plan.priceId)}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (dbUser?.plan === plan.name.toLowerCase() ? "Manage" : "Upgrade")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
