'use client'

import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/StatsCard'
import Link from 'next/link'

interface Stats {
  total: number
  byType: {
    POOP: number
    PEE: number
    WAKE: number
  }
  byDay: Record<string, number>
  averagePerDay: number
  mostCommonHour: number
}

export default function PatternsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [days])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/events/stats?days=${days}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Patterns & Insights</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Time Period Selector */}
        <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <div className="flex gap-2">
            {[3, 7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-medium transition-colors
                  ${days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p>Loading insights...</p>
          </div>
        ) : stats ? (
          <>
            {/* Overview Stats */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatsCard 
                  title="Total Events" 
                  value={stats.total}
                  icon="📊"
                />
                <StatsCard 
                  title="Daily Average" 
                  value={stats.averagePerDay}
                  icon="📈"
                />
              </div>
            </div>

            {/* By Type */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">By Type</h2>
              <div className="grid grid-cols-3 gap-3">
                <StatsCard 
                  title="Poops" 
                  value={stats.byType.POOP}
                  icon="💩"
                />
                <StatsCard 
                  title="Pees" 
                  value={stats.byType.PEE}
                  icon="💧"
                />
                <StatsCard 
                  title="Wakes" 
                  value={stats.byType.WAKE}
                  icon="☀️"
                />
              </div>
            </div>

            {/* Most Common Hour */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Patterns</h2>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🕐</span>
                  <div>
                    <div className="text-sm text-gray-600">Most Active Time</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatHour(stats.mostCommonHour)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Peak activity hour during the selected period
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Daily Breakdown</h2>
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {Object.entries(stats.byDay).length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No events recorded in this period
                  </div>
                ) : (
                  Object.entries(stats.byDay)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center justify-between p-4">
                        <span className="text-gray-700 font-medium">{date}</span>
                        <span className="text-gray-900 font-bold text-lg">{count}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Failed to load insights</p>
          </div>
        )}
      </main>
    </div>
  )
}
