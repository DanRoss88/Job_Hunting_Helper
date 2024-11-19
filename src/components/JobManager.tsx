'use client'
import { useState } from 'react'
import { Job } from '@/types'
import JobSearch from './JobSearch'
import JobList from './JobList'

interface JobSearchConfig {
  id: number
  keywords: string
  location: string
  indeedEmail: string
}

export default function JobManager() {
  const [jobSearches, setJobSearches] = useState<JobSearchConfig[]>([
    { id: 1, keywords: '', location: '', indeedEmail: '' }
  ])
  const [currentJobSearch, setCurrentJobSearch] = useState<number>(1)
  const [jobs, setJobs] = useState<Job[]>([])

  const addJobSearch = () => {
    if (jobSearches.length < 4) {
      setJobSearches([...jobSearches, { 
        id: jobSearches.length + 1, 
        keywords: '', 
        location: '', 
        indeedEmail: '' 
      }])
    }
  }

  const updateJobSearch = (id: number, field: keyof JobSearchConfig, value: string) => {
    setJobSearches(jobSearches.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ))
  }

  const deleteJobSearch = (id: number) => {
    setJobSearches(jobSearches.filter(job => job.id !== id))
    if (currentJobSearch === id) {
      setCurrentJobSearch(jobSearches[0].id)
    }
  }

  const handleSearch = async (keywords: string, location: string) => {
    // Implement the API call to fetch jobs here
    // For now, we'll just set some dummy data
    setJobs([
      { id: '1', title: 'Software Engineer', company: 'Tech Co', location: 'New York', description: 'Exciting role...', url: 'https://example.com/job1' },
      { id: '2', title: 'Product Manager', company: 'Startup Inc', location: 'San Francisco', description: 'Leading role...', url: 'https://example.com/job2' },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Searches</h2>
        <button 
          onClick={addJobSearch} 
          disabled={jobSearches.length >= 4}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Add Job Search
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto">
        {jobSearches.map(job => (
          <button
            key={job.id}
            onClick={() => setCurrentJobSearch(job.id)}
            className={`px-4 py-2 rounded ${currentJobSearch === job.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Job Search {job.id}
          </button>
        ))}
      </div>

      {jobSearches.map(job => (
        job.id === currentJobSearch && (
          <div key={job.id} className="space-y-4">
            <input
              type="text"
              value={job.keywords}
              onChange={(e) => updateJobSearch(job.id, 'keywords', e.target.value)}
              placeholder="Job keywords"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={job.location}
              onChange={(e) => updateJobSearch(job.id, 'location', e.target.value)}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              value={job.indeedEmail}
              onChange={(e) => updateJobSearch(job.id, 'indeedEmail', e.target.value)}
              placeholder="Indeed Email"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={() => handleSearch(job.keywords, job.location)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Search Jobs
              </button>
              <button
                onClick={() => deleteJobSearch(job.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Job Search
              </button>
            </div>
          </div>
        )
      ))}

      <JobList 
        jobs={jobs} 
        setJobs={setJobs} 
        onJobUpdate={(updatedJob) => {
          setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job))
        }}
        onJobDelete={(jobId) => {
          setJobs(jobs.filter(job => job.id !== jobId))
        }}
      />
    </div>
  )
}