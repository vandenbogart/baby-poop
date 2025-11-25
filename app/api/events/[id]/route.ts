import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EventType } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { timestamp, startTime, notes, type, duration } = body

    const updateData: {
      timestamp?: Date
      notes?: string | null
      type?: EventType
      duration?: number | null
    } = {}

    // Handle start/end time updates for duration events
    if (startTime && timestamp) {
      // Both times provided - calculate new duration
      const start = new Date(startTime)
      const end = new Date(timestamp)
      const durationMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000))
      updateData.timestamp = end
      updateData.duration = durationMinutes
    } else if (timestamp) {
      updateData.timestamp = new Date(timestamp)
    }

    // Allow direct duration update
    if (duration !== undefined && !startTime) {
      updateData.duration = duration
    }

    if (notes !== undefined) {
      updateData.notes = notes || null
    }
    if (type) {
      updateData.type = type as EventType
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.event.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
