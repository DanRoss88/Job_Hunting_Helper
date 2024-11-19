import { NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import clientPromise from '@/lib/mongodb'
import { Job, Resume } from '@/types'

export async function POST(request: Request) {
  const { jobId, resumeId } = await request.json()

  try {
    const client = await clientPromise
    const db = client.db('jobHuntDB')

    const job: Job | null = await db.collection('jobs').findOne({ id: jobId }) as Job | null
    const resume: Resume | null = await db.collection('resumes').findOne({ id: resumeId }) as Resume | null 

    if (!job || !resume) {
      return NextResponse.json({ error: 'Job or resume not found' }, { status: 404 })
    }

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: [
        { role: 'system', content: 'Analyze the job description and resume. Provide a match score (0-100) and a brief explanation.' },
        { role: 'user', content: `Job: ${JSON.stringify(job)}\nResume: ${JSON.stringify(resume)}` }
      ]
    })

    let fullResponse = ''
    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }

    const [matchScore, explanation] = fullResponse.split('\n', 2)

    await db.collection('jobs').updateOne(
      { id: jobId },
      { $set: { matchScore: parseInt(matchScore) } }
    )

    return NextResponse.json({ matchScore: parseInt(matchScore), explanation })
  } catch (error) {
    console.error('Error analyzing job match:', error)
    return NextResponse.json({ error: 'Failed to analyze job match' }, { status: 500 })
  }
}