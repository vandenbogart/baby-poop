'use client'

import { useState, useEffect, useCallback } from 'react'

interface TimerButtonProps {
  type: 'NAP' | 'FEED'
  icon: string
  label: string
  color: string
  activeColor: string
  onTimerComplete: (startTime: Date, endTime: Date, durationMinutes: number) => void
  disabled?: boolean
}

const TIMER_STORAGE_KEY = 'baby-tracker-active-timers'

interface ActiveTimers {
  NAP?: string // ISO timestamp
  FEED?: string // ISO timestamp
}

function getActiveTimers(): ActiveTimers {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(TIMER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setActiveTimer(type: 'NAP' | 'FEED', startTime: string | null) {
  const timers = getActiveTimers()
  if (startTime) {
    timers[type] = startTime
  } else {
    delete timers[type]
  }
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timers))
}

function formatElapsedTime(startTime: Date): string {
  const now = new Date()
  const elapsedMs = now.getTime() - startTime.getTime()
  const totalSeconds = Math.floor(elapsedMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function TimerButton({
  type,
  icon,
  label,
  color,
  activeColor,
  onTimerComplete,
  disabled
}: TimerButtonProps) {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedDisplay, setElapsedDisplay] = useState('0:00')
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsHydrated(true)
    const timers = getActiveTimers()
    if (timers[type]) {
      setStartTime(new Date(timers[type]!))
    }
  }, [type])

  // Update elapsed time display
  useEffect(() => {
    if (!startTime) return

    const updateDisplay = () => {
      setElapsedDisplay(formatElapsedTime(startTime))
    }

    updateDisplay()
    const interval = setInterval(updateDisplay, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const handleClick = useCallback(() => {
    if (startTime) {
      // Timer is running - stop it and create event
      const endTime = new Date()
      const durationMs = endTime.getTime() - startTime.getTime()
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000))

      // Clear timer from storage and state
      setActiveTimer(type, null)
      setStartTime(null)
      setElapsedDisplay('0:00')

      // Call completion handler
      onTimerComplete(startTime, endTime, durationMinutes)
    } else {
      // Start new timer
      const now = new Date()
      setActiveTimer(type, now.toISOString())
      setStartTime(now)
    }
  }, [startTime, type, onTimerComplete])

  const isRunning = startTime !== null

  // Don't render timer state until hydrated to avoid mismatch
  if (!isHydrated) {
    return (
      <button
        disabled={disabled}
        className={`
          flex flex-col items-center justify-center gap-3
          p-8 rounded-3xl shadow-2xl
          transition-all duration-300 active:scale-95 hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
          ${color}
          min-h-[160px] w-full
          text-white font-bold text-xl
          relative overflow-hidden
          border-4 border-white/30
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <div className="text-6xl animate-float relative z-10">{icon}</div>
        <span className="relative z-10 tracking-wide">{label}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-3
        p-8 rounded-3xl shadow-2xl
        transition-all duration-300 active:scale-95 hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isRunning ? activeColor : color}
        min-h-[160px] w-full
        text-white font-bold text-xl
        relative overflow-hidden
        border-4 ${isRunning ? 'border-white/50 animate-pulse-slow' : 'border-white/30'}
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]
      `}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Running indicator */}
      {isRunning && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold">Recording</span>
        </div>
      )}

      <div className={`text-6xl relative z-10 ${isRunning ? '' : 'animate-float'}`}>
        {icon}
      </div>

      {isRunning ? (
        <>
          <span className="relative z-10 tracking-wide text-3xl font-mono">
            {elapsedDisplay}
          </span>
          <span className="relative z-10 text-sm opacity-90">
            Tap to stop {label.toLowerCase()}
          </span>
        </>
      ) : (
        <span className="relative z-10 tracking-wide">{label}</span>
      )}
    </button>
  )
}
