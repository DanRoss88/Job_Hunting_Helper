'use client'

import { useState } from 'react'
import { Job } from '@/types'

interface JobCardProps {
  job: Job
  onUpdate: (job: Job) => void
  onDelete: (id: string) => void
}

export default function JobCard({ job, onUpdate, onDelete }: JobCardProps) {
  const [applied, setApplied] = useState(job.applied || false)

  const handleApply = () => {
    window.open(job.url, '_blank')
  }

  const toggleApplied = () => {
    const updatedJob = { ...job, applied: !applied }
    setApplied(!applied)
    onUpdate(updatedJob)
  }

  const handleDelete = () => {
    onDelete(job.id)
  }

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-gray-500 mb-4">{job.location}</p>
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleApply}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply
        </button>
        <button
          onClick={toggleApplied}
          className={`px-4 py-2 rounded ${applied ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          {applied ? 'Applied' : 'Mark as Applied'}
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-4">{job.description}</p>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Job
      </button>
    </div>
  )
}