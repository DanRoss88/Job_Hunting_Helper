'use client'

import { Job } from '@/types'
import JobCard from './JobCard'

interface JobListProps {
  jobs: Job[]
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>
}

export default function JobList({ jobs, setJobs }: JobListProps) {
  const handleJobUpdate = (updatedJob: Job) => {
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job))
  }

  const handleJobDelete = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId))
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return <div>No jobs found. Try adjusting your search criteria.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onUpdate={handleJobUpdate}
          onDelete={handleJobDelete}
        />
      ))}
    </div>
  )
}