import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const session = request.cookies.get('session')?.value
    if (!session) return NextResponse.redirect(new URL('/admin', request.url))

    const refreshed = await updateSession(request)
    if (!refreshed) return NextResponse.redirect(new URL('/admin', request.url))
    return refreshed
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
