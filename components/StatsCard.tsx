interface StatsCardProps {
  title: string
  value: string | number
  icon?: string
  subtitle?: string
}

export function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  const gradients = {
    'Poops': 'from-amber-200 to-orange-200',
    'Pees': 'from-blue-200 to-cyan-200',
    'Wakes': 'from-yellow-200 to-amber-200',
    'Total': 'from-purple-200 to-pink-200'
  }
  
  const gradient = gradients[title as keyof typeof gradients] || 'from-pink-200 to-purple-200'
  
  return (
    <div className={`
      bg-gradient-to-br ${gradient}
      rounded-2xl shadow-lg p-5 
      border-4 border-white/50
      backdrop-blur-sm
      hover:scale-105 transition-all duration-300
      hover:shadow-xl
    `}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-4xl animate-wiggle">{icon}</span>}
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-700 opacity-80">{title}</div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}
