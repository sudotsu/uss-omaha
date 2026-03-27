import { loadContent } from '@/lib/content'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function DashboardPage() {
  const content = loadContent()

  return <AdminDashboard initialData={content} />
}
