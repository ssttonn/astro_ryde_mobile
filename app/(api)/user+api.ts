import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const { email, name, clerkId } = await request.json();

    if (!email || !name || !clerkId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const user = await sql`
        INSERT INTO users (email, name, clerk_id)
        VALUES (${email}, ${name}, ${clerkId})
    `;

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (e) {
    return Response.json({ error: e }, { status: 500 });
  }
}
