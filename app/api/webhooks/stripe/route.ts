import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Extend Stripe type to include missing field
type StripeSubscriptionWithPeriod = Stripe.Subscription & {
  current_period_end: number;
};

// Map price → plan
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
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    // ✅ CHECKOUT COMPLETED
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.subscription || !session.customer) break;

      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string,
      )) as StripeSubscriptionWithPeriod;

      const userId = session.metadata?.userId;
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id || "";

      await db
        .update(users)
        .set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId || null,
          stripeCurrentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          plan: getPlanFromPriceId(priceId) as any,
        })
        .where(eq(users.id, userId));

      break;
    }

    // ✅ PAYMENT SUCCESS
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;

      if (!invoice.subscription) break;

      const subscription = (await stripe.subscriptions.retrieve(
        invoice.subscription as string,
      )) as StripeSubscriptionWithPeriod;

      const priceId = subscription.items.data[0]?.price.id || "";

      await db
        .update(users)
        .set({
          stripePriceId: priceId || null,
          stripeCurrentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          plan: getPlanFromPriceId(priceId) as any,
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));

      break;
    }

    // ✅ SUBSCRIPTION UPDATED
    case "customer.subscription.updated": {
      const subscription = event.data.object as StripeSubscriptionWithPeriod;

      const priceId = subscription.items.data[0]?.price.id || "";

      await db
        .update(users)
        .set({
          stripePriceId: priceId || null,
          stripeCurrentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          plan: getPlanFromPriceId(priceId) as any,
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));

      break;
    }

    // ✅ SUBSCRIPTION DELETED
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(users)
        .set({
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          plan: "free",
        })
        .where(eq(users.stripeSubscriptionId, subscription.id));

      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
