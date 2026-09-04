import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin and its subroutes, except /admin itself (the login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const session = request.cookies.get('session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      // Validate the token and keep the persistent cookie fresh.
      return (await updateSession(request)) ?? NextResponse.next()
    } catch (e) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
