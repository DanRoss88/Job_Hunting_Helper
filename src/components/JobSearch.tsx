'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JobSearch() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title, keywords, or company"
          className="flex-grow p-2 border rounded"
          aria-label="Job search query"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or zip code"
          className="flex-grow p-2 border rounded"
          aria-label="Job location"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Search Jobs
        </button>
      </div>
    </form>
  )
}