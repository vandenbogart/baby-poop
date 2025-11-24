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
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 border-b-4 border-white/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            👶 Baby Tracker
          </h1>
          <Link 
            href="/patterns"
            className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full font-medium text-sm text-purple-600 hover:text-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            Patterns ✨
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('log')}
            className={`
              flex-1 py-3 px-4 rounded-2xl font-semibold transition-all shadow-lg
              ${activeTab === 'log' 
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white scale-105' 
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:scale-105'}
            `}
          >
            📝 Quick Log
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`
              flex-1 py-3 px-4 rounded-2xl font-semibold transition-all shadow-lg
              ${activeTab === 'timeline' 
                ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white scale-105' 
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:scale-105'}
            `}
          >
            ⏰ Timeline
          </button>
        </div>

        {activeTab === 'log' ? (
          <>
            {/* Today's Stats */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                ✨ Today's Summary
              </h2>
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
                  icon="🎉"
                />
              </div>
            </div>

            {/* Quick Log Buttons */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text">
                🎯 Log Event
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <EventButton
                  icon="💩"
                  label="Poop"
                  onClick={() => logEvent('POOP')}
                  color="bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 hover:from-amber-400 hover:to-orange-500"
                  disabled={loading}
                />
                <EventButton
                  icon="💧"
                  label="Pee"
                  onClick={() => logEvent('PEE')}
                  color="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-400 hover:from-blue-400 hover:to-cyan-500"
                  disabled={loading}
                />
                <EventButton
                  icon="☀️"
                  label="Wake Up"
                  onClick={() => logEvent('WAKE')}
                  color="bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-300 hover:from-yellow-400 hover:to-amber-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Recent Events Preview */}
            {todayEvents.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
                  🕐 Recent Events
                </h2>
                <EventTimeline events={todayEvents.slice(0, 3)} onEventUpdate={fetchEvents} />
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text">
              📅 Event Timeline
            </h2>
            <EventTimeline events={events} onEventUpdate={fetchEvents} />
          </div>
        )}
      </main>
    </div>
  )
}
