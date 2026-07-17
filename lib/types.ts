export interface City {
  id: string
  name: string
  country: string
  description: string
  cover_image_url: string | null
  slug: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  city_id: string
  created_at: string
}

export interface Activity {
  id: string
  title: string
  description: string
  category_id: string
  city_id: string
  address: string
  latitude: number
  longitude: number
  photo_url: string
  is_free: boolean
  estimated_cost: string
  local_tip: string
  submitted_by: string | null
  origin_story: string | null
  is_curator_pick: boolean
  submitted_as_local: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  username: string
  bio: string | null
  cities_lived: string[]
  is_trusted_curator: boolean
  avatar_url: string | null
  created_at: string
}

export interface ActivitySubmitter {
  username: string
  avatar_url: string | null
}

export interface ActivityWithSubmitter extends Activity {
  profiles: ActivitySubmitter | null
}