import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Check if the API key is set
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or empty messages array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: messages.map((message: any) => ({
        content: message.content,
        role: message.role,
      })),
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error: any) {
    console.error('Error in chat API:', error)

    let statusCode = 500
    let errorMessage = 'An error occurred during the API call'

    if (error instanceof Error) {
      errorMessage = error.message
    }

    if (error.status) {
      statusCode = error.status
    }

    // Check for insufficient_quota error
    if (error.error?.type === 'insufficient_quota') {
      statusCode = 429
      errorMessage = 'The AI service is currently unavailable due to quota limitations. We\'ve switched to using pre-defined templates. You can still customize these templates manually.'
    }

    return new Response(JSON.stringify({ error: errorMessage, details: error }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}