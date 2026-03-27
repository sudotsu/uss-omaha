import { loadDraftContent } from '@/app/admin/actions'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function DashboardPage() {
  const content = await loadDraftContent()

  return <AdminDashboard initialData={content} />
}
