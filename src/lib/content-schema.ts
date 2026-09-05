import { z } from 'zod'

const text = z.string()
const finiteNumber = z.number().finite()
const optionalText = z.string().default('')
const dateTimeWithOffset = z.string().refine(
  (value) => value === '' || /(?:Z|[+-]\d{2}:\d{2})$/i.test(value),
  'Countdown date must include a time-zone offset (for example 2026-05-16T15:00:00Z).',
)

export const metadataSchema = z.object({
  title: text,
  subtitle: text,
  year: text,
  mode: z.enum(['memorial', 'donor']),
})

export const heroSchema = z.object({
  heading: text,
  subheading: text,
  backgroundImage: text,
})

export const missionSchema = z.object({
  heading: text,
  statement: text,
  highlights: z.array(text),
})

export const agendaSchema = z.object({
  heading: text,
  items: z.array(z.object({ title: text, description: text })),
})

export const backgroundSchema = z.object({
  heading: text,
  paragraphs: z.array(text),
  keyPoints: z.array(text),
  milestones: z.array(z.object({ year: text, month: text, event: text })),
})

export const lettersSchema = z.object({
  heading: text,
  description: text,
  items: z.array(z.object({ title: text, image: text, excerpt: text })),
})

export const submarineFactsSchema = z.object({
  heading: text,
  facts: z.array(z.object({ label: text, value: text })),
  image: text,
})

export const timelineSchema = z.object({
  heading: text,
  milestones: z.array(z.object({ date: text, title: text, details: text })),
})

export const phasesSchema = z.object({
  heading: text,
  phaseList: z.array(z.object({
    number: finiteNumber,
    title: text,
    description: text,
    status: text,
    cost: text,
    percentComplete: finiteNumber,
  })),
})

const legacyGiftItems = [
  {
    name: 'Walkways',
    description: 'Concrete pathways allowing visitors to walk around the submarine hull and experience its true scale. These pathways will be ADA-compliant and built to last decades.',
  },
  {
    name: 'Interpretive Exhibits',
    description: "Educational panels telling the story of USS Omaha's 17-year service, the submarine force, and the crew who served. These exhibits will educate future generations about submarine warfare and sacrifice.",
  },
  {
    name: 'Donor Recognition',
    description: "Permanent bronze plaques honoring all who contributed to this memorial. Your name, or a loved one's name, will be displayed alongside fellow patriots who made this project possible.",
  },
]

export const whatYourGiftBuildsSchema = z.object({
  heading: text,
  subheading: text,
  phaseLabel: z.string().default('Phase 4'),
  items: z.array(z.object({
    name: text,
    description: text,
  })).default(legacyGiftItems),
  promiseHeading: z.string().default('Our Promise to You'),
  promiseText: z.string().default('100% of your designated gift goes directly to building the element you choose. No administrative overhead. No ambiguity. Just your contribution, completing the USS Omaha Memorial.'),
})

export const fundraisingProgressSchema = z.object({
  raised: finiteNumber,
  goal: finiteNumber,
  donorCount: finiteNumber,
  lastGiftTime: text,
})

export const budgetSchema = z.object({
  heading: text,
  totalRemaining: text,
  note: text,
})

export const locationShiftSchema = z.object({
  heading: text,
  subtitle: text,
  floodImage: text,
  floodCaption: text,
  newLocationHeading: text,
  newLocationBody: text,
  mapImage: text,
  mapCaption: optionalText,
})

export const sitePlanSchema = z.object({
  heading: text,
  description: text,
  detail: text,
  renderImage: text,
})

export const gallerySchema = z.object({
  heading: text,
  images: z.array(z.object({ src: text, caption: text })),
})

export const executionPhotosSchema = z.object({
  heading: text,
  photos: z.array(z.object({ src: text, caption: text, year: text })),
})

export const whyNowSchema = z.object({
  heading: text,
  projects: z.array(z.object({ name: text, cost: text })),
  memorial: z.object({ name: text, cost: text }),
  tagline: text,
})

const organizationSchema = z.object({
  name: text,
  ein: text,
  website: text,
  email: text,
  phone: text,
  mailingAddress: z.object({
    attention: text,
    address: text,
    city: text,
  }),
})

const alternateOrganizationSchema = z.object({
  name: text,
  ein: text,
  note: text,
})

const callToActionModeSchema = z.object({
  heading: text,
  tagline: text,
  donationHeading: text,
  primaryOrg: organizationSchema,
  alternateOrg: alternateOrganizationSchema,
  trustIndicators: z.array(text).default([]),
  taxNote: text,
  pledgeFormText: text,
  pledgeFormUrl: text,
})

export const callToActionSchema = z.object({
  memorial: callToActionModeSchema,
  donor: callToActionModeSchema,
})

export const volunteerSchema = z.object({
  heading: text,
  subheading: text,
  contact: z.object({
    name: optionalText,
    phone: optionalText,
    email: optionalText,
  }).default({ name: '', phone: '', email: '' }),
  opportunities: z.array(text).default([]),
  organization: optionalText,
  organizationContact: optionalText,
})

export const stakeholdersSchema = z.object({
  heading: text,
  members: z.array(z.object({ name: text, title: text, subtitle: optionalText })),
})

export const closeSchema = z.object({
  heading: text,
  subheading: text,
  contactInfo: z.object({
    organization: text,
    website: text,
    contact: text,
  }),
})

export const presentedBySchema = z.object({
  heading: text,
  presenters: z.array(z.object({ name: text, org: text, title: text })),
})

export const footerSchema = z.object({
  address: z.array(text),
  contact: z.object({ name: text, email: text, phone: text }),
  quickLinks: z.array(z.object({ label: text, href: text })),
  logos: z.array(z.object({ src: text, alt: text, href: optionalText })),
})

export const navy250Schema = z.object({
  logo: text,
  heading: text,
  countdownEnabled: z.boolean().default(true),
  deadline: dateTimeWithOffset.default(''),
  deadlineLabel: optionalText,
  deadlineText: optionalText,
  subheading: text,
  subtitle: text,
  images: z.array(text),
})

export const contentSchema = z.object({
  metadata: metadataSchema,
  hero: heroSchema,
  mission: missionSchema,
  agenda: agendaSchema,
  background: backgroundSchema,
  letters: lettersSchema,
  submarineFacts: submarineFactsSchema,
  timeline: timelineSchema,
  phases: phasesSchema,
  whatYourGiftBuilds: whatYourGiftBuildsSchema,
  fundraisingProgress: fundraisingProgressSchema,
  budget: budgetSchema,
  locationShift: locationShiftSchema,
  sitePlan: sitePlanSchema,
  gallery: gallerySchema,
  executionPhotos: executionPhotosSchema,
  whyNow: whyNowSchema,
  callToAction: callToActionSchema,
  volunteer: volunteerSchema,
  stakeholders: stakeholdersSchema,
  close: closeSchema,
  presentedBy: presentedBySchema,
  footer: footerSchema,
  navy250: navy250Schema,
})

export type ContentData = z.infer<typeof contentSchema>

type MutableRecord = Record<string, unknown>

function asRecord(value: unknown): MutableRecord | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as MutableRecord : null
}

function legacyOmahaDeadlineToUtc(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return value
  const [, year, month, day, hour, minute, second = '00'] = match
  const wallClockUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))

  const offsetAt = (timestamp: number) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(timestamp))
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0)
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - timestamp
  }

  let offset = offsetAt(wallClockUtc)
  let timestamp = wallClockUtc - offset
  const refined = offsetAt(timestamp)
  if (refined !== offset) timestamp = wallClockUtc - refined
  return new Date(timestamp).toISOString().replace('.000Z', 'Z')
}

export function parseContent(value: unknown): ContentData {
  const root = asRecord(value)
  if (!root) return contentSchema.parse(value)
  const migrated: MutableRecord = { ...root }
  const navy = asRecord(root.navy250)
  if (navy && typeof navy.deadline === 'string' && navy.deadline && !/(?:Z|[+-]\d{2}:\d{2})$/i.test(navy.deadline)) {
    migrated.navy250 = { ...navy, deadline: legacyOmahaDeadlineToUtc(navy.deadline) }
  }
  return contentSchema.parse(migrated)
}

export function validateContent(value: unknown): { success: true; data: ContentData } | { success: false; message: string } {
  const result = contentSchema.safeParse(value)
  if (result.success) return { success: true, data: result.data }

  const first = result.error.issues[0]
  const path = first?.path?.join('.')
  return {
    success: false,
    message: `${path ? `${path}: ` : ''}${first?.message || 'Invalid content structure'}`,
  }
}
