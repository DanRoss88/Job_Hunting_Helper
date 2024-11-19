'use client'

import { useState, useEffect } from 'react'
import { Job } from '@/types'
import JobSearch from './JobSearch'
import JobList from './JobList'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface JobSearchConfig {
  id: number
  keywords: string
  location: string
  indeedEmail: string
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [jobSearches, setJobSearches] = useState<JobSearchConfig[]>([
    { id: 1, keywords: '', location: '', indeedEmail: '' }
  ])
  const [currentJobSearch, setCurrentJobSearch] = useState<number>(1)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/jobs')
        const data = await response.json()
        setJobs(data)
        // For demo purposes, let's assume 30% of jobs are applied
        setAppliedJobs(data.slice(0, Math.floor(data.length * 0.3)))
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs([])
        setAppliedJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

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

  const handleSearch = async (keywords: string, location: string, indeedEmail: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/jobs?keywords=${keywords}&location=${location}&email=${indeedEmail}`)
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error('Error searching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const applicationStatus = [
    { name: 'Applied', value: appliedJobs.length },
    { name: 'Not Applied', value: jobs.length - appliedJobs.length },
  ]

  const COLORS = ['#0088FE', '#00C49F']

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Hunt Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appliedJobs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Application Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(appliedJobs.length / jobs.length) * 100 || 0} className="w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {applicationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="jobs">
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
                      onClick={() => handleSearch(job.keywords, job.location, job.indeedEmail)}
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

            <JobList jobs={jobs} setJobs={setJobs} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}