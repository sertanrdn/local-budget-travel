'use client'

import { useEffect, useRef } from 'react'

interface MapActivity {
  id: string
  title: string
  latitude: number
  longitude: number
  is_free: boolean
}

interface CityActivitiesMapProps {
  activities: MapActivity[]
  cityName: string
}

export function CityActivitiesMap({ activities, cityName }: CityActivitiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || activities.length === 0) return

    let isCancelled = false

    import('leaflet').then((leaflet) => {
      if (isCancelled || !mapRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (leaflet as any).default ?? leaflet

      // If a Leaflet instance is already on this container, remove it first
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any)?.remove()
        mapInstanceRef.current = null
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const markerIcon = (color: string) =>
        L.divIcon({
          html: `<div style="
            width: 26px;
            height: 26px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          className: '',
        })

      const bounds = L.latLngBounds([])

      activities.forEach((activity) => {
        const latLng: [number, number] = [activity.latitude, activity.longitude]
        bounds.extend(latLng)

        const color = activity.is_free ? '#5C6B2E' : '#C4703F'

        // Build popup content as a real DOM node so the "view details"
        // link works as a normal anchor tag inside the Leaflet popup.
        const popupContent = document.createElement('div')
        popupContent.style.fontFamily = 'inherit'
        popupContent.style.minWidth = '170px'

        const title = document.createElement('div')
        title.style.fontWeight = '600'
        title.style.fontSize = '13px'
        title.style.lineHeight = '1.3'
        title.style.marginBottom = '6px'
        title.style.color = '#2C1810'
        title.textContent = activity.title
        popupContent.appendChild(title)

        const badge = document.createElement('div')
        badge.style.fontSize = '11px'
        badge.style.fontWeight = '600'
        badge.style.marginBottom = '8px'
        badge.style.color = activity.is_free ? '#5C6B2E' : '#C4703F'
        badge.textContent = activity.is_free ? '✓ Free' : 'Paid'
        popupContent.appendChild(badge)

        const link = document.createElement('a')
        link.href = `/activity/${activity.id}`
        link.textContent = 'View details →'
        link.style.fontSize = '12px'
        link.style.color = '#C4703F'
        link.style.fontWeight = '600'
        link.style.textDecoration = 'none'
        popupContent.appendChild(link)

        L.marker(latLng, { icon: markerIcon(color) })
          .addTo(map)
          .bindPopup(popupContent)
      })

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
      }

      mapInstanceRef.current = map
    })

    return () => {
      isCancelled = true
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [activities])

  if (activities.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-earth-muted text-sm px-6 text-center">
        No mapped activities yet for {cityName}.
      </div>
    )
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}