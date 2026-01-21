import { ImageWithFallback } from './ImageWithFallback'

interface DocumentCardProps {
  title: string
  image: string
  excerpt: string
  className?: string
}

export function DocumentCard({ title, image, excerpt, className = '' }: DocumentCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden page-break-avoid ${className}`}>
      {/* Document Image Frame */}
      <div className="relative bg-neutral-light/30 p-4">
        <div className="relative aspect-[8.5/11] bg-white border-2 border-neutral-light/50 shadow-inner">
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Document Details */}
      <div className="p-6">
        <h4 className="font-serif font-bold text-navy mb-3 text-lg">
          {title}
        </h4>
        <div className="h-px bg-brass/30 mb-3"></div>
        <p className="text-sm text-slate-deep leading-relaxed italic">
          &ldquo;{excerpt}&rdquo;
        </p>
      </div>
    </div>
  )
}
