'use client'

import { useState, useEffect } from 'react'
import { EventButton } from '@/components/EventButton'
import { EventTimeline } from '@/components/EventTimeline'
import { StatsCard } from '@/components/StatsCard'
import Link from 'next/link'

interface Event {
  id: string
  type: 'POOP' | 'PEE' | 'WAKE'
  timestamp: string
  notes?: string | null
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'log' | 'timeline'>('log')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?limit=50')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const logEvent = async (type: 'POOP' | 'PEE' | 'WAKE') => {
    setLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        await fetchEvents()
      }
    } catch (error) {
      console.error('Error logging event:', error)
    } finally {
      setLoading(false)
    }
  }

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.timestamp)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const todayStats = {
    total: todayEvents.length,
    poops: todayEvents.filter(e => e.type === 'POOP').length,
    pees: todayEvents.filter(e => e.type === 'PEE').length,
    wakes: todayEvents.filter(e => e.type === 'WAKE').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Baby Tracker</h1>
          <Link 
            href="/patterns"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Patterns →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('log')}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium transition-colors
              ${activeTab === 'log' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'}
            `}
          >
            Quick Log
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium transition-colors
              ${activeTab === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300'}
            `}
          >
            Timeline
          </button>
        </div>

        {activeTab === 'log' ? (
          <>
            {/* Today's Stats */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Summary</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatsCard 
                  title="Poops" 
                  value={todayStats.poops} 
                  icon="💩"
                />
                <StatsCard 
                  title="Pees" 
                  value={todayStats.pees} 
                  icon="💧"
                />
                <StatsCard 
                  title="Wakes" 
                  value={todayStats.wakes} 
                  icon="☀️"
                />
                <StatsCard 
                  title="Total" 
                  value={todayStats.total} 
                  icon="📊"
                />
              </div>
            </div>

            {/* Quick Log Buttons */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Log Event</h2>
              <div className="grid grid-cols-1 gap-4">
                <EventButton
                  icon="💩"
                  label="Poop"
                  onClick={() => logEvent('POOP')}
                  color="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  disabled={loading}
                />
                <EventButton
                  icon="💧"
                  label="Pee"
                  onClick={() => logEvent('PEE')}
                  color="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={loading}
                />
                <EventButton
                  icon="☀️"
                  label="Wake Up"
                  onClick={() => logEvent('WAKE')}
                  color="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Recent Events Preview */}
            {todayEvents.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Events</h2>
                <EventTimeline events={todayEvents.slice(0, 3)} />
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Event Timeline</h2>
            <EventTimeline events={events} />
          </div>
        )}
      </main>
    </div>
  )
}
