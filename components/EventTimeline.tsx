'use client'

import { useState } from 'react'

interface Event {
  id: string
  type: 'POOP' | 'PEE' | 'NAP' | 'FEED' | 'DIAPER'
  timestamp: string
  notes?: string | null
  duration?: number | null
  duringFeeding?: boolean | null
}

interface EventTimelineProps {
  events: Event[]
  onEventUpdate?: () => void
}

const eventConfig = {
  POOP: {
    emoji: '💩',
    label: 'Poop',
    color: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 border-amber-200'
  },
  PEE: {
    emoji: '💧',
    label: 'Pee',
    color: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-800 border-blue-200'
  },
  NAP: {
    emoji: '😴',
    label: 'Nap',
    color: 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200'
  },
  FEED: {
    emoji: '🍼',
    label: 'Feeding',
    color: 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-800 border-pink-200'
  },
  DIAPER: {
    emoji: '🧷',
    label: 'Diaper',
    color: 'bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-800 border-teal-200'
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

function formatDurationRange(timestamp: string, durationMinutes: number) {
  const endTime = new Date(timestamp)
  const startTime = new Date(endTime.getTime() - durationMinutes * 60 * 1000)
  
  const startStr = startTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  const endStr = endTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  
  return `${startStr} - ${endStr}`
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export function EventTimeline({ events, onEventUpdate }: EventTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTime, setEditTime] = useState('')
  const [editDate, setEditDate] = useState('')

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-white/50">
        <div className="text-6xl mb-4 animate-wiggle">🍼</div>
        <p className="text-xl font-bold text-gray-600">No events logged yet</p>
        <p className="text-sm mt-2 text-gray-500">Start tracking by tapping a button above!</p>
      </div>
    )
  }

  const handleEditClick = (event: Event) => {
    const date = new Date(event.timestamp)
    setEditingId(event.id)
    setEditDate(date.toISOString().split('T')[0])
    setEditTime(date.toTimeString().slice(0, 5))
  }

  const handleSave = async (eventId: string) => {
    try {
      const newTimestamp = new Date(`${editDate}T${editTime}`)
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: newTimestamp.toISOString() })
      })

      if (response.ok) {
        setEditingId(null)
        onEventUpdate?.()
      }
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onEventUpdate?.()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  // Group events by date
  const groupedEvents: Record<string, Event[]> = {}
  events.forEach(event => {
    const dateKey = formatDate(event.timestamp)
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = []
    }
    groupedEvents[dateKey].push(event)
  })

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date}>
          <h3 className="text-base font-bold mb-3 sticky top-0 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full inline-block text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text shadow-sm">
            {date}
          </h3>
          <div className="space-y-3">
            {dateEvents.map((event) => {
              const config = eventConfig[event.type]
              const isEditing = editingId === event.id

              return (
                <div
                  key={event.id}
                  className={`
                    flex flex-col gap-3 p-4 rounded-2xl border-4
                    ${config.color}
                    shadow-lg hover:shadow-xl transition-all duration-300
                    backdrop-blur-sm
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{config.emoji}</span>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{config.label}</div>
                      {event.duration && (
                        <div className="text-sm opacity-80 mt-1">
                          ⏱️ {formatDurationRange(event.timestamp, event.duration)}
                          <span className="text-xs ml-2">
                            ({event.duration < 60 
                              ? `${event.duration} min` 
                              : `${Math.floor(event.duration / 60)} hr${Math.floor(event.duration / 60) > 1 ? 's' : ''} ${event.duration % 60 > 0 ? `${event.duration % 60} min` : ''}`})
                          </span>
                        </div>
                      )}
                      {event.duringFeeding !== null && event.duringFeeding !== undefined && (
                        <div className="text-xs opacity-80 mt-1 flex items-center gap-1">
                          <span>🍼</span>
                          <span>{event.duringFeeding ? 'During feeding' : 'Not during feeding'}</span>
                        </div>
                      )}
                      {event.notes && (
                        <div className="text-sm opacity-80 mt-1">{event.notes}</div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="text-sm font-bold bg-white/60 px-3 py-1 rounded-full">
                        {formatTime(event.timestamp)}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2 items-center flex-wrap">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm font-medium bg-white"
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm font-medium bg-white"
                      />
                      <button
                        onClick={() => handleSave(event.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl text-sm font-bold hover:from-green-500 hover:to-emerald-600 shadow-md transition-all"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl text-sm font-bold hover:from-gray-500 hover:to-gray-600 shadow-md transition-all"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="px-4 py-2 bg-white/70 hover:bg-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
                      >
                        ✏️ Edit Time
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
