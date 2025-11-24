interface StatsCardProps {
  title: string
  value: string | number
  icon?: string
  subtitle?: string
}

export function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <div className="flex-1">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}
