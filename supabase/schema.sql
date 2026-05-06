-- ============================================================
-- Local Budget Travel — Schema + Istanbul seed data
-- Paste this into the Supabase SQL editor and run it.
-- ============================================================

-- Cities
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  description text,
  cover_image_url text,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  city_id uuid references cities(id) on delete cascade,
  created_at timestamptz default now()
);

-- Activities
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  city_id uuid references cities(id) on delete cascade,
  address text,
  latitude float,
  longitude float,
  photo_url text,
  is_free boolean default true,
  estimated_cost text,
  local_tip text,
  created_at timestamptz default now()
);

-- ============================================================
-- Seed: Istanbul
-- ============================================================

insert into cities (id, name, country, description, slug)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Istanbul',
  'Turkey',
  'Two continents, one city — ancient bazaars, jaw-dropping viewpoints, and the world''s best street food for under €2. A place where you can spend nothing and feel everything.',
  'istanbul'
);

-- Categories
insert into categories (id, name, icon, city_id) values
  ('c0000000-0000-0000-0000-000000000001', 'Viewpoints',   '🌅', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000002', 'Parks',        '🌳', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000003', 'Street Food',  '🥙', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000004', 'Markets',      '🛍️', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000005', 'Free Museums', '🏛️', 'a1b2c3d4-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000006', 'Hikes',        '🥾', 'a1b2c3d4-0000-0000-0000-000000000001');

-- Activities
insert into activities (title, description, category_id, city_id, address, latitude, longitude, is_free, estimated_cost, local_tip) values

-- Viewpoints
(
  'Çamlıca Hill',
  'The highest point on the Asian side of Istanbul with a sweeping 360° panorama of the Bosphorus, the Princes'' Islands, and the European skyline. Best at golden hour.',
  'c0000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Büyük Çamlıca, Üsküdar, Istanbul',
  41.0333, 29.0667,
  true, 'Free',
  'Take the 15F bus from Üsküdar. Come 30 minutes before sunset — the light on the Bosphorus is unreal. Bring tea from the kiosk inside (₺10) and stay until after dark.'
),
(
  'Pierre Loti Café Hilltop',
  'A hilltop café overlooking the Golden Horn and Eyüp Sultan Mosque. Named after the French novelist who loved this spot. The view is one of the most romantic in the city.',
  'c0000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Gümüşsuyu Balmumcu Sk., Eyüp, Istanbul',
  41.0535, 28.9340,
  false, '~€2 for tea',
  'Take the cable car up from Eyüp Sultan (₺5 each way) rather than walking. Go on a weekday morning — weekends get very crowded with locals. Order the Turkish tea, not coffee.'
),
(
  'Galata Tower Surroundings',
  'You don''t need to pay to go inside the Galata Tower — the streets and rooftop terraces around it offer nearly the same views for free, plus the tower itself is photogenic from outside.',
  'c0000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Galata Kulesi, Beyoğlu, Istanbul',
  41.0256, 28.9742,
  true, 'Free',
  'Walk up Galata Tower street from Karaköy. The best photos of the tower are from the small square below. Several nearby rooftop cafés have the same view — just order a drink.'
),

-- Parks
(
  'Yıldız Park',
  'A vast forested park on a hill behind Beşiktaş, once part of the Ottoman palace grounds. Ancient trees, quiet paths, peacocks wandering freely, and a small lake. Almost no tourists.',
  'c0000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Yıldız Parkı, Beşiktaş, Istanbul',
  41.0515, 29.0110,
  true, 'Free',
  'Enter from the Çırağan Palace side for the best route. The park is huge — bring a picnic. Locals come here to read and nap under the trees. The palace pavilions inside cost a small fee but the park itself is free.'
),
(
  'Gülhane Park',
  'Istanbul''s oldest public park, right next to Topkapı Palace. In spring it''s carpeted with tulips. A peaceful escape in the heart of the old city, with Bosphorus glimpses from the far end.',
  'c0000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Gülhane Parkı, Eminönü, Istanbul',
  41.0133, 28.9817,
  true, 'Free',
  'Come in April for the tulip festival — Istanbul takes tulips very seriously. The park connects to the area below the Topkapı Palace walls. The tea garden at the far end has Bosphorus views.'
),

-- Street Food
(
  'Simit from a Street Cart',
  'The iconic sesame-crusted bread ring that Istanbul runs on. Sold from red carts all over the city. Warm, fresh, and filling — the perfect budget breakfast.',
  'c0000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Everywhere — look for the red carts',
  41.0136, 28.9550,
  false, '~₺10 (under €0.50)',
  'The carts near Eminönü and Karaköy have the freshest simits — the ferry crowd keeps them restocking constantly. Best eaten with white cheese (beyaz peynir) from a nearby market. Avoid the packaged ones in shops.'
),
(
  'Balık Ekmek at Eminönü',
  'Grilled fish sandwiches served straight from boats moored on the Golden Horn. Mackerel, onions, and lettuce stuffed into fresh bread. One of Istanbul''s most iconic cheap eats.',
  'c0000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Eminönü Ferry Terminal, Istanbul',
  41.0167, 28.9739,
  false, '~₺60 (~€2)',
  'Eat it standing by the water — that''s how locals do it. Add a pickle from the barrel next to the boat. The boats near the Galata Bridge have been there for decades; avoid the more touristy permanent kiosks nearby.'
),
(
  'Kumpir on Ortaköy Square',
  'Giant baked potatoes stuffed with anything you can imagine — butter, cheese, olives, sausage, pickles. A beloved Istanbul street food ritual in the lively Ortaköy neighbourhood.',
  'c0000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Ortaköy Meydanı, Beşiktaş, Istanbul',
  41.0481, 29.0275,
  false, '~₺120 (~€4)',
  'Point at what you want — you don''t need Turkish. Build it up with as many toppings as possible. The square is beautiful at night with the illuminated Bosphorus bridge behind it. Go after 9pm to avoid the weekend crowds.'
),

-- Markets
(
  'Kadıköy Market (Çarşı)',
  'The best market in Istanbul — a dense, aromatic neighbourhood on the Asian side full of fishmongers, spice sellers, greengrocers, and cheap eateries. This is where real Istanbul shops.',
  'c0000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Kadıköy Çarşı, Kadıköy, Istanbul',
  40.9906, 29.0297,
  true, 'Free to explore',
  'Cross from Eminönü by ferry (₺20) — much better than taking a bus. Come hungry and graze as you walk: kokoreç sandwiches, fresh juice, and midye dolma (stuffed mussels at ₺5 each). Way less touristy than the Grand Bazaar.'
),
(
  'Arasta Bazaar',
  'A quiet, covered bazaar behind the Blue Mosque selling quality ceramics, textiles, and Turkish crafts. Far less aggressive than the Grand Bazaar and actually pleasant to browse.',
  'c0000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Arasta Çarşısı, Sultanahmet, Istanbul',
  41.0045, 28.9773,
  true, 'Free to browse',
  'You can look without buying — no one will pressure you here. Good place to buy Turkish ceramics at fair prices. The stalls underneath lead to a small Byzantine cistern mosaic museum worth the ₺50 entry.'
),

-- Free Museums
(
  'Istanbul Modern (free on Thursdays)',
  'Turkey''s leading contemporary art museum on the Bosphorus waterfront in Karaköy. The collection showcases Turkish modern and contemporary artists. Free entry every Thursday.',
  'c0000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Meclis-i Mebusan Cd., Karaköy, Istanbul',
  41.0292, 28.9819,
  false, 'Free on Thursdays, ~₺200 other days',
  'Go on a Thursday evening when it''s free and the light over the Bosphorus is golden. The building was renovated in 2023 and the rooftop terrace alone is worth the visit. Combined well with a walk along the waterfront to Eminönü.'
),
(
  'Rahmi M. Koç Museum',
  'A fascinating industrial and transport museum in a converted Ottoman shipyard on the Golden Horn. Steam engines, cars, submarines, planes, and a real ship to explore. Unique in Turkey.',
  'c0000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Hasköy Cd. No:5, Beyoğlu, Istanbul',
  41.0514, 28.9486,
  false, '~₺150 (~€5)',
  'Take the Haliç ferry from Eminönü or Karaköy and get off at Hasköy — the ferry ride across the Golden Horn is half the experience. Budget 3 hours minimum. The submarine in the harbour is a highlight.'
),

-- Hikes
(
  'Belgrade Forest',
  'A vast forest north of the city that supplied Istanbul''s water for centuries via Ottoman aqueducts. Trails through ancient woodland, reservoirs, and complete quiet — hard to believe you''re near a city of 15 million.',
  'c0000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Belgrad Ormanı, Sarıyer, Istanbul',
  41.1667, 28.9833,
  true, 'Free',
  'Take the 48T bus from Taksim to the Bahçeköy entrance — about 45 minutes. Start early on weekends as it gets busy with picnicking families. The trail around the Büyükbent reservoir (about 4km loop) is the best route. Wear comfortable shoes — paths can be muddy.'
),
(
  'Princes'' Islands Day Trip',
  'Nine small islands in the Sea of Marmara, reachable by ferry. No cars allowed — only horse carriages and bicycles. Victorian mansions, pine forests, and sea swimming. The closest thing to an escape.',
  'c0000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Adalar, Princes'' Islands, Istanbul',
  40.8731, 29.0922,
  false, 'Ferry ~₺60 return (~€2), bike hire ~₺100',
  'Take the IDO ferry from Kabataş (1h15 to Büyükada, the largest island). Hire a bike immediately when you arrive before they run out. Ride to Yücetepe monastery at the top of the hill — the climb is tough but the view over the sea is the best in Istanbul. Pack lunch from Kadıköy market the day before.'
);
