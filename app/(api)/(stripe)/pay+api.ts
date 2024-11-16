import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentMethodId, paymentIntentId, customerId } = body;
    if (!paymentMethodId || !paymentIntentId || !customerId) {
      return new Response(
        "Missing payment_method_id, payment_intent_id, or customer_id",
        { status: 400 },
      );
    }

    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    const result = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment confirmed",
        result,
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error,
        status: 500,
      }),
    );
  }
}
