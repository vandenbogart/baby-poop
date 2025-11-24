'use client'

import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/StatsCard'
import Link from 'next/link'

interface Stats {
  total: number
  byType: {
    POOP: number
    PEE: number
    NAP: number
    FEED: number
    DIAPER: number
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
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 border-b-4 border-white/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link 
            href="/"
            className="px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full font-bold text-purple-600 hover:text-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            📊 Patterns & Insights
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Time Period Selector */}
        <div className="mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5 border-4 border-white/50 shadow-lg backdrop-blur-sm">
          <label className="block text-base font-bold text-gray-700 mb-3">
            ⏰ Time Period
          </label>
          <div className="flex gap-2">
            {[3, 7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`
                  flex-1 py-2 px-3 rounded-xl font-bold transition-all shadow-md
                  ${days === d
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white scale-105'
                    : 'bg-white/80 text-gray-700 hover:scale-105 hover:bg-white'}
                `}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-white/50">
            <div className="text-6xl mb-4 animate-wiggle">🔮</div>
            <p className="text-xl font-bold text-gray-600">Loading insights...</p>
          </div>
        ) : stats ? (
          <>
            {/* Overview Stats */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                ✨ Overview
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StatsCard 
                  title="Total" 
                  value={stats.total}
                  icon="🎉"
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
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text">
                🎯 By Type
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <StatsCard 
                  title="Feeds" 
                  value={stats.byType.FEED}
                  icon="🍼"
                />
                <StatsCard 
                  title="Naps" 
                  value={stats.byType.NAP}
                  icon="😴"
                />
                <StatsCard 
                  title="Diapers" 
                  value={stats.byType.DIAPER}
                  icon="🧷"
                />
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
              </div>
            </div>

            {/* Most Common Hour */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
                🔍 Patterns
              </h2>
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-5 border-4 border-white/50 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="text-5xl animate-wiggle">🕐</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 opacity-80">Most Active Time</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {formatHour(stats.mostCommonHour)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Peak activity hour during the selected period
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text">
                📅 Daily Breakdown
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-4 border-white/50 shadow-lg divide-y-2 divide-white/50">
                {Object.entries(stats.byDay).length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="font-bold text-gray-500">No events recorded in this period</p>
                  </div>
                ) : (
                  Object.entries(stats.byDay)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center justify-between p-4 hover:bg-white/50 transition-colors">
                        <span className="text-gray-700 font-bold">{date}</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-lg px-4 py-1 rounded-full">{count}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-white/50">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-xl font-bold text-gray-600">Failed to load insights</p>
          </div>
        )}
      </main>
    </div>
  )
}
