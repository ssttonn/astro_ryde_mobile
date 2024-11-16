import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount } = body;
  if (!name || !email || !amount) {
    return new Response("Missing name, email, or amount", { status: 400 });
  }

  let currentCustomer;
  const existingCustomers = await stripe.customers.list({ email });
  if (existingCustomers.data.length > 0) {
    currentCustomer = existingCustomers.data[0];
  } else {
    currentCustomer = await stripe.customers.create({ email, name });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: currentCustomer.id },
    { apiVersion: "2024-06-20" },
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: currentCustomer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: currentCustomer.id,
    }),
  );
}
