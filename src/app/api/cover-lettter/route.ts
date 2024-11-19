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
        { role: 'system', content: 'Generate a personalized cover letter based on the job description and resume.' },
        { role: 'user', content: `Job: ${JSON.stringify(job)}\nResume: ${JSON.stringify(resume)}` }
      ]
    })

    let coverLetter = ''
    for await (const chunk of result.textStream) {
      coverLetter += chunk
    }

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}