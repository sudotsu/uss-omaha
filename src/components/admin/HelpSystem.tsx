'use client'

import React, { useState, useEffect, useRef } from 'react'

// --- TOOLTIP COMPONENT ---

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider rounded border border-yellow-500/50 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-200 pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950" />
        </div>
      )}
    </div>
  )
}

// --- HELP MODAL COMPONENT ---

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: string
}

export const HelpModal = ({ isOpen, onClose, initialSection }: HelpModalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && initialSection && scrollContainerRef.current) {
      const element = document.getElementById(`help-section-${initialSection}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [isOpen, initialSection])

  if (!isOpen) return null

  const helpContent = [
    {
      id: 'metadata',
      title: 'Site Identity',
      description: 'The "ID Badge" of your website. This section controls how the site appears to search engines and in browser tabs.',
      tips: [
        'Site Title: The primary name shown in the browser tab.',
        'Subtitle: A short catchy phrase that appears near the title.',
        'Mode: "Memorial" is for standard browsing. "Donor" focuses the site on fundraising goals.'
      ]
    },
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'This is the "Billboard" at the very top of your home page. It needs to be high-impact.',
      tips: [
        'Main Heading: Use strong, bold language to grab attention.',
        'Background Image Path: Ensure the image is uploaded to the /public/images folder first.'
      ]
    },
    {
      id: 'mission',
      title: 'Mission Statement',
      description: 'Explains exactly WHY this project exists and what you hope to achieve.',
      tips: [
        'Statement: Keep this clear and inspiring.',
        'Highlights: List 3-4 key points. Use commas to separate them in the editor.'
      ]
    },
    {
      id: 'agenda',
      title: 'Meeting Agenda',
      description: 'Used for event presentations to show the flow of a meeting or gala.',
      tips: [
        'Steps: You can add as many as needed. Drag-and-drop support is coming soon.',
        'Descriptions: Keep these short—just one sentence.'
      ]
    },
    {
      id: 'background',
      title: 'Historical Background',
      description: 'Where you tell the story of the USS Omaha and its legacy.',
      tips: [
        'Paragraphs: Double-space between paragraphs to start a new block of text.',
        'Milestones: Use these for a timeline of events.'
      ]
    },
    {
      id: 'godmode',
      title: '⚡ God Mode',
      description: 'For the bravest commanders. This is raw code control.',
      tips: [
        'Safety First: If the code turns red, there is a typo. The "Deploy" button will stay locked until it is fixed.',
        'Format: This uses YAML. Indentation (spaces) is extremely important.'
      ]
    }
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
            <h2 className="text-2xl font-black text-yellow-500 uppercase italic tracking-tighter">Command Manual</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Support & Glossary</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-red-600 transition-colors font-black text-xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12"
        >
          {helpContent.map((section) => (
            <div key={section.id} id={`help-section-${section.id}`} className="space-y-4 border-b border-slate-800 pb-12 last:border-0">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-black uppercase tracking-widest">Section</span>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{section.title}</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{section.description}</p>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Commander's Tips:</h4>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-400">
                      <span className="text-yellow-500 font-black">▶</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800 border-t border-slate-700 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">End of Manual • All Systems Operational</p>
        </div>
      </div>
    </div>
  )
}
