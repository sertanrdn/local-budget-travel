import Link from 'next/link'
import Image from 'next/image'
import type { Activity } from '@/lib/types'
import { isWikimediaUrl } from '@/lib/isWikimediaUrl'
import { getShortAddress } from '@/lib/formatAddress'

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activity/${activity.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-sand/60 overflow-hidden flex flex-col sm:flex-row group-hover:border-terracotta/30 group-hover:shadow-md transition-all duration-200">
        {/* Photo */}
        <div className="relative sm:w-48 sm:shrink-0 h-48 sm:h-auto bg-sand/30 overflow-hidden">
          {activity.photo_url ? (
            <Image
              src={activity.photo_url}
              alt={activity.title}
              fill
              unoptimized={isWikimediaUrl(activity.photo_url)}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-earth-muted/30">
              <span aria-hidden>📍</span>
              <span className="sr-only">No photo available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2 flex-1 min-w-0">
          {/* Title + cost badge */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-earth text-base leading-snug group-hover:text-terracotta transition-colors">
              {activity.title}
            </h2>
            <span
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                activity.is_free
                  ? 'bg-olive/10 text-olive'
                  : 'bg-terracotta/10 text-terracotta'
              }`}
            >
              {activity.is_free ? 'Free' : activity.estimated_cost || "Paid"}
            </span>
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-earth-muted text-sm leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          )}

          {/* Local tip — the hero field */}
          {activity.local_tip && (
            <div className="mt-1 bg-sand/30 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-terracotta uppercase tracking-wide mb-1">
                Local tip
              </p>
              <p className="text-sm text-earth-muted leading-relaxed line-clamp-2">
                {activity.local_tip}
              </p>
            </div>
          )}

          {/* Address */}
          {activity.address && (
            <p className="text-xs text-earth-muted/60 mt-auto pt-1 flex items-center gap-1">
              <span aria-hidden>📍</span>
              {getShortAddress(activity.address)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}