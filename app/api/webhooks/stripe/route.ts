import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper to map price IDs to plans
const getPlanFromPriceId = (priceId: string) => {
  const proMonthly = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;
  const proAnnual = process.env.STRIPE_PRICE_ID_PRO_ANNUAL;
  const agencyMonthly = process.env.STRIPE_PRICE_ID_AGENCY_MONTHLY;
  const agencyAnnual = process.env.STRIPE_PRICE_ID_AGENCY_ANNUAL;

  if (priceId === proMonthly || priceId === proAnnual) return "pro";
  if (priceId === agencyMonthly || priceId === agencyAnnual) return "agency";
  return "free";
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const customerId = session.customer as string;
      const userId = session.metadata.userId;

      await db
        .update(users)
        .set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          plan: getPlanFromPriceId(subscription.items.data[0].price.id) as any,
        })
        .where(eq(users.id, userId));
      break;
    }

    case "invoice.payment_succeeded": {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      await db
        .update(users)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          plan: getPlanFromPriceId(subscription.items.data[0].price.id) as any,
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      
      await db
        .update(users)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          plan: getPlanFromPriceId(subscription.items.data[0].price.id) as any,
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      
      await db
        .update(users)
        .set({
          stripeSubscriptionId: null,
          stripePriceId: null,
          plan: "free",
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
