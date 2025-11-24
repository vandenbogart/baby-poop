'use client'

interface DurationPickerProps {
  title: string
  icon: string
  onSelect: (minutes: number) => void
  onCancel: () => void
  increment: number // 5 or 15 minutes
  maxMinutes: number // max duration
}

export function DurationPicker({ 
  title, 
  icon, 
  onSelect, 
  onCancel, 
  increment, 
  maxMinutes 
}: DurationPickerProps) {
  // Generate options based on increment up to maxMinutes
  const options: number[] = []
  for (let i = increment; i <= maxMinutes; i += increment) {
    options.push(i)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`
    }
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden border-4 border-white/50 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 text-center">
          <div className="text-6xl mb-3 animate-wiggle">{icon}</div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-white/90 text-sm mt-1">Select duration</p>
        </div>

        {/* Duration Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-3 gap-3">
            {options.map((minutes) => (
              <button
                key={minutes}
                onClick={() => onSelect(minutes)}
                className="
                  bg-gradient-to-br from-blue-100 to-purple-100
                  hover:from-blue-200 hover:to-purple-200
                  border-4 border-white/50
                  rounded-2xl p-4 
                  font-bold text-gray-800
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                "
              >
                {formatDuration(minutes)}
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="p-4 border-t-4 border-white/50">
          <button
            onClick={onCancel}
            className="
              w-full py-4 px-6 
              bg-gradient-to-r from-gray-400 to-gray-500
              hover:from-gray-500 hover:to-gray-600
              text-white font-bold text-lg
              rounded-2xl 
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-lg
            "
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
