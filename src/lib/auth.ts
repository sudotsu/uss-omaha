import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.ADMIN_JWT_SECRET
const PASSCODE = process.env.ADMIN_PASSCODE

// Keep authorized devices signed in until the user explicitly signs out.
// A long max-age is refreshed on every protected request by updateSession().
const SESSION_MAX_AGE_SECONDS = 10 * 365 * 24 * 60 * 60

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
  maxAge: SESSION_MAX_AGE_SECONDS,
}

function normalizePasscode(value: string) {
  return value
    .trim()
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .toUpperCase()
}

export async function encrypt(payload: any) {
  if (!isConfigured) throw new Error('Authentication not configured')
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
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
  if (!isConfigured || normalizePasscode(passcode) !== normalizePasscode(PASSCODE!)) return false

  const session = await encrypt({ user: 'admin' })

  const cookieStore = await cookies()
  cookieStore.set('session', session, COOKIE_OPTIONS)
  return true
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { ...COOKIE_OPTIONS, maxAge: 0 })
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
    const res = NextResponse.next()
    res.cookies.set({
      name: 'session',
      value: await encrypt(parsed),
      ...COOKIE_OPTIONS,
    })
    return res
  } catch (e) {
    return
  }
}
