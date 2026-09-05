import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.ADMIN_JWT_SECRET
const PASSCODE = process.env.ADMIN_PASSCODE

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60
const LOGIN_WINDOW_SECONDS = 15 * 60
const LOGIN_LOCK_SECONDS = 15 * 60
const MAX_LOGIN_ATTEMPTS = 8
const ATTEMPT_COOKIE = 'admin_login_attempts'
const serverAttempts = new Map<string, AttemptState>()

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

type AttemptState = {
  count: number
  windowStartedAt: number
  lockedUntil?: number
}

async function readAttemptState(raw?: string): Promise<AttemptState> {
  if (!raw) return { count: 0, windowStartedAt: Date.now() }
  try {
    const { payload } = await jwtVerify(raw, key, { algorithms: ['HS256'] })
    const count = Number(payload.count)
    const windowStartedAt = Number(payload.windowStartedAt)
    const lockedUntil = payload.lockedUntil == null ? undefined : Number(payload.lockedUntil)
    if (!Number.isFinite(count) || !Number.isFinite(windowStartedAt)) throw new Error('bad state')
    return { count, windowStartedAt, lockedUntil: Number.isFinite(lockedUntil) ? lockedUntil : undefined }
  } catch {
    return { count: 0, windowStartedAt: Date.now() }
  }
}

async function encodeAttemptState(state: AttemptState) {
  return new SignJWT({ count: state.count, windowStartedAt: state.windowStartedAt, lockedUntil: state.lockedUntil })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${LOGIN_WINDOW_SECONDS + LOGIN_LOCK_SECONDS}s`)
    .sign(key)
}

async function getClientKey() {
  const requestHeaders = await headers()
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || requestHeaders.get('x-real-ip') || 'unknown-client'
}

function activeAttemptState(state: AttemptState | undefined, now: number): AttemptState {
  if (!state || now - state.windowStartedAt > LOGIN_WINDOW_SECONDS * 1000) {
    return { count: 0, windowStartedAt: now }
  }
  return state
}

export async function encrypt(payload: Record<string, unknown>) {
  if (!isConfigured) throw new Error('Authentication not configured')
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key)
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  if (!isConfigured) throw new Error('Authentication not configured')
  const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'] })
  return payload as Record<string, unknown>
}

export async function login(passcode: string): Promise<{ success: boolean; retryAfterSeconds?: number }> {
  if (!isConfigured) return { success: false }

  const cookieStore = await cookies()
  const clientKey = await getClientKey()
  const now = Date.now()
  const browserAttempts = activeAttemptState(await readAttemptState(cookieStore.get(ATTEMPT_COOKIE)?.value), now)
  const serverState = activeAttemptState(serverAttempts.get(clientKey), now)
  let attempts = serverState.count >= browserAttempts.count ? serverState : browserAttempts

  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    return { success: false, retryAfterSeconds: Math.ceil((attempts.lockedUntil - now) / 1000) }
  }

  if (normalizePasscode(passcode) !== normalizePasscode(PASSCODE!)) {
    attempts = { ...attempts, count: attempts.count + 1 }
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) attempts.lockedUntil = now + LOGIN_LOCK_SECONDS * 1000
    serverAttempts.set(clientKey, attempts)
    cookieStore.set(ATTEMPT_COOKIE, await encodeAttemptState(attempts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: LOGIN_WINDOW_SECONDS + LOGIN_LOCK_SECONDS,
    })
    return {
      success: false,
      retryAfterSeconds: attempts.lockedUntil ? Math.ceil((attempts.lockedUntil - now) / 1000) : undefined,
    }
  }

  serverAttempts.delete(clientKey)
  cookieStore.set(ATTEMPT_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 0,
  })

  const session = await encrypt({ user: 'admin' })
  cookieStore.set('session', session, COOKIE_OPTIONS)
  return { success: true }
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
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  if (!isConfigured) return
  const session = request.cookies.get('session')?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    const response = NextResponse.next()
    response.cookies.set({
      name: 'session',
      value: await encrypt({ user: parsed.user || 'admin' }),
      ...COOKIE_OPTIONS,
    })
    return response
  } catch {
    return
  }
}
