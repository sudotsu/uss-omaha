'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span role="tooltip" className="absolute bottom-full left-1/2 z-[120] mb-2 w-56 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-center text-xs font-medium normal-case tracking-normal text-slate-200 shadow-xl">
          {content}
        </span>
      )}
    </span>
  )
}

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: string
}

type HelpItem = {
  id: string
  title: string
  description: string
  tips: string[]
}

const HELP: HelpItem[] = [
  { id: 'metadata', title: 'Site Identity', description: 'Controls browser/search identity and the site identity shown in the footer.', tips: ['Title and subtitle now feed real page metadata.', 'Year is used by the visible footer copyright.', 'Mode switches between the memorial and donor donation copy.'] },
  { id: 'hero', title: 'Hero Section', description: 'Controls the homepage heading, subheading, and background image.', tips: ['Background Image is live content now, not a dead setting.', 'Use Upload image beside image fields instead of manually typing repository paths.'] },
  { id: 'mission', title: 'Mission', description: 'Controls the mission statement and supporting highlights.', tips: ['Use short highlights for scanability.', 'Long copy fields expand into text areas automatically.'] },
  { id: 'agenda', title: 'Meeting Agenda', description: 'Controls the section heading and agenda items.', tips: ['Add as many items as needed.', 'Remove is always visible and asks for confirmation.'] },
  { id: 'footer', title: 'Footer & Links', description: 'Controls address, contact details, quick links, and partner logos.', tips: ['Each partner logo has image, alt text, and an editable website link.', 'Image fields can upload a new file or reuse an existing media-library asset.'] },
  { id: 'background', title: 'Background Info', description: 'Controls the project background narrative, key points, and milestones.', tips: ['Milestones can be added or removed without touching raw YAML.', 'Repeated items use stable editor identities to avoid row mix-ups.'] },
  { id: 'timeline', title: 'Ship History', description: 'Controls USS Omaha timeline entries.', tips: ['Date is free text for historical labels such as “Mar 1978”.', 'Use details for the longer explanation.'] },
  { id: 'submarineFacts', title: 'Submarine Facts', description: 'Controls the fact list and supporting image.', tips: ['Fact rows are editable and reorder-safe during normal edits.', 'The image picker accepts repository media or uploads.'] },
  { id: 'letters', title: 'Support Letters', description: 'Controls official support-letter cards.', tips: ['Each letter has title, image, and excerpt.', 'Uploaded images are committed to public/images/uploads.'] },
  { id: 'phases', title: 'Project Phases', description: 'Controls project phases, status, cost, and completion percentage.', tips: ['Percent Complete is numeric.', 'Adding a phase creates all expected fields.'] },
  { id: 'whatYourGiftBuilds', title: 'What Your Gift Builds', description: 'Controls the full donor-targeting section that was previously hard-coded.', tips: ['Heading, subheading, phase label, cards, and promise copy are all editable.', 'The cards still feed the selected gift designation into Donation Info.'] },
  { id: 'budget', title: 'Budget & Need', description: 'Controls the remaining-need heading, amount, and note.', tips: ['Amounts remain formatted text so you can include currency symbols and wording.'] },
  { id: 'locationShift', title: 'Site Selection', description: 'Controls the Freedom Park / Levi Carter Park story and its images.', tips: ['Both images use the media uploader/library.', 'Map caption is a normal editable field.'] },
  { id: 'sitePlan', title: 'Site Plan', description: 'Controls the site-plan copy and render image.', tips: ['Use a high-resolution render for print output.'] },
  { id: 'gallery', title: 'Image Gallery', description: 'Controls gallery cards and captions.', tips: ['Add/remove images from the visual editor.', 'Upload and select images directly from each row.'] },
  { id: 'executionPhotos', title: 'Execution Photos', description: 'Controls construction/execution photos, captions, and years.', tips: ['Year is text so historical labels remain flexible.'] },
  { id: 'navy250', title: 'Countdown & Navy 250', description: 'Controls the homepage countdown and Navy anniversary content.', tips: ['The date picker is explicitly Omaha time and saves a fixed UTC timestamp.', 'A past deadline is flagged; hide or update it instead of silently wondering why it reads zero.', 'Logo, heading, vessel line, dates, and images are now actually rendered.'] },
  { id: 'fundraisingProgress', title: 'Fundraising Stats', description: 'Controls raised amount, goal, donor count, and last-gift copy.', tips: ['Raised, goal, and donor count are numeric fields.'] },
  { id: 'whyNow', title: 'Why Now?', description: 'Controls comparison projects, memorial cost, and tagline.', tips: ['Add or remove comparison projects as needed.'] },
  { id: 'callToAction', title: 'Donation Info', description: 'Controls both Memorial and Donor donation modes in full.', tips: ['Organization names, EINs, websites, emails, phone, mailing address, alternate organization, headings, tax note, and pledge link are all exposed.', 'No normal donation field requires God Mode anymore.'] },
  { id: 'volunteer', title: 'Volunteer Info', description: 'Controls volunteer headings, contact information, opportunities, and organization fields.', tips: ['Optional fields stay available even when blank.'] },
  { id: 'stakeholders', title: 'Action Committee', description: 'Controls committee members and titles.', tips: ['Remove buttons work on touch devices and require confirmation.'] },
  { id: 'presentedBy', title: 'Presenters', description: 'Controls presenter names, organizations, and titles.', tips: ['Add additional presenters without editing YAML.'] },
  { id: 'close', title: 'Closing Screen', description: 'Controls the closing question/contact block.', tips: ['Website accepts either a full https:// URL or a bare domain; the public link normalizes it safely.'] },
  { id: 'godmode', title: 'God Mode', description: 'Raw YAML editing for advanced changes.', tips: ['It uses the exact same shared schema as the visual editor and server publish action.', 'Invalid YAML or invalid structure blocks publishing.'] },
]

export function HelpModal({ isOpen, onClose, initialSection }: HelpModalProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => {
      if (initialSection) document.getElementById(`help-${initialSection}`)?.scrollIntoView({ block: 'start' })
    }, 0)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, initialSection, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Admin help guide" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 p-4 md:p-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Command Guide</h2>
            <p className="mt-1 text-sm text-slate-500">What each section controls and where the less-obvious tools live.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white" aria-label="Close help">Close</button>
        </header>

        <div ref={container} className="overflow-y-auto p-4 md:p-5">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><strong className="block text-sm text-white">Publish status</strong><span className="mt-1 block text-xs text-slate-500">Publishing → Building → Live / Failed is tracked from GitHub/Vercel checks.</span></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><strong className="block text-sm text-white">Revision history</strong><span className="mt-1 block text-xs text-slate-500">Restore older content as a new commit; Git history stays intact.</span></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><strong className="block text-sm text-white">Concurrent edits</strong><span className="mt-1 block text-xs text-slate-500">If someone publishes first, independent edits merge automatically instead of forcing a destructive refresh.</span></div>
          </div>

          <div className="divide-y divide-slate-800">
            {HELP.map((item) => (
              <section id={`help-${item.id}`} key={item.id} className="scroll-mt-4 py-4 first:pt-0">
                <h3 className="text-base font-semibold text-yellow-300">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.description}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-500">
                  {item.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
