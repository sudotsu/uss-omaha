'use client'

import { saveContent } from '@/app/admin/actions'
import { logout } from '@/app/admin/logout-action'
import { ContentData } from '@/types/content'
import { useState } from 'react'

interface AdminDashboardProps {
  initialData: ContentData
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<ContentData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeSection, setActiveSection] = useState('hero')

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const result = await saveContent(data)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  // Immutable update helper
  const updateField = (path: string, value: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)) // Deep clone for simplicity in nested YAML
      const keys = path.split('.')
      let current = newData
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const sections = [
    { id: 'metadata', label: 'Site Settings' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'fundraising', label: 'Fundraising' },
    { id: 'phases', label: 'Project Phases' },
    { id: 'mission', label: 'Mission' },
    { id: 'stakeholders', label: 'Stakeholders' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-yellow-500 mb-8 uppercase tracking-widest">Omaha Admin</h2>
        <nav className="flex-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                activeSection === section.id
                  ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 space-y-4">
           <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
              isSaving
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-500/20'
            }`}
          >
            {isSaving ? 'Updating...' : 'Publish Changes'}
          </button>
          
          <form action={logout}>
            <button
              type="submit"
              className="w-full py-2 text-slate-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {message && (
          <div className={`mb-8 p-6 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-200' : 'bg-red-900/30 border-red-500 text-red-200'
          }`}>
            <div className="flex-1">
              <span className="font-bold text-lg block">{message.text}</span>
              {message.type === 'success' && (
                <p className="text-sm mt-1 opacity-80">
                  It usually takes about 60 seconds for the preview to be ready.
                </p>
              )}
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {message.type === 'success' && (
                <a 
                  href="https://uss-omaha-git-admin-content-updates-sudotsu.vercel.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-all text-center flex-1 md:flex-none"
                >
                  View Preview Site
                </a>
              )}
              <button onClick={() => setMessage(null)} className="text-xl opacity-50 hover:opacity-100 px-2">&times;</button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {activeSection === 'metadata' && (
            <section className="space-y-8">
              <h3 className="text-3xl font-bold mb-8">General Site Settings</h3>
              <div className="grid gap-6">
                 <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Website Title</label>
                  <input
                    type="text"
                    value={data.metadata.title}
                    onChange={(e) => updateField('metadata.title', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Year</label>
                  <input
                    type="text"
                    value={data.metadata.year}
                    onChange={(e) => updateField('metadata.year', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'hero' && (
            <section className="space-y-8">
              <h3 className="text-3xl font-bold mb-8">Hero Section</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Main Heading</label>
                  <textarea
                    rows={3}
                    value={data.hero.heading}
                    onChange={(e) => updateField('hero.heading', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Subheading</label>
                  <input
                    type="text"
                    value={data.hero.subheading}
                    onChange={(e) => updateField('hero.subheading', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'fundraising' && (
            <section className="space-y-8">
              <h3 className="text-3xl font-bold mb-8">Fundraising Progress</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Total Goal ($)</label>
                  <input
                    type="number"
                    value={data.fundraisingProgress.goal || ''}
                    onChange={(e) => updateField('fundraisingProgress.goal', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-2xl font-mono focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Amount Raised ($)</label>
                  <input
                    type="number"
                    value={data.fundraisingProgress.raised || ''}
                    onChange={(e) => updateField('fundraisingProgress.raised', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-2xl font-mono focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                 <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Donor Count</label>
                  <input
                    type="number"
                    value={data.fundraisingProgress.donorCount || ''}
                    onChange={(e) => updateField('fundraisingProgress.donorCount', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Last Gift Updated</label>
                  <input
                    type="text"
                    value={data.fundraisingProgress.lastGiftTime}
                    onChange={(e) => updateField('fundraisingProgress.lastGiftTime', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'phases' && (
            <section className="space-y-12">
              <h3 className="text-3xl font-bold mb-8">Project Phases</h3>
              {data.phases.phaseList.map((phase, idx) => (
                <div key={idx} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 space-y-6">
                  <h4 className="text-xl font-bold text-yellow-500">Phase {phase.number}: {phase.title}</h4>
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Description</label>
                      <input
                        type="text"
                        value={phase.description}
                        onChange={(e) => {
                          const newList = [...data.phases.phaseList]
                          newList[idx].description = e.target.value
                          updateField('phases.phaseList', newList)
                        }}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-yellow-500 outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Status</label>
                        <input
                          type="text"
                          value={phase.status}
                          onChange={(e) => {
                            const newList = [...data.phases.phaseList]
                            newList[idx].status = e.target.value
                            updateField('phases.phaseList', newList)
                          }}
                          className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-yellow-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Cost</label>
                        <input
                          type="text"
                          value={phase.cost}
                          onChange={(e) => {
                            const newList = [...data.phases.phaseList]
                            newList[idx].cost = e.target.value
                            updateField('phases.phaseList', newList)
                          }}
                          className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-yellow-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm font-bold uppercase mb-2">% Complete</label>
                        <input
                          type="number"
                          value={phase.percentComplete || ''}
                          onChange={(e) => {
                            const newList = [...data.phases.phaseList]
                            newList[idx].percentComplete = e.target.value === '' ? 0 : parseInt(e.target.value)
                            updateField('phases.phaseList', newList)
                          }}
                          className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 focus:border-yellow-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeSection === 'mission' && (
            <section className="space-y-8">
              <h3 className="text-3xl font-bold mb-8">Mission Statement</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Heading</label>
                  <input
                    type="text"
                    value={data.mission.heading}
                    onChange={(e) => updateField('mission.heading', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-bold uppercase mb-2">Statement</label>
                  <textarea
                    rows={5}
                    value={data.mission.statement}
                    onChange={(e) => updateField('mission.statement', e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'stakeholders' && (
            <section className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold">Action Committee</h3>
                <button 
                  onClick={() => {
                    const newMembers = [...data.stakeholders.members, { name: 'New Member', title: 'Member Title' }]
                    updateField('stakeholders.members', newMembers)
                  }}
                  className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm"
                >
                  + Add Member
                </button>
              </div>
              <div className="grid gap-4">
                {data.stakeholders.members.map((member, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex gap-4 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...data.stakeholders.members]
                          newMembers[idx].name = e.target.value
                          updateField('stakeholders.members', newMembers)
                        }}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:border-yellow-500 outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={member.title}
                        onChange={(e) => {
                          const newMembers = [...data.stakeholders.members]
                          newMembers[idx].title = e.target.value
                          updateField('stakeholders.members', newMembers)
                        }}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:border-yellow-500 outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newMembers = data.stakeholders.members.filter((_, i) => i !== idx)
                        updateField('stakeholders.members', newMembers)
                      }}
                      className="text-red-500 hover:text-red-400 p-2"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-20 pt-10 border-t border-slate-800 text-center text-slate-500">
             <p>Need more fields? Just ask your developer!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
