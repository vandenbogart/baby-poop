import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData, defaultSession } from '@/lib/session'
import { cookies } from 'next/headers'

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  
  if (!session.isLoggedIn) {
    return NextResponse.json(defaultSession)
  }

  return NextResponse.json(session)
}
