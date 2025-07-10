export async function POST(req) {
  return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
}
