'use client'

interface Event {
  id: string
  type: 'POOP' | 'PEE' | 'WAKE'
  timestamp: string
  notes?: string | null
}

interface EventTimelineProps {
  events: Event[]
}

const eventConfig = {
  POOP: {
    emoji: '💩',
    label: 'Poop',
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  PEE: {
    emoji: '💧',
    label: 'Pee',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  WAKE: {
    emoji: '☀️',
    label: 'Wake',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
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

export function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No events logged yet</p>
        <p className="text-sm mt-2">Start tracking by tapping a button above</p>
      </div>
    )
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
          <h3 className="text-sm font-semibold text-gray-600 mb-3 sticky top-0 bg-white py-2">
            {date}
          </h3>
          <div className="space-y-2">
            {dateEvents.map((event) => {
              const config = eventConfig[event.type]
              return (
                <div
                  key={event.id}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border-2
                    ${config.color}
                  `}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{config.label}</div>
                    {event.notes && (
                      <div className="text-sm opacity-80 mt-1">{event.notes}</div>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
