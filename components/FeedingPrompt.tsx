'use client'

interface FeedingPromptProps {
  eventType: 'POOP' | 'PEE'
  onSelect: (duringFeeding: boolean) => void
  onCancel: () => void
}

export function FeedingPrompt({ eventType, onSelect, onCancel }: FeedingPromptProps) {
  const config = {
    POOP: {
      emoji: '💩',
      label: 'Poop',
      color: 'from-amber-400 to-orange-400'
    },
    PEE: {
      emoji: '💧',
      label: 'Pee',
      color: 'from-blue-400 to-cyan-400'
    }
  }

  const { emoji, label, color } = config[eventType]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl shadow-2xl max-w-md w-full border-4 border-white/50 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${color} p-6 text-center`}>
          <div className="text-6xl mb-3 animate-wiggle">{emoji}</div>
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <p className="text-white/90 text-sm mt-2">Did this happen during feeding?</p>
        </div>

        {/* Yes/No Buttons */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => onSelect(true)}
            className="
              w-full py-6 px-6
              bg-gradient-to-br from-green-300 to-emerald-400
              hover:from-green-400 hover:to-emerald-500
              border-4 border-white/50
              text-white font-bold text-xl
              rounded-2xl 
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-lg hover:shadow-xl
            "
          >
            🍼 Yes, During Feeding
          </button>

          <button
            onClick={() => onSelect(false)}
            className="
              w-full py-6 px-6
              bg-gradient-to-br from-purple-300 to-pink-400
              hover:from-purple-400 hover:to-pink-500
              border-4 border-white/50
              text-white font-bold text-xl
              rounded-2xl 
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-lg hover:shadow-xl
            "
          >
            ⭐ No, Not During Feeding
          </button>
        </div>

        {/* Cancel Button */}
        <div className="p-4 pt-0">
          <button
            onClick={onCancel}
            className="
              w-full py-3 px-6 
              bg-white/60 hover:bg-white/80
              text-gray-700 font-bold text-sm
              rounded-2xl 
              transition-all duration-200
              hover:scale-105 active:scale-95
              shadow-md
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
