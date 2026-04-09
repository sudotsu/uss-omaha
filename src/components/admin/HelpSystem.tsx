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
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider rounded border border-yellow-500/50 shadow-xl whitespace-normal min-w-[200px] text-center animate-in fade-in slide-in-from-bottom-1 duration-200 pointer-events-none">
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
      // Use a small timeout to ensure the DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`help-section-${initialSection}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [isOpen, initialSection])

  if (!isOpen) return null

  const helpContent = [
    {
      id: 'metadata',
      title: 'Site Identity',
      description: 'The "ID Badge" of your website. This section controls how the site appears to search engines and in browser tabs.',
      tips: [
        'Site Title: The primary name shown in the browser tab. Keep it professional.',
        'Subtitle: A short catchy phrase that appears near the title in search results.',
        'Mode: "Memorial" is for standard browsing. "Donor" focuses the site on fundraising goals, adding donation meters and urgent calls to action.'
      ]
    },
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'This is the "Billboard" at the very top of your home page. It needs to be high-impact.',
      tips: [
        'Main Heading: This is the first thing people read. Make it bold and meaningful.',
        'Subheading: Provide a bit more context about the mission here.',
        'Background Image Path: The background image should be high resolution. Usually, these are stored in /images/.'
      ]
    },
    {
      id: 'mission',
      title: 'Mission',
      description: 'The core purpose of the relaunch project. This defines the "Why".',
      tips: [
        'Heading: A short title for this section.',
        'Statement: Your long-form explanation of the project goals.',
        'Highlights: List 3-4 specific achievements or goals separated by commas.'
      ]
    },
    {
      id: 'agenda',
      title: 'Meeting Agenda',
      description: 'A structured list of events, typically used for formal presentations or gala events.',
      tips: [
        'Add Step: Use this to create a new line item in the schedule.',
        'Title vs Description: The Title should be the event name (e.g., "Opening Remarks"), and the Description adds a bit more detail.'
      ]
    },
    {
      id: 'footer',
      title: 'Footer & Links',
      description: 'The bottom of the page containing contact info, addresses, and partner logos.',
      tips: [
        'Mailing Address: Enter the address exactly as it should appear on an envelope.',
        'Partner Logos: Enter the image paths for sponsors. They will appear in a grid at the bottom.',
        'Quick Links: Use these for social media or external resources.'
      ]
    },
    {
      id: 'background',
      title: 'Background Info',
      description: 'Deep-dive historical context for the project.',
      tips: [
        'Paragraphs: To start a new paragraph, press Enter twice to leave a blank line.',
        'Key Points: High-level takeaways shown as a highlighted list.',
        'Milestones: Use this to track specific dates in the ship\'s or project\'s history.'
      ]
    },
    {
      id: 'timeline',
      title: 'Ship History',
      description: 'A chronological journey of the USS Omaha (SSN-692).',
      tips: [
        'Date: Can be a year (1984) or a specific day (August 4, 1984).',
        'Details: Provide a paragraph for each major milestone in the ship\'s service.'
      ]
    },
    {
      id: 'submarineFacts',
      title: 'Submarine Facts',
      description: 'Technical specifications and interesting trivia about the Los Angeles-class submarines.',
      tips: [
        'Label: The name of the stat (e.g., "Length").',
        'Value: The actual data (e.g., "362 feet").',
        'Image Path: A technical drawing or photo to accompany the stats.'
      ]
    },
    {
      id: 'letters',
      title: 'Support Letters',
      description: 'A collection of official endorsements from government or military officials.',
      tips: [
        'Letter Title: Who wrote the letter or what is it about?',
        'Excerpt: A short, powerful quote from the letter to show in the preview.',
        'Document Image: A scan of the actual signed document.'
      ]
    },
    {
      id: 'phases',
      title: 'Project Phases',
      description: 'Tracks the construction and relaunch progress.',
      tips: [
        'Status: e.g., "Planned", "In Progress", or "Completed".',
        'Percent Complete: Enter a number from 0 to 100 to fill the progress bar.',
        'Est. Cost: The budget allocated for this specific phase.'
      ]
    },
    {
      id: 'budget',
      title: 'Budget & Need',
      description: 'Financial transparency for the project.',
      tips: [
        'Total Remaining: The current dollar amount needed to reach the goal.',
        'Bottom Note: Any specific legal or clarifying text regarding the budget.'
      ]
    },
    {
      id: 'locationShift',
      title: 'Site Selection',
      description: 'Explains the decision to move the memorial from Freedom Park to the new location.',
      tips: [
        'Flood Image: Use this to show the vulnerability of the old site.',
        'New Location Body: Describe why the new site is the superior choice for the legacy.'
      ]
    },
    {
      id: 'sitePlan',
      title: 'Site Plan',
      description: 'Architectural details of the new memorial layout.',
      tips: [
        'Render Image: The primary 3D visualization or blueprint of the site.',
        'Detail: Deep technical explanation of the architectural features.'
      ]
    },
    {
      id: 'gallery',
      title: 'Image Gallery',
      description: 'A general collection of photos related to the project.',
      tips: [
        'Caption: Every image needs a short description for accessibility.',
        'Path: The /images/ path where the photo is stored.'
      ]
    },
    {
      id: 'executionPhotos',
      title: 'Execution Photos',
      description: 'A visual record of the physical work being done (transport, construction, etc).',
      tips: [
        'Year: Useful for tracking progress over time.',
        'Caption: Describe what is happening in the photo.'
      ]
    },
    {
      id: 'fundraising',
      title: 'Fundraising Stats',
      description: 'Real-time (or manually updated) donor data.',
      tips: [
        'Goal: The final target amount.',
        'Raised: The current total amount collected.',
        'Donor Count: How many individuals have contributed so far.'
      ]
    },
    {
      id: 'whyNow',
      title: 'Why Now?',
      description: 'The urgency of the project and how it fits into the current landscape.',
      tips: [
        'Projects: Other surrounding infrastructure projects that make this timing perfect.',
        'Tagline: A short "closing argument" for the necessity of the relaunch.'
      ]
    },
    {
      id: 'callToAction',
      title: 'Donation Info',
      description: 'How and where people can send their support.',
      tips: [
        'Memorial vs Donor: You can set different messages for the two site modes.',
        'Mailing Address: Where physical checks should be sent.',
        'Tax Note: Legal text regarding the 501(c)(3) status.'
      ]
    },
    {
      id: 'volunteer',
      title: 'Volunteer Info',
      description: 'Opportunities for people to give their time instead of their money.',
      tips: [
        'Opportunities: A list of specific tasks you need help with.',
        'Contact Info: Who the potential volunteer should reach out to.'
      ]
    },
    {
      id: 'stakeholders',
      title: 'Action Committee',
      description: 'Recognizing the people leading the charge.',
      tips: [
        'Members: Add the name and title for each committee member.',
        'Subtitle: Useful for adding their military rank or specific role.'
      ]
    },
    {
      id: 'presentedBy',
      title: 'Presenters',
      description: 'Credits for the individuals who put together the presentation or project.',
      tips: [
        'Name/Org/Title: Standard credits for the presentation team.'
      ]
    },
    {
      id: 'navy250',
      title: 'Navy 250 Assets',
      description: 'Specific content related to the Navy\'s 250th anniversary.',
      tips: [
        'Images: A collection of logos or historical photos specifically for the anniversary.',
        'Deadline: The target date for Navy 250 celebrations.'
      ]
    },
    {
      id: 'godmode',
      title: '⚡ God Mode',
      description: 'Full control over the raw data file. High risk, high reward.',
      tips: [
        'Syntax: This is YAML. One misplaced space can break the entire site.',
        'Verification: If the text turns red, the site cannot be updated. Check your indentation!',
        'Safety: Use this only if you need to make bulk changes that the standard forms can\'t handle.'
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
          className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent"
        >
          {helpContent.map((section) => (
            <div key={section.id} id={`help-section-${section.id}`} className="space-y-4 border-b border-slate-800 pb-12 last:border-0 scroll-mt-6">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">Section :: {section.id.toUpperCase()}</span>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{section.title}</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">{section.description}</p>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4 shadow-inner">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Commander's Intelligence:
                </h4>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-400 items-start">
                      <span className="text-yellow-500 font-black mt-0.5">»</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800 border-t border-slate-700 text-center flex justify-between items-center px-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Manual Revision 1.0.4</p>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] italic">Transmission Secure</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Omaha SSN-692</p>
        </div>
      </div>
    </div>
  )
}
