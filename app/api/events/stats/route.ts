import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const events = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })
    
    // Calculate statistics
    const stats = {
      total: events.length,
      byType: {
        POOP: events.filter(e => e.type === 'POOP').length,
        PEE: events.filter(e => e.type === 'PEE').length,
        NAP: events.filter(e => e.type === 'NAP').length,
        FEED: events.filter(e => e.type === 'FEED').length,
        DIAPER: events.filter(e => e.type === 'DIAPER').length
      },
      byDay: {} as Record<string, number>,
      averagePerDay: 0,
      mostCommonHour: 0
    }
    
    // Group by day
    events.forEach(event => {
      const day = new Date(event.timestamp).toLocaleDateString()
      stats.byDay[day] = (stats.byDay[day] || 0) + 1
    })
    
    // Calculate average per day
    const uniqueDays = Object.keys(stats.byDay).length
    stats.averagePerDay = uniqueDays > 0 ? parseFloat((stats.total / uniqueDays).toFixed(1)) : 0
    
    // Find most common hour
    const hourCounts: Record<number, number> = {}
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    
    if (Object.keys(hourCounts).length > 0) {
      stats.mostCommonHour = parseInt(
        Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]
      )
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
