'use client'

import { Job } from '@/types'
import JobCard from './JobCard'

interface JobListProps {
  jobs: Job[]
  onJobUpdate: (job: Job) => void
  onJobDelete: (id: string) => void
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>; 
}

export default function JobList({ jobs, onJobUpdate, onJobDelete }: JobListProps) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return <div>No jobs found. Try adjusting your search criteria.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onUpdate={onJobUpdate}
          onDelete={onJobDelete}
        />
      ))}
    </div>
  )
}