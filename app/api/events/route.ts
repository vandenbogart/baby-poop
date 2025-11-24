import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const events = await prisma.event.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    })
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, timestamp, notes, duration, duringFeeding } = body
    
    if (!type || !timestamp) {
      return NextResponse.json(
        { error: 'Type and timestamp are required' },
        { status: 400 }
      )
    }
    
    const event = await prisma.event.create({
      data: {
        type,
        timestamp: new Date(timestamp),
        notes: notes || null,
        duration: duration || null,
        duringFeeding: duringFeeding ?? null,
        userId: session.userId
      }
    })
    
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
