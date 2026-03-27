import { loadDraftContent } from '@/app/admin/actions'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function DashboardPage() {
  try {
    const content = await loadDraftContent()
    return <AdminDashboard initialData={content} />
  } catch (error) {
    console.error('Failed to load dashboard content:', error)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border-2 border-red-500 rounded-2xl p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard Error</h2>
          <p className="text-slate-400 mb-6">
            We couldn't load the site content. This usually means the GitHub configuration is missing or the content file is corrupted.
          </p>
          <a 
            href="/admin" 
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    )
  }
}
