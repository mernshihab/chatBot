import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  const { message } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(message);
    console.log('Result:', result.response.text());

    return new Response(JSON.stringify({ response: result.response.text() }), { status: 200 });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch AI response.' }), { status: 500 });
  }
}
