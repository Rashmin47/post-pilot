"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Header */}
      <section className="pt-20 pb-16 text-center">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Pick the <span className="gradient-text">Perfect Plan</span> for You
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Whether you're a solo creator or a global agency, we have a plan that scales with your growth.
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative transition-colors hover:border-brand-indigo/50"
            >
              <div className={`w-6 h-6 rounded-full gradient-bg transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-muted-foreground'}`}>Annual</span>
              <span className="bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-8 max-w-7xl mx-auto w-full mb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <Card key={plan.name} className={`glass-card relative ${plan.popular ? 'border-brand-indigo shadow-2xl shadow-brand-indigo/20' : ''}`}>
                <CardContent className="pt-10 flex flex-col h-full">
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-indigo text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className="text-2xl font-bold mb-2">{plan.name}</div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-bold">${price}</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  
                  <Link href="/sign-up">
                    <Button className={`w-full h-12 rounded-xl mb-8 font-bold ${plan.popular ? 'gradient-bg' : 'variant-outline bg-white/5 border-white/10'}`}>
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="space-y-4 flex-1">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">What's included:</div>
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-brand-indigo flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-8 w-full mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Compare Features</h2>
          <p className="text-muted-foreground">A detailed look at what each plan offers.</p>
        </div>
        
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-6 text-sm font-bold uppercase tracking-widest border-r border-white/5">Feature</th>
                <th className="p-6 text-sm font-bold uppercase tracking-widest text-center border-r border-white/5">Free</th>
                <th className="p-6 text-sm font-bold uppercase tracking-widest text-center border-r border-white/5 text-brand-indigo">Pro</th>
                <th className="p-6 text-sm font-bold uppercase tracking-widest text-center">Agency</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {comparison.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}>
                  <td className="p-6 font-medium border-r border-white/5">{row.feature}</td>
                  <td className="p-6 text-center border-r border-white/5 text-muted-foreground">{renderValue(row.free)}</td>
                  <td className="p-6 text-center border-r border-white/5 font-semibold text-brand-indigo/80">{renderValue(row.pro)}</td>
                  <td className="p-6 text-center text-muted-foreground">{renderValue(row.agency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ specific to billing */}
      <section className="max-w-3xl mx-auto px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Billing FAQ</h2>
          <p className="text-muted-foreground">Everything you need to know about our pricing and billing.</p>
        </div>
        <Accordion className="w-full">
          {billingFaqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
              <AccordionTrigger className="text-left hover:no-underline hover:text-brand-indigo transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function renderValue(val: string | boolean) {
  if (typeof val === "boolean") {
    return val ? <CheckCircle2 className="w-5 h-5 text-brand-indigo mx-auto" /> : <XCircle className="w-5 h-5 text-white/10 mx-auto" />;
  }
  return val;
}

const plans = [
  {
    name: "Free",
    description: "Ideal for beginners exploring the platform.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get Started Free",
    features: [
      "3 Social Accounts",
      "10 Scheduled Posts / month",
      "Basic Engagement Stats",
      "500MB Media Storage",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    description: "The complete toolkit for serious creators.",
    monthlyPrice: 29,
    annualPrice: 24,
    popular: true,
    cta: "Start 14-Day Free Trial",
    features: [
      "15 Social Accounts",
      "Unlimited Scheduled Posts",
      "500 AI Auto-Replies / month",
      "Advanced Analytics Dashboard",
      "10GB High-Speed Storage",
      "Priority Email Support",
      "Custom Post Branding",
    ],
  },
  {
    name: "Agency",
    description: "Advanced controls for teams and agencies.",
    monthlyPrice: 99,
    annualPrice: 79,
    cta: "Scale Your Agency",
    features: [
      "Unlimited Social Accounts",
      "Unlimited Scheduled Posts",
      "Unlimited AI Auto-Replies",
      "White-label Client Reports",
      "100GB Media Storage",
      "Dedicated Account Manager",
      "Team Collaboration Tools",
    ],
  },
];

const comparison = [
  { feature: "Connected Accounts", free: "3", pro: "15", agency: "Unlimited" },
  { feature: "Scheduled Posts", free: "10/mo", pro: "Unlimited", agency: "Unlimited" },
  { feature: "AI Auto-Reply", free: false, pro: "500/mo", agency: "Unlimited" },
  { feature: "Media Storage", free: "500MB", pro: "10GB", agency: "100GB" },
  { feature: "Advanced Analytics", free: false, pro: true, agency: true },
  { feature: "AI Post Assist", free: "5 times/mo", pro: true, agency: true },
  { feature: "Team Members", free: "1", pro: "3", agency: "Unlimited" },
  { feature: "White-label Reports", free: false, pro: false, agency: true },
  { feature: "API Access", free: false, pro: false, agency: true },
];

const billingFaqs = [
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial on our Pro plan. No credit card is required to start the trial.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time from your settings. If you upgrade, the change is immediate. If you downgrade, it takes effect at the end of your current cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support Apple Pay and Google Pay.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes, we love supporting good causes! Contact our support team with your non-profit documentation, and we'll provide a 50% discount on any plan.",
  },
];
