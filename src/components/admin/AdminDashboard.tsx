'use client'

import { saveContent } from '@/app/admin/actions'
import { logout } from '@/app/admin/logout-action'
import { ContentData } from '@/types/content'
import { useState, useEffect, memo } from 'react'
import yaml from 'js-yaml'
import { Tooltip, HelpModal } from './HelpSystem'

// --- UI HELPER COMPONENTS ---

const Label = memo(({ children, htmlFor, tooltip }: { children: React.ReactNode; htmlFor?: string; tooltip?: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <label 
      htmlFor={htmlFor}
      className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block"
    >
      {children}
    </label>
    {tooltip && (
      <Tooltip content={tooltip}>
        <span className="cursor-help w-4 h-4 rounded-full bg-slate-800 text-slate-500 text-[8px] flex items-center justify-center border border-slate-700 hover:border-yellow-500 transition-colors font-black italic">
          ?
        </span>
      </Tooltip>
    )}
  </div>
))
Label.displayName = 'Label'

const HelpButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-yellow-500 hover:border-yellow-500 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic"
  >
    <span className="text-yellow-500">?</span> Help Guide
  </button>
)

const Input = memo(({ value, onChange, type = "text", ...rest }: any) => (
  <input 
    type={type} 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-4 text-lg font-bold focus:border-yellow-500 outline-none transition-all" 
    {...rest}
  />
))
Input.displayName = 'Input'

const TextArea = memo(({ value, onChange, rows = 3, ...rest }: any) => (
  <textarea 
    rows={rows} 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-4 text-lg font-bold focus:border-yellow-500 outline-none transition-all" 
    {...rest}
  />
))
TextArea.displayName = 'TextArea'

// --- MAIN COMPONENT ---

interface AdminDashboardProps {
  initialData: ContentData
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<ContentData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeSection, setActiveSection] = useState('metadata')
  const [rawYaml, setRawYaml] = useState('')
  const [yamlError, setYamlError] = useState<string | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // Sync raw YAML when form data changes
  useEffect(() => {
    try {
      const dump = yaml.dump(data, { indent: 2, lineWidth: -1 })
      setRawYaml(dump)
      setYamlError(null)
    } catch (e) {
      console.error('Failed to stringify data for raw editor', e)
    }
  }, [data])

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

  // Defensive update helper
  const updateField = (path: string, value: any) => {
    setData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let current = newData
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        // Ensure path exists
        if (current[key] === undefined) {
          // Guess if it should be an array or object based on next key
          const nextKey = keys[i + 1]
          current[key] = isNaN(parseInt(nextKey)) ? {} : []
        }
        current = current[key]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleRawYamlChange = (value: string) => {
    setRawYaml(value)
    try {
      const parsed = yaml.load(value) as any
      
      // Structural validation
      const requiredSections = [
        'metadata', 'hero', 'mission', 'agenda', 'background', 
        'letters', 'submarineFacts', 'timeline', 'phases', 
        'fundraisingProgress', 'budget', 'locationShift', 
        'sitePlan', 'gallery', 'executionPhotos', 'whyNow', 
        'callToAction', 'volunteer', 'stakeholders', 'close', 
        'presentedBy', 'footer', 'navy250'
      ]
      
      const missing = requiredSections.filter(key => !parsed || !parsed[key])
      if (missing.length > 0) {
        throw new Error(`Invalid Structure: Missing sections [${missing.join(', ')}]`)
      }

      // Basic type validation for lists
      if (!Array.isArray(parsed.agenda.items)) throw new Error('agenda.items must be an array')
      if (!Array.isArray(parsed.phases.phaseList)) throw new Error('phases.phaseList must be an array')
      if (!Array.isArray(parsed.gallery.images)) throw new Error('gallery.images must be an array')

      setData(parsed as ContentData)
      setYamlError(null)
    } catch (e: any) {
      setYamlError(e.message || 'Invalid YAML format')
    }
  }

  const sections = [
    { group: 'General', items: [
      { id: 'metadata', label: 'Site Identity' },
      { id: 'hero', label: 'Hero Section' },
      { id: 'mission', label: 'Mission' },
      { id: 'agenda', label: 'Meeting Agenda' },
      { id: 'footer', label: 'Footer & Links' },
    ]},
    { group: 'Historical Content', items: [
      { id: 'background', label: 'Background Info' },
      { id: 'timeline', label: 'Ship History' },
      { id: 'submarineFacts', label: 'Submarine Facts' },
      { id: 'letters', label: 'Support Letters' },
    ]},
    { group: 'The Project', items: [
      { id: 'phases', label: 'Project Phases' },
      { id: 'budget', label: 'Budget & Need' },
      { id: 'locationShift', label: 'Site Selection' },
      { id: 'sitePlan', label: 'Site Plan' },
    ]},
    { group: 'Media', items: [
      { id: 'gallery', label: 'Image Gallery' },
      { id: 'executionPhotos', label: 'Execution Photos' },
      { id: 'navy250', label: 'Navy 250 Assets' },
    ]},
    { group: 'Engagement', items: [
      { id: 'fundraising', label: 'Fundraising Stats' },
      { id: 'whyNow', label: 'Why Now?' },
      { id: 'callToAction', label: 'Donation Info' },
      { id: 'volunteer', label: 'Volunteer Info' },
      { id: 'stakeholders', label: 'Action Committee' },
      { id: 'presentedBy', label: 'Presenters' },
      { id: 'close', label: 'Closing Screen' },
    ]},
    { group: 'Advanced', items: [
      { id: 'godmode', label: '⚡ GOD MODE (Raw Code)' },
    ]}
  ]

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-tighter italic">Omaha Command</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">USS Omaha SSN-692 Relaunch</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {sections.map((group) => (
            <div key={group.group} className="mb-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-4">{group.group}</h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-tight ${
                      activeSection === item.id
                        ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-6 bg-slate-800/50 border-t border-slate-700 space-y-3">
           <button
            onClick={handleSave}
            disabled={isSaving || !!yamlError}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-xl transition-all active:scale-95 uppercase italic tracking-tighter ${
              isSaving
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-500/20'
            }`}
          >
            {isSaving ? 'Syncing...' : 'Deploy Changes'}
          </button>
          <form action={logout}>
            <button type="submit" className="w-full py-2 text-slate-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors">
              Abort Session (Sign Out)
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900 p-8 custom-scrollbar">
        {message && (
          <div className={`mb-8 p-6 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
            message.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-200' : 'bg-red-900/30 border-red-500 text-red-200'
          }`}>
            <div className="flex-1">
              <span className="font-bold text-lg block">{message.text}</span>
              {message.type === 'success' && (
                <p className="text-sm mt-1 opacity-80 italic">Update pushed to GitHub. Review the preview branch to sign off.</p>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {message.type === 'success' && (
                <a href="https://uss-omaha-git-admin-content-updates-sudotsu.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-yellow-500 transition-all text-center flex-1 md:flex-none italic">
                  Launch Preview
                </a>
              )}
              <button onClick={() => setMessage(null)} className="text-xl opacity-50 hover:opacity-100 px-2" aria-label="Dismiss message">&times;</button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto pb-20">
          
          {/* GOD MODE */}
          {activeSection === 'godmode' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">⚡ God Mode</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Full YAML Control • Syntax Validated</p>
              <textarea 
                id="raw-yaml-editor"
                aria-label="Raw YAML Editor"
                value={rawYaml} 
                onChange={(e) => handleRawYamlChange(e.target.value)} 
                className={`w-full h-[60vh] bg-black text-green-400 font-mono p-6 rounded-2xl border-2 focus:outline-none transition-all leading-relaxed ${yamlError ? 'border-red-500 shadow-red-500/10' : 'border-slate-800 focus:border-yellow-500'}`} 
              />
              {yamlError && <div className="bg-red-900 text-red-100 p-4 rounded-xl text-xs font-mono border border-red-500 animate-in fade-in">{yamlError}</div>}
            </div>
          )}

          {/* SITE IDENTITY */}
          {activeSection === 'metadata' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Site Identity</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="meta-title" tooltip="The main name of your website shown in browser tabs.">Site Title</Label><Input id="meta-title" value={data.metadata.title} onChange={(v: string) => updateField('metadata.title', v)} /></div>
                <div><Label htmlFor="meta-subtitle" tooltip="A short tagline that appears near the title.">Subtitle</Label><Input id="meta-subtitle" value={data.metadata.subtitle} onChange={(v: string) => updateField('metadata.subtitle', v)} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label htmlFor="meta-year" tooltip="The current operational year of the project.">Year</Label><Input id="meta-year" value={data.metadata.year} onChange={(v: string) => updateField('metadata.year', v)} /></div>
                  <div>
                    <Label htmlFor="meta-mode" tooltip="Memorial: Standard view. Donor: Focuses on fundraising goals.">Mode</Label>
                    <select id="meta-mode" value={data.metadata.mode} onChange={(e) => updateField('metadata.mode', e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-4 text-lg font-bold focus:border-yellow-500 outline-none appearance-none">
                      <option value="memorial">Memorial</option>
                      <option value="donor">Donor</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HERO */}
          {activeSection === 'hero' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Hero Section</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="hero-heading" tooltip="Main title at the very top. Use bold, clear language.">Main Heading</Label><TextArea id="hero-heading" rows={3} value={data.hero.heading} onChange={(v: string) => updateField('hero.heading', v)} /></div>
                <div><Label htmlFor="hero-sub" tooltip="Smaller text that appears under the main heading.">Subheading</Label><Input id="hero-sub" value={data.hero.subheading} onChange={(v: string) => updateField('hero.subheading', v)} /></div>
                <div><Label htmlFor="hero-bg" tooltip="The file location of your background image (e.g., /images/hero.jpg).">Background Image Path</Label><Input id="hero-bg" value={data.hero.backgroundImage} onChange={(v: string) => updateField('hero.backgroundImage', v)} /></div>
              </div>
            </div>
          )}

          {/* MISSION */}
          {activeSection === 'mission' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Mission</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="mission-heading" tooltip="The title for your mission section.">Heading</Label><Input id="mission-heading" value={data.mission.heading} onChange={(v: string) => updateField('mission.heading', v)} /></div>
                <div><Label htmlFor="mission-statement" tooltip="The core reason for this project. Keep it inspiring.">Statement</Label><TextArea id="mission-statement" rows={5} value={data.mission.statement} onChange={(v: string) => updateField('mission.statement', v)} /></div>
                <div><Label htmlFor="mission-highlights" tooltip="List key points separated by commas (e.g., Honor, Legacy, Education).">Highlights (Comma separated)</Label><Input id="mission-highlights" value={data.mission.highlights.join(', ')} onChange={(v: string) => updateField('mission.highlights', v.split(',').map(s => s.trim()))} /></div>
              </div>
            </div>
          )}

          {/* AGENDA */}
          {activeSection === 'agenda' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Agenda</h3>
                    <HelpButton onClick={() => setIsHelpOpen(true)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => updateField('agenda.items', [...data.agenda.items, { title: 'New Item', description: '' }])} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-tighter">+ Add Step</button>
              </div>
              <div className="space-y-4">
                {data.agenda.items.map((item, i) => (
                  <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-4">
                    <div className="flex-1 grid gap-4">
                      <Input aria-label={`Agenda item ${i+1} title`} value={item.title} onChange={(v: string) => { const next = [...data.agenda.items]; next[i].title = v; updateField('agenda.items', next); }} />
                      <Input aria-label={`Agenda item ${i+1} description`} value={item.description} onChange={(v: string) => { const next = [...data.agenda.items]; next[i].description = v; updateField('agenda.items', next); }} placeholder="Description" />
                    </div>
                    <button 
                      onClick={() => updateField('agenda.items', data.agenda.items.filter((_, idx) => idx !== i))} 
                      className="text-red-500 font-black text-xl px-2"
                      aria-label={`Remove agenda item ${i + 1}`}
                      title="Remove Item"
                    >&times;</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BACKGROUND */}
          {activeSection === 'background' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Background Info</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="bg-heading" tooltip="Main title for the historical context section.">Heading</Label><Input id="bg-heading" value={data.background.heading} onChange={(v: string) => updateField('background.heading', v)} /></div>
                <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                  <Label htmlFor="bg-paragraphs" tooltip="Long-form narrative about the project's origins. Use double line breaks.">Main Paragraphs (One per line)</Label>
                  <TextArea id="bg-paragraphs" rows={6} value={data.background.paragraphs.join('\n\n')} onChange={(v: string) => updateField('background.paragraphs', v.split('\n\n').filter(p => p.trim()))} />
                </div>
                <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                  <Label htmlFor="bg-points" tooltip="Bullet-style highlights for quick scanning.">Key Points (Comma separated)</Label>
                  <Input id="bg-points" value={data.background.keyPoints.join(', ')} onChange={(v: string) => updateField('background.keyPoints', v.split(',').map(s => s.trim()))} />
                </div>
                <div>
                  <Label tooltip="Chronological project developments or prior attempts.">Background Milestones</Label>
                  <div className="space-y-4">
                    {data.background.milestones.map((m, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <Input aria-label={`Milestone ${i+1} year`} value={m.year} onChange={(v: string) => { const n = [...data.background.milestones]; n[i].year = v; updateField('background.milestones', n); }} placeholder="Year" />
                        <Input aria-label={`Milestone ${i+1} month`} value={m.month} onChange={(v: string) => { const n = [...data.background.milestones]; n[i].month = v; updateField('background.milestones', n); }} placeholder="Month" />
                        <div className="col-span-2 flex gap-2">
                          <Input aria-label={`Milestone ${i+1} event`} value={m.event} onChange={(v: string) => { const n = [...data.background.milestones]; n[i].event = v; updateField('background.milestones', n); }} placeholder="Event" />
                          <button onClick={() => updateField('background.milestones', data.background.milestones.filter((_, idx) => idx !== i))} className="text-red-500" aria-label={`Remove milestone ${i+1}`}>&times;</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateField('background.milestones', [...data.background.milestones, { year: '', month: '', event: '' }])} className="w-full border-2 border-dashed border-slate-700 py-3 rounded-xl text-slate-500 font-black text-xs uppercase">+ Add Milestone</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LETTERS */}
          {activeSection === 'letters' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Support Letters</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="letters-heading" tooltip="Title for the letters of support section.">Section Heading</Label><Input id="letters-heading" value={data.letters.heading} onChange={(v: string) => updateField('letters.heading', v)} /></div>
                <div><Label htmlFor="letters-desc" tooltip="Introductory text describing the community backing.">Description</Label><TextArea id="letters-desc" value={data.letters.description} onChange={(v: string) => updateField('letters.description', v)} /></div>
                <div className="grid gap-6">
                  {data.letters.items.map((letter, i) => (
                    <div key={i} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4 relative">
                      <button onClick={() => updateField('letters.items', data.letters.items.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-500 font-black text-xl" aria-label={`Remove letter ${i+1}`}>&times;</button>
                      <div><Label htmlFor={`letter-title-${i}`} tooltip="The author or name of the letter of support.">Letter Title</Label><Input id={`letter-title-${i}`} value={letter.title} onChange={(v: string) => { const n = [...data.letters.items]; n[i].title = v; updateField('letters.items', n); }} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor={`letter-img-${i}`} tooltip="The file path to the scanned letter image.">Document Image Path</Label><Input id={`letter-img-${i}`} value={letter.image} onChange={(v: string) => { const n = [...data.letters.items]; n[i].image = v; updateField('letters.items', n); }} /></div>
                        <div><Label htmlFor={`letter-exc-${i}`} tooltip="A short, powerful quote from the letter.">Preview Excerpt</Label><TextArea id={`letter-exc-${i}`} value={letter.excerpt} onChange={(v: string) => { const n = [...data.letters.items]; n[i].excerpt = v; updateField('letters.items', n); }} /></div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateField('letters.items', [...data.letters.items, { title: 'New Letter', image: '', excerpt: '' }])} className="w-full border-2 border-dashed border-slate-700 py-6 rounded-3xl text-slate-500 font-black text-xs uppercase hover:border-yellow-500 transition-all">+ Add Official Letter</button>
                </div>
              </div>
            </div>
          )}

          {/* SUBMARINE FACTS */}
          {activeSection === 'submarineFacts' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Submarine Facts</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="facts-heading" tooltip="Title for the technical specifications section.">Section Heading</Label><Input id="facts-heading" value={data.submarineFacts.heading} onChange={(v: string) => updateField('submarineFacts.heading', v)} /></div>
                <div><Label htmlFor="facts-img" tooltip="Main illustrative image for the submarine specs.">Hero Fact Image Path</Label><Input id="facts-img" value={data.submarineFacts.image} onChange={(v: string) => updateField('submarineFacts.image', v)} /></div>
                <div className="grid grid-cols-3 gap-4">
                  {data.submarineFacts.facts.map((fact, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 relative">
                      <button onClick={() => updateField('submarineFacts.facts', data.submarineFacts.facts.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full text-white text-[10px]" aria-label={`Remove fact ${i+1}`}>&times;</button>
                      <Input aria-label={`Fact ${i+1} label`} value={fact.label} onChange={(v: string) => { const n = [...data.submarineFacts.facts]; n[i].label = v; updateField('submarineFacts.facts', n); }} placeholder="Label" />
                      <Input aria-label={`Fact ${i+1} value`} value={fact.value} onChange={(v: string) => { const n = [...data.submarineFacts.facts]; n[i].value = v; updateField('submarineFacts.facts', n); }} placeholder="Value" />
                    </div>
                  ))}
                  <button onClick={() => updateField('submarineFacts.facts', [...data.submarineFacts.facts, { label: '', value: '' }])} className="border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-black text-[10px] uppercase">+ Add Fact</button>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE */}
          {activeSection === 'timeline' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Ship History</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="flex justify-end">
                <button onClick={() => updateField('timeline.milestones', [...data.timeline.milestones, { date: '', title: '', details: '' }])} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-tighter">+ Add Milestone</button>
              </div>
              <div className="space-y-4">
                {data.timeline.milestones.map((m, i) => (
                  <div key={i} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex gap-6 items-start">
                    <div className="w-32"><Label htmlFor={`timeline-date-${i}`} tooltip="The specific year or date for this event.">Date</Label><Input id={`timeline-date-${i}`} value={m.date} onChange={(v: string) => { const n = [...data.timeline.milestones]; n[i].date = v; updateField('timeline.milestones', n); }} /></div>
                    <div className="flex-1 space-y-4">
                      <div><Label htmlFor={`timeline-title-${i}`} tooltip="Short name for the historical milestone.">Title</Label><Input id={`timeline-title-${i}`} value={m.title} onChange={(v: string) => { const n = [...data.timeline.milestones]; n[i].title = v; updateField('timeline.milestones', n); }} /></div>
                      <div><Label htmlFor={`timeline-details-${i}`} tooltip="Detailed explanation of what happened at this point in the ship's life.">Details</Label><TextArea id={`timeline-details-${i}`} rows={2} value={m.details} onChange={(v: string) => { const n = [...data.timeline.milestones]; n[i].details = v; updateField('timeline.milestones', n); }} /></div>
                    </div>
                    <button onClick={() => updateField('timeline.milestones', data.timeline.milestones.filter((_, idx) => idx !== i))} className="text-red-500 pt-8" aria-label={`Remove history milestone ${i+1}`}>&times;</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASES */}
          {activeSection === 'phases' && (
            <section className="space-y-12">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Project Phases</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              {data.phases.phaseList.map((phase, idx) => (
                <div key={idx} className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 space-y-6">
                  <h4 className="text-xl font-black text-yellow-500 italic uppercase tracking-tight">Phase {phase.number}: {phase.title}</h4>
                  <div className="grid gap-6">
                    <div><Label htmlFor={`phase-title-${idx}`} tooltip="The official name for this project phase.">Phase Title</Label><Input id={`phase-title-${idx}`} value={phase.title} onChange={(v: string) => { const nl = [...data.phases.phaseList]; nl[idx].title = v; updateField('phases.phaseList', nl); }} /></div>
                    <div><Label htmlFor={`phase-desc-${idx}`} tooltip="What will be accomplished during this phase.">Description</Label><Input id={`phase-desc-${idx}`} value={phase.description} onChange={(v: string) => { const nl = [...data.phases.phaseList]; nl[idx].description = v; updateField('phases.phaseList', nl); }} /></div>
                    <div className="grid grid-cols-3 gap-6">
                      <div><Label htmlFor={`phase-status-${idx}`} tooltip="Current status (e.g., In Progress, Upcoming, Completed).">Status</Label><Input id={`phase-status-${idx}`} value={phase.status} onChange={(v: string) => { const nl = [...data.phases.phaseList]; nl[idx].status = v; updateField('phases.phaseList', nl); }} /></div>
                      <div><Label htmlFor={`phase-cost-${idx}`} tooltip="The estimated financial requirement for this phase.">Est. Cost</Label><Input id={`phase-cost-${idx}`} value={phase.cost} onChange={(v: string) => { const nl = [...data.phases.phaseList]; nl[idx].cost = v; updateField('phases.phaseList', nl); }} /></div>
                      <div>
                        <Label htmlFor={`phase-pct-${idx}`} tooltip="Numeric completion percentage (0-100).">% Complete</Label>
                        <Input 
                          id={`phase-pct-${idx}`}
                          type="number" 
                          value={phase.percentComplete || ''} 
                          onChange={(v: string) => { 
                            const nl = [...data.phases.phaseList]; 
                            const parsed = parseInt(v, 10);
                            nl[idx].percentComplete = isNaN(parsed) ? 0 : parsed;
                            updateField('phases.phaseList', nl); 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* BUDGET */}
          {activeSection === 'budget' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Budget & Remaining Need</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="budget-heading" tooltip="The title for the financial overview section.">Section Heading</Label><Input id="budget-heading" value={data.budget.heading} onChange={(v: string) => updateField('budget.heading', v)} /></div>
                <div><Label htmlFor="budget-total" tooltip="The remaining dollar amount needed to reach the goal.">Total Remaining Cost (Text)</Label><Input id="budget-total" value={data.budget.totalRemaining} onChange={(v: string) => updateField('budget.totalRemaining', v)} /></div>
                <div><Label htmlFor="budget-note" tooltip="Additional context regarding the budget or fundraising needs.">Bottom Note</Label><TextArea id="budget-note" rows={4} value={data.budget.note} onChange={(v: string) => updateField('budget.note', v)} /></div>
              </div>
            </div>
          )}

          {/* LOCATION SHIFT */}
          {activeSection === 'locationShift' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Site Selection Story</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="grid gap-10">
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
                  <h4 className="text-xl font-bold text-yellow-500 uppercase italic underline underline-offset-8 decoration-yellow-500/30">Original Concept (Freedom Park)</h4>
                  <div><Label htmlFor="loc-heading" tooltip="Title for the original proposed location.">Freedom Park Heading</Label><Input id="loc-heading" value={data.locationShift.heading} onChange={(v: string) => updateField('locationShift.heading', v)} /></div>
                  <div><Label htmlFor="loc-sub" tooltip="Why Freedom Park was initially chosen and why it failed.">Subtitle Explanation</Label><TextArea id="loc-sub" value={data.locationShift.subtitle} onChange={(v: string) => updateField('locationShift.subtitle', v)} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="loc-flood" tooltip="Image showing flood risk or issues at Freedom Park.">Flood Image Path</Label><Input id="loc-flood" value={data.locationShift.floodImage} onChange={(v: string) => updateField('locationShift.floodImage', v)} /></div>
                    <div><Label htmlFor="loc-flood-cap" tooltip="Descriptive text for the flood image.">Flood Image Caption</Label><Input id="loc-flood-cap" value={data.locationShift.floodCaption} onChange={(v: string) => updateField('locationShift.floodCaption', v)} /></div>
                  </div>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
                  <h4 className="text-xl font-bold text-yellow-500 uppercase italic underline underline-offset-8 decoration-yellow-500/30">New Location (Levi Carter Site)</h4>
                  <div><Label htmlFor="loc-new-heading" tooltip="Title for the new, superior location.">Site Heading</Label><Input id="loc-new-heading" value={data.locationShift.newLocationHeading} onChange={(v: string) => updateField('locationShift.newLocationHeading', v)} /></div>
                  <div><Label htmlFor="loc-new-body" tooltip="Detailed benefits of the Levi Carter Park site.">Description Body</Label><TextArea id="loc-new-body" rows={4} value={data.locationShift.newLocationBody} onChange={(v: string) => updateField('locationShift.newLocationBody', v)} /></div>
                  <div><Label htmlFor="loc-map" tooltip="Aerial view or map of the new site location.">Map Image Path</Label><Input id="loc-map" value={data.locationShift.mapImage} onChange={(v: string) => updateField('locationShift.mapImage', v)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* SITE PLAN */}
          {activeSection === 'sitePlan' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Site Plan</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="plan-heading" tooltip="The title for the architectural site plan section.">Section Heading</Label><Input id="plan-heading" value={data.sitePlan.heading} onChange={(v: string) => updateField('sitePlan.heading', v)} /></div>
                <div><Label htmlFor="plan-desc" tooltip="High-level overview of the memorial's physical layout.">Main Description</Label><TextArea id="plan-desc" value={data.sitePlan.description} onChange={(v: string) => updateField('sitePlan.description', v)} /></div>
                <div><Label htmlFor="plan-detail" tooltip="Technical or specific details about the construction and landscaping.">Detail Description</Label><TextArea id="plan-detail" value={data.sitePlan.detail} onChange={(v: string) => updateField('sitePlan.detail', v)} /></div>
                <div><Label htmlFor="plan-img" tooltip="File path to the architectural rendering or blueprint.">Plan Render Image Path</Label><Input id="plan-img" value={data.sitePlan.renderImage} onChange={(v: string) => updateField('sitePlan.renderImage', v)} /></div>
              </div>
            </div>
          )}

          {/* IMAGE GALLERY */}
          {activeSection === 'gallery' && (
            <section className="space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter">Image Gallery</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Main Site Assets</p>
                </div>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="flex justify-end">
                <button onClick={() => updateField('gallery.images', [...data.gallery.images, { src: '/images/placeholder.jpg', caption: 'New Image' }])} className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase italic tracking-tighter hover:bg-white transition-all">+ Add Item</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.gallery.images.map((img, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 space-y-4">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                      <img src={img.src} alt={img.caption} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={() => { const nl = data.gallery.images.filter((_, i) => i !== idx); updateField('gallery.images', nl); }} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur-sm transition-all" aria-label={`Remove gallery image ${idx+1}`}>&times;</button>
                      </div>
                    </div>
                    <div><Label htmlFor={`gal-path-${idx}`} tooltip="File path to the gallery image.">Image Path</Label><Input id={`gal-path-${idx}`} value={img.src} onChange={(v: string) => { const nl = [...data.gallery.images]; nl[idx].src = v; updateField('gallery.images', nl); }} /></div>
                    <div><Label htmlFor={`gal-cap-${idx}`} tooltip="Caption text displayed under the image.">Caption</Label><Input id={`gal-cap-${idx}`} value={img.caption} onChange={(v: string) => { const nl = [...data.gallery.images]; nl[idx].caption = v; updateField('gallery.images', nl); }} /></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXECUTION PHOTOS */}
          {activeSection === 'executionPhotos' && (
            <section className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Execution Photos</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="flex justify-end">
                <button onClick={() => updateField('executionPhotos.photos', [...data.executionPhotos.photos, { src: '/images/placeholder.jpg', caption: 'New Photo', year: '2026' }])} className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase italic tracking-tighter hover:bg-white transition-all">+ Add Photo</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.executionPhotos.photos.map((img, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 space-y-4">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                      <img src={img.src} alt={img.caption} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <button onClick={() => { const nl = data.executionPhotos.photos.filter((_, i) => i !== idx); updateField('executionPhotos.photos', nl); }} className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-lg" aria-label={`Remove execution photo ${idx+1}`}>&times;</button>
                    </div>
                    <div><Label htmlFor={`exe-path-${idx}`} tooltip="File path to the on-site photo.">Path</Label><Input id={`exe-path-${idx}`} value={img.src} onChange={(v: string) => { const nl = [...data.executionPhotos.photos]; nl[idx].src = v; updateField('executionPhotos.photos', nl); }} /></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2"><Label htmlFor={`exe-cap-${idx}`} tooltip="Short description of the photo content.">Caption</Label><Input id={`exe-cap-${idx}`} value={img.caption} onChange={(v: string) => { const nl = [...data.executionPhotos.photos]; nl[idx].caption = v; updateField('executionPhotos.photos', nl); }} /></div>
                      <div><Label htmlFor={`exe-year-${idx}`} tooltip="The year the photo was taken.">Year</Label><Input id={`exe-year-${idx}`} value={img.year} onChange={(v: string) => { const nl = [...data.executionPhotos.photos]; nl[idx].year = v; updateField('executionPhotos.photos', nl); }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* NAVY 250 */}
          {activeSection === 'navy250' && (
            <div className="space-y-10">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">Navy 250 Assets</h3>
              <div className="space-y-6 bg-slate-800 p-8 rounded-3xl border border-slate-700">
                <div><Label htmlFor="navy-logo">Official Logo Path</Label><Input id="navy-logo" value={data.navy250.logo} onChange={(v: string) => updateField('navy250.logo', v)} /></div>
                <div><Label htmlFor="navy-heading">Main Heading</Label><TextArea id="navy-heading" value={data.navy250.heading} onChange={(v: string) => updateField('navy250.heading', v)} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label htmlFor="navy-deadline">Deadline (ISO String)</Label><Input id="navy-deadline" value={data.navy250.deadline} onChange={(v: string) => updateField('navy250.deadline', v)} /></div>
                  <div><Label htmlFor="navy-label">Countdown Label</Label><Input id="navy-label" value={data.navy250.deadlineLabel} onChange={(v: string) => updateField('navy250.deadlineLabel', v)} /></div>
                </div>
                <div><Label htmlFor="navy-subtext">Countdown Subtext</Label><Input id="navy-subtext" value={data.navy250.deadlineText} onChange={(v: string) => updateField('navy250.deadlineText', v)} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label htmlFor="navy-subheading">Subheading (Vessel Name)</Label><Input id="navy-subheading" value={data.navy250.subheading} onChange={(v: string) => updateField('navy250.subheading', v)} /></div>
                  <div><Label htmlFor="navy-subtitle">Subtitle (Vessel Dates)</Label><Input id="navy-subtitle" value={data.navy250.subtitle} onChange={(v: string) => updateField('navy250.subtitle', v)} /></div>
                </div>
                <div>
                  <Label htmlFor="navy-images">Asset Images (Comma separated)</Label>
                  <Input id="navy-images" value={data.navy250.images.join(', ')} onChange={(v: string) => updateField('navy250.images', v.split(',').map(s => s.trim()))} />
                </div>
              </div>
            </div>
          )}

          {/* FUNDRAISING */}
          {activeSection === 'fundraising' && (
            <section className="space-y-10">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">Fundraising Progress</h3>
              <div className="grid grid-cols-2 gap-10">
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700">
                  <Label htmlFor="fund-goal">Current Goal ($)</Label>
                  <Input 
                    id="fund-goal"
                    type="number" 
                    value={data.fundraisingProgress.goal || ''} 
                    onChange={(v: string) => {
                      const parsed = parseInt(v, 10);
                      updateField('fundraisingProgress.goal', isNaN(parsed) ? 0 : parsed);
                    }} 
                  />
                </div>
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700">
                  <Label htmlFor="fund-raised">Amount Raised ($)</Label>
                  <Input 
                    id="fund-raised"
                    type="number" 
                    value={data.fundraisingProgress.raised || ''} 
                    onChange={(v: string) => {
                      const parsed = parseInt(v, 10);
                      updateField('fundraisingProgress.raised', isNaN(parsed) ? 0 : parsed);
                    }} 
                  />
                </div>
                <div>
                  <Label htmlFor="fund-donors">Donor Count</Label>
                  <Input 
                    id="fund-donors"
                    type="number" 
                    value={data.fundraisingProgress.donorCount || ''} 
                    onChange={(v: string) => {
                      const parsed = parseInt(v, 10);
                      updateField('fundraisingProgress.donorCount', isNaN(parsed) ? 0 : parsed);
                    }} 
                  />
                </div>
                <div>
                  <Label htmlFor="fund-time">Last Gift Timestamp</Label>
                  <Input id="fund-time" value={data.fundraisingProgress.lastGiftTime} onChange={(v: string) => updateField('fundraisingProgress.lastGiftTime', v)} />
                </div>
              </div>
            </section>
          )}

          {/* WHY NOW */}
          {activeSection === 'whyNow' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Why Now?</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="why-heading" tooltip="The title for the urgency/context section.">Section Heading</Label><Input id="why-heading" value={data.whyNow.heading} onChange={(v: string) => updateField('whyNow.heading', v)} /></div>
                <div><Label htmlFor="why-tagline" tooltip="A final summary statement about project urgency.">Tagline Footer</Label><Input id="why-tagline" value={data.whyNow.tagline} onChange={(v: string) => updateField('whyNow.tagline', v)} /></div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4">
                  <Label tooltip="The estimated cost for this specific memorial project.">Memorial Project Pricing</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input aria-label="Memorial project name" value={data.whyNow.memorial.name} onChange={(v: string) => updateField('whyNow.memorial.name', v)} />
                    <Input aria-label="Memorial project cost" value={data.whyNow.memorial.cost} onChange={(v: string) => updateField('whyNow.memorial.cost', v)} />
                  </div>
                </div>
                <div>
                  <Label tooltip="Comparative costs of other major city projects for market context.">Other City Projects (Market Context)</Label>
                  <div className="space-y-4">
                    {data.whyNow.projects.map((p, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="col-span-2"><Input aria-label={`Project ${i+1} name`} value={p.name} onChange={(v: string) => { const n = [...data.whyNow.projects]; n[i].name = v; updateField('whyNow.projects', n); }} /></div>
                        <div className="flex gap-2">
                          <Input aria-label={`Project ${i+1} cost`} value={p.cost} onChange={(v: string) => { const n = [...data.whyNow.projects]; n[i].cost = v; updateField('whyNow.projects', n); }} />
                          <button onClick={() => updateField('whyNow.projects', data.whyNow.projects.filter((_, idx) => idx !== i))} className="text-red-500" aria-label={`Remove project ${i+1}`}>&times;</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateField('whyNow.projects', [...data.whyNow.projects, { name: '', cost: '' }])} className="w-full border-2 border-dashed border-slate-700 py-3 rounded-xl text-slate-500 font-black text-xs uppercase">+ Add City Project</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALL TO ACTION */}
          {activeSection === 'callToAction' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Calls to Action</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              {(['memorial', 'donor'] as const).map((mode) => {
                const modeData = data.callToAction[mode];
                return (
                  <div key={mode} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
                    <h4 className="text-xl font-bold text-yellow-500 uppercase italic underline underline-offset-8 decoration-yellow-500/30">{mode.toUpperCase()} MODE SETTINGS</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div><Label htmlFor={`cta-heading-${mode}`} tooltip="Main heading for the donation call to action.">Heading</Label><Input id={`cta-heading-${mode}`} value={modeData.heading} onChange={(v: string) => updateField(`callToAction.${mode}.heading`, v)} /></div>
                      <div><Label htmlFor={`cta-tagline-${mode}`} tooltip="Supporting text under the heading.">Tagline</Label><Input id={`cta-tagline-${mode}`} value={modeData.tagline} onChange={(v: string) => updateField(`callToAction.${mode}.tagline`, v)} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><Label htmlFor={`cta-form-text-${mode}`} tooltip="Text displayed on the download button.">Pledge Form Text</Label><Input id={`cta-form-text-${mode}`} value={modeData.pledgeFormText} onChange={(v: string) => updateField(`callToAction.${mode}.pledgeFormText`, v)} /></div>
                      <div><Label htmlFor={`cta-form-url-${mode}`} tooltip="Link to the pledge form document.">Pledge Form URL</Label><Input id={`cta-form-url-${mode}`} value={modeData.pledgeFormUrl} onChange={(v: string) => updateField(`callToAction.${mode}.pledgeFormUrl`, v)} /></div>
                    </div>
                    <div><Label htmlFor={`cta-tax-${mode}`} tooltip="Disclaimer about tax-deductible status.">Tax Note</Label><Input id={`cta-tax-${mode}`} value={modeData.taxNote} onChange={(v: string) => updateField(`callToAction.${mode}.taxNote`, v)} /></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VOLUNTEER */}
          {activeSection === 'volunteer' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Volunteer Info</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
                <div><Label htmlFor="vol-heading" tooltip="Main title for the volunteer recruitment section.">Main Heading</Label><Input id="vol-heading" value={data.volunteer.heading} onChange={(v: string) => updateField('volunteer.heading', v)} /></div>
                <div><Label htmlFor="vol-sub" tooltip="Supporting call to action for volunteers.">Subheading</Label><Input id="vol-sub" value={data.volunteer.subheading} onChange={(v: string) => updateField('volunteer.subheading', v)} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label htmlFor="vol-name" tooltip="Primary person to contact for volunteering.">Contact Name</Label><Input id="vol-name" value={data.volunteer.contact?.name || ''} onChange={(v: string) => updateField('volunteer.contact.name', v)} /></div>
                  <div><Label htmlFor="vol-phone" tooltip="Phone number for volunteer inquiries.">Contact Phone</Label><Input id="vol-phone" value={data.volunteer.contact?.phone || ''} onChange={(v: string) => updateField('volunteer.contact.phone', v)} /></div>
                  <div><Label htmlFor="vol-email" tooltip="Email address for volunteer inquiries.">Contact Email</Label><Input id="vol-email" value={data.volunteer.contact?.email || ''} onChange={(v: string) => updateField('volunteer.contact.email', v)} /></div>
                </div>
                <div><Label htmlFor="vol-org" tooltip="The name of the partner organization managing volunteers.">Organization Name</Label><Input id="vol-org" value={data.volunteer.organization || ''} onChange={(v: string) => updateField('volunteer.organization', v)} /></div>
                <div><Label htmlFor="vol-org-contact" tooltip="How to get in touch with the volunteer organization directly.">Organization Contact Details</Label><Input id="vol-org-contact" value={data.volunteer.organizationContact || ''} onChange={(v: string) => updateField('volunteer.organizationContact', v)} /></div>
                <div><Label htmlFor="vol-opps" tooltip="List of specific roles or tasks available for volunteers.">Opportunities (Comma separated)</Label><TextArea id="vol-opps" value={data.volunteer.opportunities?.join(', ') || ''} onChange={(v: string) => updateField('volunteer.opportunities', v.split(',').map(s => s.trim()))} /></div>
              </div>
            </div>
          )}

          {/* STAKEHOLDERS */}
          {activeSection === 'stakeholders' && (
            <section className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Action Committee</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="flex justify-end">
                <button onClick={() => updateField('stakeholders.members', [...data.stakeholders.members, { name: 'New Member', title: 'Member Title', subtitle: '' }])} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-tighter">+ Add Member</button>
              </div>
              <div className="grid gap-4">
                {data.stakeholders.members.map((member, idx) => (
                  <div key={idx} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex gap-4 items-start relative group">
                    <button onClick={() => updateField('stakeholders.members', data.stakeholders.members.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove member ${idx+1}`}>&times;</button>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div><Label htmlFor={`stake-name-${idx}`} tooltip="The full name of the committee member.">Name</Label><Input id={`stake-name-${idx}`} value={member.name} onChange={(v: string) => { const n = [...data.stakeholders.members]; n[idx].name = v; updateField('stakeholders.members', n); }} /></div>
                      <div><Label htmlFor={`stake-title-${idx}`} tooltip="The member's primary professional title or role.">Title</Label><Input id={`stake-title-${idx}`} value={member.title} onChange={(v: string) => { const n = [...data.stakeholders.members]; n[idx].title = v; updateField('stakeholders.members', n); }} /></div>
                      <div><Label htmlFor={`stake-sub-${idx}`} tooltip="Additional organization or context for this member.">Subtitle (Optional)</Label><Input id={`stake-sub-${idx}`} value={member.subtitle || ''} onChange={(v: string) => { const n = [...data.stakeholders.members]; n[idx].subtitle = v; updateField('stakeholders.members', n); }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PRESENTED BY */}
          {activeSection === 'presentedBy' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Presenters</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="space-y-6">
                <div><Label htmlFor="pres-heading" tooltip="The title for the presenter introduction section.">Section Heading</Label><Input id="pres-heading" value={data.presentedBy.heading} onChange={(v: string) => updateField('presentedBy.heading', v)} /></div>
                <div className="space-y-4">
                  {data.presentedBy.presenters.map((p, i) => (
                    <div key={i} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 grid grid-cols-3 gap-4 relative group">
                      <button onClick={() => updateField('presentedBy.presenters', data.presentedBy.presenters.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100" aria-label={`Remove presenter ${i+1}`}>&times;</button>
                      <div><Label htmlFor={`pres-name-${i}`} tooltip="Full name of the presenter.">Presenter Name</Label><Input id={`pres-name-${i}`} value={p.name} onChange={(v: string) => { const n = [...data.presentedBy.presenters]; n[i].name = v; updateField('presentedBy.presenters', n); }} /></div>
                      <div><Label htmlFor={`pres-org-${i}`} tooltip="The organization the presenter represents.">Organization</Label><Input id={`pres-org-${i}`} value={p.org} onChange={(v: string) => { const n = [...data.presentedBy.presenters]; n[i].org = v; updateField('presentedBy.presenters', n); }} /></div>
                      <div><Label htmlFor={`pres-title-${i}`} tooltip="The presenter's official title.">Title</Label><Input id={`pres-title-${i}`} value={p.title} onChange={(v: string) => { const n = [...data.presentedBy.presenters]; n[i].title = v; updateField('presentedBy.presenters', n); }} /></div>
                    </div>
                  ))}
                  <button onClick={() => updateField('presentedBy.presenters', [...data.presentedBy.presenters, { name: '', org: '', title: '' }])} className="w-full border-2 border-dashed border-slate-700 py-3 rounded-xl text-slate-500 font-black text-xs uppercase">+ Add Presenter</button>
                </div>
              </div>
            </div>
          )}

          {/* CLOSE */}
          {activeSection === 'close' && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Closing Screen</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
                <div><Label htmlFor="close-heading" tooltip="The main headline for the final screen.">Main Heading</Label><Input id="close-heading" value={data.close.heading} onChange={(v: string) => updateField('close.heading', v)} /></div>
                <div><Label htmlFor="close-sub" tooltip="A brief wrap-up message.">Subheading</Label><Input id="close-sub" value={data.close.subheading} onChange={(v: string) => updateField('close.subheading', v)} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label htmlFor="close-org" tooltip="The organization name for contact.">Contact Org</Label><Input id="close-org" value={data.close.contactInfo.organization} onChange={(v: string) => updateField('close.contactInfo.organization', v)} /></div>
                  <div><Label htmlFor="close-web" tooltip="The official project URL.">Website</Label><Input id="close-web" value={data.close.contactInfo.website} onChange={(v: string) => updateField('close.contactInfo.website', v)} /></div>
                  <div><Label htmlFor="close-contact" tooltip="The main person to talk to.">Lead Contact</Label><Input id="close-contact" value={data.close.contactInfo.contact} onChange={(v: string) => updateField('close.contactInfo.contact', v)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER & LINKS */}
          {activeSection === 'footer' && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Footer & Links</h3>
                <HelpButton onClick={() => setIsHelpOpen(true)} />
              </div>
              <div className="grid gap-10">
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                  <Label htmlFor="footer-addr" tooltip="Full mailing address. Use a new line for each part.">Mailing Address (One part per line)</Label>
                  <TextArea id="footer-addr" rows={4} value={data.footer.address.join('\n')} onChange={(v: string) => updateField('footer.address', v.split('\n'))} />
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 grid grid-cols-3 gap-4">
                  <div><Label htmlFor="footer-name" tooltip="Name of the footer contact.">Contact Name</Label><Input id="footer-name" value={data.footer.contact.name} onChange={(v: string) => updateField('footer.contact.name', v)} /></div>
                  <div><Label htmlFor="footer-email" tooltip="The primary support email.">Email</Label><Input id="footer-email" value={data.footer.contact.email} onChange={(v: string) => updateField('footer.contact.email', v)} /></div>
                  <div><Label htmlFor="footer-phone" tooltip="The official contact number.">Phone</Label><Input id="footer-phone" value={data.footer.contact.phone} onChange={(v: string) => updateField('footer.contact.phone', v)} /></div>
                </div>
                <div>
                  <Label>Quick Links</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {data.footer.quickLinks.map((link, i) => (
                      <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-2">
                        <Input aria-label={`Link ${i+1} label`} value={link.label} onChange={(v: string) => { const n = [...data.footer.quickLinks]; n[i].label = v; updateField('footer.quickLinks', n); }} placeholder="Label" />
                        <Input aria-label={`Link ${i+1} URL`} value={link.href} onChange={(v: string) => { const n = [...data.footer.quickLinks]; n[i].href = v; updateField('footer.quickLinks', n); }} placeholder="URL" />
                        <button onClick={() => updateField('footer.quickLinks', data.footer.quickLinks.filter((_, idx) => idx !== i))} className="text-red-500 font-black" aria-label={`Remove link ${i+1}`}>&times;</button>
                      </div>
                    ))}
                    <button onClick={() => updateField('footer.quickLinks', [...data.footer.quickLinks, { label: '', href: '' }])} className="border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-black text-xs uppercase">+ Add Link</button>
                  </div>
                </div>
                <div>
                  <Label>Partner Logos</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {data.footer.logos.map((logo, i) => (
                      <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 relative group">
                        <button onClick={() => updateField('footer.logos', data.footer.logos.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove logo ${i+1}`}>&times;</button>
                        <Input aria-label={`Logo ${i+1} path`} value={logo.src} onChange={(v: string) => { const n = [...data.footer.logos]; n[i].src = v; updateField('footer.logos', n); }} placeholder="Image Path" />
                        <Input aria-label={`Logo ${i+1} alt text`} value={logo.alt} onChange={(v: string) => { const n = [...data.footer.logos]; n[i].alt = v; updateField('footer.logos', n); }} placeholder="Alt Text" />
                      </div>
                    ))}
                    <button onClick={() => updateField('footer.logos', [...data.footer.logos, { src: '', alt: '' }])} className="border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-black text-xs uppercase">+ Add Logo</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-20 pt-10 border-t border-slate-800 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">
             End of Command Protocol • Transmission Secure
          </div>
        </div>
      </main>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        initialSection={activeSection}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  )
}
