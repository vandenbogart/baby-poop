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
        p-8 rounded-2xl shadow-lg
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${color}
        min-h-[160px] w-full
        text-white font-semibold text-lg
      `}
    >
      <div className="text-5xl">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  )
}
