import { CardSurface } from './CardSurface'
import { ImageWithFallback } from './ImageWithFallback'

interface DocumentCardProps {
  title: string
  image: string
  excerpt: string
  className?: string
  isPrint?: boolean
}

export function DocumentCard({ title, image, excerpt, className = '', isPrint = false }: DocumentCardProps) {
  return (
    <CardSurface
      variant="light"
      padding="md"
      interactive={!isPrint}
      className={`overflow-hidden ${isPrint ? 'document-card-print' : ''} ${className}`}
    >
      {/* Document Image Frame */}
      <div className={`relative bg-neutral-light/30 p-4 -m-6 mb-6 ${isPrint ? 'document-image-container' : ''}`}>
        <div className={`relative ${isPrint ? 'h-full' : 'aspect-[8.5/11]'} bg-white border-2 border-neutral-light/50 shadow-inner`}>
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Document Details */}
      <div>
        <h4 className="font-serif font-bold text-navy mb-3 text-lg">
          {title}
        </h4>
        <div className="h-px bg-brass/30 mb-3"></div>
        <p className="text-sm text-slate-deep leading-relaxed italic">
          &ldquo;{excerpt}&rdquo;
        </p>
      </div>
    </CardSurface>
  )
}
