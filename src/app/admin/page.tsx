import { getSession, login } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  const params = await searchParams
  const error = params.error

  if (session) {
    redirect('/admin/dashboard')
  }

  async function handleLogin(formData: FormData) {
    'use server'
    const passcode = formData.get('passcode') as string
    const success = await login(passcode)

    if (success) {
      redirect('/admin/dashboard')
    } else {
      redirect('/admin?error=Invalid passcode')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border-2 border-yellow-500 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">USS Omaha Admin</h1>
          <p className="text-slate-400">Enter the access code to continue</p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              name="passcode"
              placeholder="Passcode"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-4 text-center text-2xl tracking-widest focus:outline-none focus:border-yellow-500 transition-all"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-95"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs">
            Admin access is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  )
}
