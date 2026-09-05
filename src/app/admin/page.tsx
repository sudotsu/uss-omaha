import { getSession, login } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  const params = await searchParams
  const error = typeof params.error === 'string' ? params.error : undefined

  if (session) redirect('/admin/dashboard')

  async function handleLogin(formData: FormData) {
    'use server'

    const passcode = String(formData.get('passcode') || '')
    const result = await login(passcode)

    if (result.success) redirect('/admin/dashboard')

    if (result.retryAfterSeconds) {
      const minutes = Math.max(1, Math.ceil(result.retryAfterSeconds / 60))
      redirect(`/admin?error=${encodeURIComponent(`Too many attempts. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`)}`)
    }

    redirect('/admin?error=Incorrect%20passcode.%20Check%20the%20code%20and%20try%20again.')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">USS Omaha Admin</h1>
          <p className="text-slate-400">Enter the access code to continue</p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <input
            type="password"
            name="passcode"
            placeholder="Passcode"
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-4 text-center text-2xl tracking-widest focus:outline-none focus:border-yellow-500 transition-all"
            required
            autoFocus
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />

          {error && <p className="text-red-400 text-center text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl text-lg shadow-lg transition-all active:scale-[0.99]"
          >
            Access Dashboard
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs">
          Authorized devices stay signed in for up to 30 days of activity. Signing out ends the session immediately.
        </p>
      </div>
    </div>
  )
}
