import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;
    return new Response(JSON.stringify({ data: response }));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error,
      }),
    );
  }
}
