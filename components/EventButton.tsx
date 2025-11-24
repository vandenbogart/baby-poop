'use client'

import { ReactNode } from 'react'

interface EventButtonProps {
  icon: ReactNode
  label: string
  onClick: () => void
  color: string
  disabled?: boolean
}

export function EventButton({ icon, label, onClick, color, disabled }: EventButtonProps) {
  return (
    <button
      onClick={onClick}
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
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <div className="text-6xl animate-float relative z-10">
        {icon}
      </div>
      <span className="relative z-10 tracking-wide">{label}</span>
    </button>
  )
}
