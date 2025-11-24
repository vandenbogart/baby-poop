'use client'

import { useState, useEffect } from 'react'
import { EventButton } from '@/components/EventButton'
import { EventTimeline } from '@/components/EventTimeline'
import { StatsCard } from '@/components/StatsCard'
import { DurationPicker } from '@/components/DurationPicker'
import { FeedingPrompt } from '@/components/FeedingPrompt'
import Link from 'next/link'

interface Event {
  id: string
  type: 'POOP' | 'PEE' | 'NAP' | 'FEED' | 'DIAPER'
  timestamp: string
  notes?: string | null
  duration?: number | null
  duringFeeding?: boolean | null
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'log' | 'timeline'>('log')
  const [currentUser, setCurrentUser] = useState<string>('')
  
  // Modal states
  const [showDurationPicker, setShowDurationPicker] = useState(false)
  const [durationPickerType, setDurationPickerType] = useState<'NAP' | 'FEED' | null>(null)
  const [showFeedingPrompt, setShowFeedingPrompt] = useState(false)
  const [feedingPromptType, setFeedingPromptType] = useState<'POOP' | 'PEE' | null>(null)

  useEffect(() => {
    fetchSession()
    fetchEvents()
  }, [])

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.username)
      }
    } catch (error) {
      console.error('Error fetching session:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

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

  const logEvent = async (type: 'POOP' | 'PEE' | 'NAP' | 'FEED' | 'DIAPER', duration?: number, duringFeeding?: boolean) => {
    setLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          timestamp: new Date().toISOString(),
          duration: duration || null,
          duringFeeding: duringFeeding ?? null
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

  const handlePoopPeeClick = (type: 'POOP' | 'PEE') => {
    setFeedingPromptType(type)
    setShowFeedingPrompt(true)
  }

  const handleFeedingResponse = (duringFeeding: boolean) => {
    if (feedingPromptType) {
      logEvent(feedingPromptType, undefined, duringFeeding)
    }
    setShowFeedingPrompt(false)
    setFeedingPromptType(null)
  }

  const handleNapFeedClick = (type: 'NAP' | 'FEED') => {
    setDurationPickerType(type)
    setShowDurationPicker(true)
  }

  const handleDurationSelect = (minutes: number) => {
    if (durationPickerType) {
      logEvent(durationPickerType, minutes)
    }
    setShowDurationPicker(false)
    setDurationPickerType(null)
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
    naps: todayEvents.filter(e => e.type === 'NAP').length,
    feeds: todayEvents.filter(e => e.type === 'FEED').length,
    diapers: todayEvents.filter(e => e.type === 'DIAPER').length
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 border-b-4 border-white/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              👶 Baby Tracker
            </h1>
            {currentUser && (
              <p className="text-sm text-gray-600 mt-1">Logged in as {currentUser}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link 
              href="/patterns"
              className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full font-medium text-sm text-purple-600 hover:text-purple-700 transition-all shadow-sm hover:shadow-md"
            >
              Patterns ✨
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full font-medium text-sm text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
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
                  title="Feeds" 
                  value={todayStats.feeds} 
                  icon="🍼"
                />
                <StatsCard 
                  title="Diapers" 
                  value={todayStats.diapers} 
                  icon="🧷"
                />
                <StatsCard 
                  title="Naps" 
                  value={todayStats.naps} 
                  icon="😴"
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
                  icon="🍼"
                  label="Feeding"
                  onClick={() => handleNapFeedClick('FEED')}
                  color="bg-gradient-to-br from-pink-300 via-pink-400 to-rose-400 hover:from-pink-400 hover:to-rose-500"
                  disabled={loading}
                />
                <EventButton
                  icon="😴"
                  label="Nap"
                  onClick={() => handleNapFeedClick('NAP')}
                  color="bg-gradient-to-br from-indigo-300 via-purple-400 to-purple-400 hover:from-indigo-400 hover:to-purple-500"
                  disabled={loading}
                />
                <EventButton
                  icon="🧷"
                  label="Diaper Change"
                  onClick={() => logEvent('DIAPER')}
                  color="bg-gradient-to-br from-teal-300 via-teal-400 to-cyan-400 hover:from-teal-400 hover:to-cyan-500"
                  disabled={loading}
                />
                <EventButton
                  icon="💩"
                  label="Poop"
                  onClick={() => handlePoopPeeClick('POOP')}
                  color="bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 hover:from-amber-400 hover:to-orange-500"
                  disabled={loading}
                />
                <EventButton
                  icon="💧"
                  label="Pee"
                  onClick={() => handlePoopPeeClick('PEE')}
                  color="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-400 hover:from-blue-400 hover:to-cyan-500"
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

      {/* Modals */}
      {showDurationPicker && durationPickerType && (
        <DurationPicker
          title={durationPickerType === 'NAP' ? 'Nap Duration' : 'Feeding Duration'}
          icon={durationPickerType === 'NAP' ? '😴' : '🍼'}
          increment={durationPickerType === 'NAP' ? 15 : 5}
          maxMinutes={durationPickerType === 'NAP' ? 300 : 120}
          onSelect={handleDurationSelect}
          onCancel={() => {
            setShowDurationPicker(false)
            setDurationPickerType(null)
          }}
        />
      )}

      {showFeedingPrompt && feedingPromptType && (
        <FeedingPrompt
          eventType={feedingPromptType}
          onSelect={handleFeedingResponse}
          onCancel={() => {
            setShowFeedingPrompt(false)
            setFeedingPromptType(null)
          }}
        />
      )}
    </div>
  )
}
