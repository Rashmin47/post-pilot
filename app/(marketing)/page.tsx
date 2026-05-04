import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  PenSquare,
  MessageSquare,
  ImageIcon,
  BarChart3,
  Link2,
  ChevronRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-indigo/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-indigo mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo"></span>
            </span>
            ✦ AI-Powered Social Media Management
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Manage All Your <span className="gradient-text">Social Media</span> <br className="hidden md:block" /> From One Place
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Connect Instagram, YouTube, LinkedIn, Twitter and more. Create once, publish everywhere. Schedule posts and automate replies with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-bg hover:opacity-90 transition-all px-8 text-base font-semibold rounded-xl h-14">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 text-base font-semibold rounded-xl border-white/10 hover:bg-white/5 h-14">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Platform Marquee */}
      <section className="py-12 border-y border-white/5 bg-black/20 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center min-w-full">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-default grayscale hover:grayscale-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5">
                    <platform.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest">{platform.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-brand-indigo font-semibold uppercase tracking-widest text-sm mb-4">Features</h2>
          <h3 className="text-4xl md:text-5xl font-bold">Everything You Need to Grow</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-card hover:border-brand-indigo/50 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-brand-indigo/20">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-32 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-brand-purple font-semibold uppercase tracking-widest text-sm mb-4">How it works</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Grow Your Presence in 3 Steps</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative group">
                <div className="text-8xl font-black text-white/5 absolute -top-8 -left-4 group-hover:text-brand-purple/10 transition-colors">
                  0{idx + 1}
                </div>
                <div className="relative pt-4">
                  <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Preview */}
      <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-brand-pink font-semibold uppercase tracking-widest text-sm mb-4">Pricing</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the plan that fits your needs. Start for free and upgrade as you grow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {previewPlans.map((plan) => (
            <Card key={plan.name} className={`glass-card ${plan.popular ? 'border-brand-indigo scale-105 z-10' : ''}`}>
              <CardContent className="pt-10 flex flex-col h-full">
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-indigo text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="text-2xl font-bold mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-brand-indigo" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.price === "0" ? "/sign-up" : "/pricing"}>
                  <Button className={`w-full ${plan.popular ? 'gradient-bg' : 'variant-outline bg-white/5 border-white/10'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-32 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-brand-indigo font-semibold uppercase tracking-widest text-sm mb-4">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Loved by Creators Worldwide</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} className="glass-card">
                <CardContent className="pt-8">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-12 h-12 rounded-full gradient-bg overflow-hidden flex items-center justify-center font-bold text-white uppercase">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-32 px-8 max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-muted-foreground font-semibold uppercase tracking-widest text-sm mb-4">FAQ</h2>
          <h3 className="text-4xl font-bold">Frequently Asked Questions</h3>
        </div>
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
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

      {/* 8. CTA Banner */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto rounded-3xl gradient-bg p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-indigo/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black mb-8 text-white">Ready to Skyrocket Your Social Presence?</h3>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
              Join 10,000+ creators and brands who use PostPilot to automate their growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-brand-indigo hover:bg-white/90 px-10 h-16 rounded-2xl text-lg font-bold">
                  Start for Free Today
                </Button>
              </Link>
              <Link href="/pricing" className="text-white font-bold flex items-center gap-2 group">
                View All Plans <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const platforms = [
  { name: "Instagram", icon: ImageIcon },
  { name: "YouTube", icon: BarChart3 },
  { name: "Facebook", icon: Link2 },
  { name: "LinkedIn", icon: Link2 },
  { name: "Pinterest", icon: ImageIcon },
  { name: "Discord", icon: MessageSquare },
  { name: "Twitter", icon: MessageSquare },
  { name: "Slack", icon: MessageSquare },
];

const features = [
  {
    title: "Smart Scheduling",
    description: "Schedule posts at optimal times across all platforms with our AI-powered timing engine.",
    icon: Calendar,
  },
  {
    title: "Unified Composer",
    description: "Write once, customize per platform. Tailor captions, hashtags and media for each channel.",
    icon: PenSquare,
  },
  {
    title: "AI Auto-Reply",
    description: "Automatically respond to comments using Gemini AI based on keywords and sentiment rules.",
    icon: MessageSquare,
  },
  {
    title: "Media Library",
    description: "Upload, organize and transform images and videos with AI-powered ImageKit integration.",
    icon: ImageIcon,
  },
  {
    title: "Analytics",
    description: "Track engagement, reach and growth across all connected platforms in one dashboard.",
    icon: BarChart3,
  },
  {
    title: "Multi-Account",
    description: "Connect unlimited social accounts and manage them all from a single workspace.",
    icon: Link2,
  },
];

const steps = [
  {
    title: "Connect Accounts",
    description: "Securely link your social media profiles from Instagram, LinkedIn, YouTube, and more in seconds.",
  },
  {
    title: "Compose & Schedule",
    description: "Create your content once and our AI will help you customize it for every platform. Pick a time or post instantly.",
  },
  {
    title: "Automate & Analyze",
    description: "Sit back while PostPilot handles the publishing and engages your audience with AI-powered auto-replies.",
  },
];

const previewPlans = [
  {
    name: "Free",
    price: "0",
    cta: "Get Started",
    features: [
      "3 social accounts",
      "10 scheduled posts/mo",
      "Basic analytics",
      "500MB media storage",
    ],
  },
  {
    name: "Pro",
    price: "29",
    popular: true,
    cta: "Start Pro Trial",
    features: [
      "15 social accounts",
      "Unlimited scheduled posts",
      "AI auto-reply (500/mo)",
      "Advanced analytics",
      "10GB media storage",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "99",
    cta: "Contact Sales",
    features: [
      "Unlimited accounts",
      "Unlimited posts",
      "Unlimited AI replies",
      "White-label options",
      "100GB media storage",
      "Dedicated support",
    ],
  },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Social Media Manager",
    avatar: "SJ",
    quote: "PostPilot has saved me at least 10 hours a week. The AI auto-reply feature is a game-changer for engagement.",
  },
  {
    name: "Marcus Chen",
    role: "Content Creator",
    avatar: "MC",
    quote: "The unified composer makes it so easy to tailor my message for each platform without starting from scratch.",
  },
  {
    name: "Elena Rodriguez",
    role: "Digital Agency Owner",
    avatar: "ER",
    quote: "My clients love the analytics reports. The interface is beautiful and extremely intuitive to use.",
  },
];

const faqs = [
  {
    question: "Which platforms do you support?",
    answer: "We currently support Instagram, YouTube, Facebook, LinkedIn, Pinterest, Discord, Twitter/X, and Slack. More platforms are added regularly.",
  },
  {
    question: "How does the AI auto-reply work?",
    answer: "You can set up rules based on keywords, sentiment, or trigger them for all comments. Gemini AI then analyzes the comment and generates a contextual, helpful response.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your billing dashboard. You will retain access to your plan until the end of the current billing cycle.",
  },
  {
    question: "Is there a limit on how many posts I can schedule?",
    answer: "The Free plan has a limit of 10 posts per month. Our Pro and Agency plans offer unlimited post scheduling.",
  },
  {
    question: "Do you offer a free trial for the Pro plan?",
    answer: "Yes, we offer a 14-day free trial for the Pro plan so you can test all the advanced features before committing.",
  },
];
