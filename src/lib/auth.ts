import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.ADMIN_JWT_SECRET
const PASSCODE = process.env.ADMIN_PASSCODE

// Fail closed: If secrets are missing, the app should not allow any auth operations
const isConfigured = !!(SECRET_KEY && PASSCODE)

if (!isConfigured) {
  console.error('CRITICAL: ADMIN_JWT_SECRET or ADMIN_PASSCODE is not set. Admin access is disabled.')
}

const key = new TextEncoder().encode(SECRET_KEY || 'unconfigured-secret-key-logic-disabled')

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function encrypt(payload: any) {
  if (!isConfigured) throw new Error('Authentication not configured')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  if (!isConfigured) throw new Error('Authentication not configured')
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(passcode: string) {
  if (!isConfigured || passcode !== PASSCODE) return false

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  const session = await encrypt({ user: 'admin', expires })

  const cookieStore = await cookies()
  cookieStore.set('session', session, { ...COOKIE_OPTIONS, expires })
  return true
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { ...COOKIE_OPTIONS, expires: new Date(0) })
}

export async function getSession() {
  if (!isConfigured) return null
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  try {
    return await decrypt(session)
  } catch (e) {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  if (!isConfigured) return
  const session = request.cookies.get('session')?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
      name: 'session',
      value: await encrypt(parsed),
      ...COOKIE_OPTIONS,
      expires: parsed.expires,
    })
    return res
  } catch (e) {
    return
  }
}
