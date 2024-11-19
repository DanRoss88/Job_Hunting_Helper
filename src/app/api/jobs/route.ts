import { NextResponse } from 'next/server'
import axios from 'axios'
import { Job } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const location = searchParams.get('location') || ''

  try {
    const response = await axios.get('https://api.indeed.com/ads/apisearch', {
      params: {
        publisher: process.env.INDEED_API_KEY,
        q: query,
        l: location,
        format: 'json',
        v: '2',
      },
    })

    interface IndeedJob {
      jobkey: string;
      jobtitle: string;
      company: string;
      formattedLocation: string;
      snippet: string;
      url: string;
    }

    const jobs: Job[] = response.data.results.map((job: IndeedJob) => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      description: job.snippet,
      url: job.url,
    }))

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}