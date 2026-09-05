'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string
  className?: string
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime()
  const difference = target - Date.now()
  if (!Number.isFinite(target) || difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(targetDate))
    const initialTimer = window.setTimeout(update, 0)
    const interval = window.setInterval(update, 1000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(interval)
    }
  }, [targetDate])

  if (!timeLeft) return null
  return (
    <div className={`flex items-center justify-center gap-4 md:gap-8 ${className}`}>
      <div className="text-center"><div className="text-4xl md:text-5xl font-serif font-bold text-brass">{timeLeft.days}</div><div className="text-xs md:text-sm text-offwhite/70 uppercase tracking-wider mt-1">Days</div></div>
      <div className="text-3xl text-brass/50">:</div>
      <div className="text-center"><div className="text-4xl md:text-5xl font-serif font-bold text-brass">{String(timeLeft.hours).padStart(2, '0')}</div><div className="text-xs md:text-sm text-offwhite/70 uppercase tracking-wider mt-1">Hours</div></div>
      <div className="text-3xl text-brass/50">:</div>
      <div className="text-center"><div className="text-4xl md:text-5xl font-serif font-bold text-brass">{String(timeLeft.minutes).padStart(2, '0')}</div><div className="text-xs md:text-sm text-offwhite/70 uppercase tracking-wider mt-1">Minutes</div></div>
      <div className="text-3xl text-brass/50 hidden md:block">:</div>
      <div className="text-center hidden md:block"><div className="text-4xl md:text-5xl font-serif font-bold text-brass">{String(timeLeft.seconds).padStart(2, '0')}</div><div className="text-xs md:text-sm text-offwhite/70 uppercase tracking-wider mt-1">Seconds</div></div>
    </div>
  )
}
