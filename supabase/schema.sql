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

alter table activities add column if not exists submitted_by uuid references profiles(id);
alter table activities add column if not exists origin_story text;
alter table activities add column if not exists is_curator_pick boolean default false;
alter table activities add column if not exists updated_at timestamptz default now();

-- Profiles
-- Public profile data linked 1:1 to Supabase Auth's auth.users.
-- Populated automatically by the trigger below right after signup —
-- no manual insert needed from the app.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  bio text,
  cities_lived uuid[] default '{}',
  is_trusted_curator boolean default false,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up.
-- Reads the "username" passed in supabase.auth.signUp({ options: { data: { username } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

-- ============================================================
-- Seed: Amsterdam
-- ============================================================

insert into cities (id, name, country, description, slug)
values (
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Amsterdam',
  'Netherlands',
  'Canals, bicycles, local markets, hidden courtyards and endless outdoor experiences. Amsterdam is best explored slowly, on foot or by bike.',
  'amsterdam'
);

-- Categories
insert into categories (id, name, icon, city_id) values 
  ('c1000000-0000-0000-0000-000000000001', 'Viewpoints', '🌅', 'a1b2c3d4-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000002', 'Parks', '🌳', 'a1b2c3d4-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000003', 'Street Food', '🥪', 'a1b2c3d4-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000004', 'Markets', '🛍️', 'a1b2c3d4-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000005', 'Free Museums', '🏛️', 'a1b2c3d4-0000-0000-0000-000000000002'),
  ('c1000000-0000-0000-0000-000000000006', 'Outdoor Escapes', '🚲', 'a1b2c3d4-0000-0000-0000-000000000002');

-- Activities
insert into activities (title, description, category_id, city_id, address, latitude, longitude, is_free, estimated_cost, local_tip) values

-- Viewpoints
(
  'NDSM Wharf',
  'A decommissioned shipyard on the north bank of the IJ river that has slowly become Amsterdam''s most interesting creative district. Enormous warehouses covered in street art, a winter festival ground, and wide open waterfront with unobstructed views back across to the city centre.',
  'c1000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'NDSM-Plein 1, Amsterdam Noord',
  52.4017, 4.8945,
  true, 'Free',
  'Take the free GVB ferry from behind Central Station — the IJ ferry crossing itself is a highlight and runs 24 hours. Go at sunset when the light hits the water and the city skyline turns orange. Most tourists never cross the river.'
),
(
  'Oudeschans Canal Corner',
  'A quiet canal bend in the Jodenbuurt neighbourhood where the old city walls once stood. The view takes in a windmill, a drawbridge, and crooked 17th-century houses all at once — one of the most photogenic spots in Amsterdam that isn''t on anyone''s list.',
  'c1000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Oudeschans, Amsterdam',
  52.3707, 4.9053,
  true, 'Free',
  'Come early morning before 9am — the light on the water is beautiful and you''ll have it almost to yourself. The windmill (De Gooyer) is five minutes'' walk away and has a small brewery inside.'
),
(
  'Havengebouw Rooftop',
  'The roof terrace of the old port authority building on the eastern waterfront offers views over the IJ harbour, the Java Island housing blocks, and ships moving in and out. Usually deserted on weekday mornings.',
  'c1000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'De Ruijterkade 7, Amsterdam',
  52.3792, 4.9141,
  true, 'Free',
  'The building is publicly accessible during office hours — just walk in and take the elevator to the top floor. Nobody stops you. Pair with a walk along the eastern harbour islands (KNSM-Eiland, Java-Eiland) which most visitors completely miss.'
),
 
-- Parks
(
  'Vondelpark',
  'Amsterdam''s most beloved park — 47 hectares of lawns, ponds, cycle paths and open-air theatre. On sunny afternoons the whole city seems to be here: musicians, dog walkers, students reading on the grass, families picnicking.',
  'c1000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Vondelpark, Amsterdam',
  52.3579, 4.8686,
  true, 'Free',
  'The free open-air theatre (Openluchttheater) runs concerts and performances from June through August — check the schedule online. Enter from the Leidseplein side and cut through to the quieter western end where locals actually hang out.'
),
(
  'Westerpark',
  'A former gasworks site turned into one of Amsterdam''s coolest green spaces, with a mix of lawns, ponds and the Westergasfabriek cultural complex — a collection of converted 19th-century industrial buildings now hosting cafés, studios and events.',
  'c1000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Haarlemmerweg 8-10, Amsterdam',
  52.3875, 4.8680,
  true, 'Free',
  'The park hosts Rollende Keukens (rolling kitchens food festival) in May and Pitch Music festival in summer — both free to enter the grounds. On regular weekends the Westergasfabriek courtyard fills with locals having lunch outside the café.'
),
(
  'Amsterdamse Bos',
  'A forest three times the size of Central Park, built by hand during the 1930s depression as a public works project. Miles of cycling and walking trails, a rowing lake, a goat farm, and — uniquely for Amsterdam — actual hills.',
  'c1000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Bosbaanweg 5, Amstelveen',
  52.3110, 4.8260,
  true, 'Free',
  'Rent a bike from the entrance near the Bosbaan (rowing lake) rather than bringing one on the tram. The goat farm (Geitenboerderij Ridammerhoeve) is free to visit and sells cheese — kids love it. Bring your own picnic; the park restaurant is overpriced.'
),
 
-- Street Food
(
  'Raw Herring at a Haringhandel',
  'The Dutch eat raw herring the traditional way — holding the fish by its tail and lowering it into your mouth, with chopped raw onion on top. It sounds alarming and tastes extraordinary. A rite of passage.',
  'c1000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Koningsplein (corner Singel), Amsterdam',
  52.3675, 4.8903,
  false, '~€4',
  'Go to Haringhandel Volendammer on Koningsplein — one of the last traditional stalls in the centre. Order it "met uitjes en augurken" (with onions and pickles). New herring season starts in late May/June and the first catch (Hollandse Nieuwe) is the best of the year.'
),
(
  'Stroopwafel from Albert Cuyp',
  'A fresh stroopwafel made on the spot — two thin waffles pressed together around hot caramel syrup. The ones from supermarket packets bear no resemblance to a warm, freshly-made one from the market.',
  'c1000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Albert Cuypstraat, De Pijp, Amsterdam',
  52.3545, 4.8917,
  false, '~€2',
  'The stall halfway down the market on the right-hand side makes them fresh in front of you — buy one and eat it immediately while the caramel is still molten. Any other time of day they''re fine; warm from the iron they''re exceptional.'
),
(
  'Bitterballen at a Brown Café',
  'Deep-fried breaded balls of beef ragù — the Dutch bar snack that accompanies every afternoon beer. Crispy outside, molten inside, served with mustard. The unofficial national snack.',
  'c1000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Spui area, Amsterdam',
  52.3683, 4.8924,
  false, '~€5 for a portion',
  'Any brown café (bruine kroeg) will serve them. Café ''t Smalle on the Egelantiersgracht is particularly atmospheric. Always blow on them first — the inside stays dangerously hot long after the outside cools. Dip in the mustard, not the mayo.'
),
 
-- Markets
(
  'Albert Cuyp Market',
  'Amsterdam''s largest and most beloved street market, running the full length of the Albert Cuypstraat in De Pijp. Over 260 stalls selling everything from cheese and fish to fabric and spices. This is where the neighbourhood actually shops.',
  'c1000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Albert Cuypstraat, De Pijp, Amsterdam',
  52.3545, 4.8917,
  true, 'Free to browse',
  'Go Tuesday through Friday when it''s less busy. Graze as you walk — the stroopwafels, fresh-cut frites (chips), and poffertjes (mini pancakes) stalls are scattered through the market. The surrounding De Pijp neighbourhood has some of Amsterdam''s best cheap restaurants for lunch afterward.'
),
(
  'Noordermarkt',
  'Two markets in one: Saturday morning has a biological farmers'' market with local cheese, bread and produce; Monday morning is a flea market selling secondhand clothes and antiques. Both are popular with locals and largely under the tourist radar.',
  'c1000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Noordermarkt, Jordaan, Amsterdam',
  52.3780, 4.8834,
  true, 'Free to browse',
  'The Saturday farmers'' market is tiny but the quality is exceptional — the Gouda aged on site by the cheese stall in the corner is worth the trip alone. Combine with a walk through the Jordaan neighbourhood canals, which are quieter than the tourist centre.'
),
(
  'IJ-Hallen Flea Market',
  'Europe''s largest flea market, held one weekend a month in the NDSM warehouse. Over 750 stalls across an enormous covered space selling vintage clothing, furniture, records, bicycles, and every variety of junk and treasure.',
  'c1000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'TT. Neveritaweg 15, Amsterdam Noord',
  52.4010, 4.8940,
  false, '~€5 entry',
  'Check the dates on ijhallen.nl before visiting — it''s only one weekend per month. Go when it opens at 9am to get the best finds before the dealers have picked through everything. The free NDSM ferry from behind Central Station drops you five minutes from the entrance.'
),
 
-- Free Museums
(
  'Amsterdam City Archives (Stadsarchief)',
  'One of the most beautiful interiors in Amsterdam — a grand 1920s bank building turned into a free public archive and exhibition space. Rotating exhibitions on Amsterdam history, photography and urban life. The main hall alone is worth seeing.',
  'c1000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Vijzelstraat 32, Amsterdam',
  52.3633, 4.8953,
  true, 'Free',
  'The permanent exhibition in the vault shows old city maps and photographs — genuinely fascinating if you want to understand how the canal ring was built. Nobody queues here. Go on a weekday afternoon when it''s completely quiet.'
),
(
  'Begijnhof (Secret Courtyard)',
  'A hidden medieval courtyard in the heart of the city, accessible through an unmarked door on the Spui. Inside: 14th-century houses arranged around a garden, two churches, and complete silence. One of the most surprising places in Amsterdam.',
  'c1000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Begijnhof 29, Amsterdam',
  52.3695, 4.8902,
  true, 'Free',
  'The entrance is easy to miss — look for the low wooden door on the south side of Spui square, not the main gate. The courtyard is open daily but respectful silence is expected. The English Reformed Church inside is the oldest in Amsterdam and has Plymouth Colony connections.'
),
(
  'Foam Photography Museum (free Fridays after 5pm)',
  'One of the best photography museums in Europe, housed in a canal house in the Keizersgracht. Mixes major international names with emerging Dutch photographers. The building itself — multiple connected houses — is part of the experience.',
  'c1000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Keizersgracht 609, Amsterdam',
  52.3608, 4.8966,
  false, 'Free Fridays after 5pm, ~€15 other times',
  'The Friday evening opening (5–9pm) is free and is a genuinely social event — locals come after work, the café is open, and the museum feels like a party. Check what''s on before you go as the exhibitions change regularly.'
),
 
-- Outdoor Escapes
(
  'Cycling the Waterland Route',
  'A 30km cycling route north of Amsterdam through traditional Dutch villages, polders, waterways and open farmland. Within 20 minutes of leaving the city centre you are in a completely different world — flat, quiet, and extraordinarily Dutch.',
  'c1000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Waterland, Noord-Holland',
  52.4500, 5.0200,
  false, 'Bike rental ~€10–15/day',
  'Follow the LF2 cycling route signs north from Central Station. Stop in Broek in Waterland for coffee — the village looks almost unchanged from 17th-century paintings. The route works in reverse too; just turn around whenever you feel like it. Flat enough for any fitness level.'
),
(
  'Swimming at Sloterplas Lake',
  'A large freshwater lake in West Amsterdam with free designated swimming areas, sand beaches, and a watersports centre. Used entirely by locals — no tourists, no entrance fee, no fuss.',
  'c1000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Sloterpark, Amsterdam',
  52.3630, 4.8070,
  true, 'Free',
  'Take tram 7 or 17 to Henk Sneevlietweg. The swimming area on the south side of the lake has a small sandy beach and is supervised in summer. Bring your own food — the snack bar is overpriced. Weekday mornings are peaceful; weekends get busy with families.'
),
(
  'Vondelpark Open-Air Theatre',
  'Free outdoor concerts, theatre and comedy performances in the heart of Vondelpark from June through August. The programme runs Wednesday through Sunday and draws a mixed crowd of locals — improvisational theatre, jazz, children''s shows, classical music.',
  'c1000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000002',
  'Openluchttheater, Vondelpark, Amsterdam',
  52.3577, 4.8695,
  true, 'Free',
  'Shows fill up fast on sunny evenings — arrive 30 minutes early and sit on the grass around the stage rather than the bleachers (better atmosphere). The schedule is at openluchttheater.nl. Bring a picnic from the Albert Cuyp market nearby.'
);

-- ============================================================
-- Seed: Berlin
-- ============================================================

insert into cities (id, name, country, description, slug)
values (
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Berlin',
  'Germany',
  'Raw, creative, historically layered and remarkably affordable. Berlin moves at its own pace — world-class galleries are free, parks are enormous, and the street food is better than most restaurants.',
  'berlin'
);

-- Categories
insert into categories (id, name, icon, city_id) values
  ('c2000000-0000-0000-0000-000000000001', 'Viewpoints',   '🌅', 'a1b2c3d4-0000-0000-0000-000000000003'),
  ('c2000000-0000-0000-0000-000000000002', 'Parks',        '🌳', 'a1b2c3d4-0000-0000-0000-000000000003'),
  ('c2000000-0000-0000-0000-000000000003', 'Street Food',  '🌯', 'a1b2c3d4-0000-0000-0000-000000000003'),
  ('c2000000-0000-0000-0000-000000000004', 'Markets',      '🛍️', 'a1b2c3d4-0000-0000-0000-000000000003'),
  ('c2000000-0000-0000-0000-000000000005', 'Free Museums', '🏛️', 'a1b2c3d4-0000-0000-0000-000000000003'),
  ('c2000000-0000-0000-0000-000000000006', 'Hikes',        '🥾', 'a1b2c3d4-0000-0000-0000-000000000003');

-- Activities
insert into activities (title, description, category_id, city_id, address, latitude, longitude, is_free, estimated_cost, local_tip) values

-- Viewpoints
(
  'Teufelsberg Radar Station',
  'A Cold War spy station built on a man-made hill of rubble from WWII Berlin. Two ruined golf-ball domes sit at the top, graffiti-covered and slowly collapsing, with panoramic views over the Grunewald forest and the city skyline. One of the strangest and most atmospheric places in Berlin.',
  'c2000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Teufelsberg, Grunewald, Berlin',
  52.4972, 13.2399,
  false, '~€8 guided entry',
  'Tours run on weekends — book ahead on the website. The hill itself (the highest point in Berlin) can be walked up for free at any time for views over the forest. The listening post is only accessible on tours but the exterior and surrounding forest are worth the walk alone.'
),
(
  'Viktoriapark Kreuzberg',
  'A steep park in Kreuzberg with a Prussian war memorial at the top and an artificial waterfall running down the hillside. From the summit you get a clear sightline north over the rooftops of Kreuzberg and Neukölln — the city stretching flat in every direction.',
  'c2000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Kreuzbergstraße, Kreuzberg, Berlin',
  52.4876, 13.3828,
  true, 'Free',
  'The park gets busy on warm evenings with Kreuzberg locals drinking beer on the slopes. In summer there''s a small open-air wine garden at the bottom — very relaxed. Five minutes'' walk from the U-Bahn Platz der Luftbrücke.'
),
(
  'East Side Gallery Walk',
  'A 1.3km stretch of the original Berlin Wall covered in murals painted by international artists in 1990, right after the wall fell. It runs along the Spree river — one side is the Wall, the other is the water.',
  'c2000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Mühlenstraße, Friedrichshain, Berlin',
  52.5053, 13.4397,
  true, 'Free',
  'Walk it from the Ostbahnhof end toward Warschauer Straße to go with the best light in the afternoon. Most tourists stop at the famous Brezhnev/Honecker kiss painting — keep walking to the less-photographed murals at the far end which are equally good. Best on a weekday to avoid selfie crowds.'
),

-- Parks
(
  'Tiergarten',
  'Berlin''s central park — a 210-hectare former royal hunting ground in the middle of the city. Dense enough to feel genuinely wild in places. The main paths connect all the major monuments but the best parts are the quiet wooded sections where you can walk for an hour without hitting a road.',
  'c2000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Tiergarten, Berlin',
  52.5138, 13.3501,
  true, 'Free',
  'On summer Sundays the park fills with Berlin''s Turkish community for enormous family barbecues in the northern section near the Spree — the atmosphere is wonderful and nobody minds you sitting nearby. The Café am Neuen See in the park rents rowing boats cheaply and has a beer garden.'
),
(
  'Tempelhof Field',
  'The former Nazi-era airport, closed in 2008, whose runways and taxiways are now a vast public park. Berliners cycle, skate, kite-surf, barbecue and grow community gardens on what used to be active runways. Completely flat, completely strange, and completely Berlin.',
  'c2000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Tempelhofer Damm, Tempelhof, Berlin',
  52.4737, 13.4010,
  true, 'Free',
  'Rent a bicycle and cycle the full perimeter (about 6km) on the old runway — it''s flat, car-free, and very fast. The community gardens in the centre are fascinating to walk through. The airport terminal building (the largest building in Europe when built) can be toured on weekends.'
),
(
  'Grunewald Forest and Wannsee',
  'Berlin''s western forest — 3,000 hectares of pine and oak woodland stretching down to a chain of lakes where Berliners have swum since the 19th century. Wannsee beach is one of the largest inland beach resorts in Europe.',
  'c2000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Grunewald, Berlin',
  52.4800, 13.2300,
  true, 'Free (Wannsee beach ~€5 in summer)',
  'Take the S-Bahn S7 to Wannsee. The free swimming areas on the Kleiner Wannsee (just across the road from the paid beach) are where locals go. In autumn the Grunewald forest walk from Grunewald S-Bahn through to Teufelsberg is one of the best in the city.'
),

-- Street Food
(
  'Döner Kebab',
  'Berlin''s most beloved food — and the best in the world. Turkish-Germans invented the modern Döner here in the 1970s and it remains the city''s defining street food. Lamb or mixed meat, shaved off a rotating spit, stuffed into fresh flatbread with vegetables and sauce.',
  'c2000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Neuköllner Str., Neukölln / Kreuzberg, Berlin',
  52.4917, 13.4200,
  false, '~€5–7',
  'Avoid the tourist-facing chains. The best Döner are in Neukölln and Kreuzberg — look for shops with long queues of Turkish-German locals. Imren Grill on Karl-Marx-Straße is a consistent local favourite. Ask for "alles drauf" (everything on) and eat it immediately.'
),
(
  'Currywurst at Curry 36',
  'Berlin''s other iconic street food: sliced sausage smothered in curried ketchup and served with chips. A post-war invention that became a city obsession. Curry 36 in Kreuzberg has been serving it since 1980.',
  'c2000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Mehringdamm 36, Kreuzberg, Berlin',
  52.4942, 13.3882,
  false, '~€4',
  'Order the Currywurst ohne Darm (without casing) — the texture is better. The queue at lunchtime looks long but moves fast. Eat standing at the metal counters; there''s something deeply Berlin about this. The Mehringdamm U-Bahn is 30 seconds away.'
),
(
  'Falafel on Mauerstraße',
  'Berlin has a long tradition of excellent falafel, particularly around the Mehringdamm area in Kreuzberg. Freshly fried falafel balls stuffed into pitta with tahini, pickled turnip, and chopped salad — filling, fast and cheap.',
  'c2000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Mehringdamm, Kreuzberg, Berlin',
  52.4944, 13.3884,
  false, '~€4',
  'Mustafa''s Gemüse Kebap on Mehringdamm sometimes has a 30-minute queue — it''s worth it but if you don''t want to wait, Dürüm Ziraat a few doors down is equally good with no queue at all. The vegetable döner (with roasted vegetables instead of meat) is also excellent and much cheaper.'
),

-- Markets
(
  'Mauerpark Flea Market',
  'Berlin''s most atmospheric Sunday market, held along the route of the old Berlin Wall in Prenzlauer Berg. A mix of genuine flea market stalls (vinyl records, vintage clothing, DDR-era objects) and handmade craft sellers. The adjoining park fills with picnickers, buskers and a famous open-air karaoke stage.',
  'c2000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Bernauer Straße 63-64, Prenzlauer Berg, Berlin',
  52.5420, 13.4030,
  true, 'Free to browse',
  'The open-air karaoke (Bear Pit Karaoke) starts around 3pm on Sundays when the weather is good and draws a crowd of thousands — it''s one of the great free spectacles of Berlin. Come early for the flea market stalls; the good vinyl and vintage is gone by noon.'
),
(
  'Türkischer Markt (Turkish Market)',
  'A twice-weekly market on the Maybachufer canal in Neukölln, serving the large Turkish-German community of the neighbourhood. Fresh vegetables, olives, spices, flatbreads, and an energy completely unlike any tourist market.',
  'c2000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Maybachufer, Neukölln, Berlin',
  52.4887, 13.4262,
  true, 'Free to browse',
  'Runs Tuesday and Friday afternoons (12–6pm) along the canal. Buy fresh gözleme (stuffed flatbread, ~€3) from the women making them fresh. The canalside is pleasant to sit along afterward; Neukölln is one of Berlin''s most interesting neighbourhoods to walk through.'
),
(
  'RAW Flohmarkt',
  'A flea market held every weekend on the grounds of the RAW-Gelände — a derelict railway maintenance depot in Friedrichshain that has become an alternative cultural centre. More rough-edged than Mauerpark, with better prices and a younger crowd.',
  'c2000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Revaler Str. 99, Friedrichshain, Berlin',
  52.5076, 13.4540,
  false, '~€1 entry',
  'Saturday and Sunday, from 10am. The RAW compound also has skate parks, climbing walls, and bars — it''s a day out in itself. The flea market has genuinely good secondhand clothing and records at lower prices than Mauerpark. Ten minutes from Warschauer Straße S/U-Bahn.'
),

-- Free Museums
(
  'Gemäldegalerie (free under 18 / first Sunday of month)',
  'One of the great European old masters collections — Rembrandt, Vermeer, Caravaggio, Botticelli, Raphael — in a purpose-built modern gallery near the Kulturforum. Permanently undervisited compared to its quality.',
  'c2000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Matthäikirchplatz 8, Tiergarten, Berlin',
  52.5079, 13.3647,
  false, 'Free first Sunday of month, ~€12 other times',
  'The first Sunday of every month is free entry. The gallery is never crowded — you can stand alone in front of Vermeer paintings that would have queues in Amsterdam or London. The adjacent Neue Nationalgalerie (Mies van der Rohe building) is also excellent and similarly undervisited.'
),
(
  'Topographie des Terrors',
  'A free permanent outdoor and indoor exhibition on the site of the former SS and Gestapo headquarters, documenting the apparatus of Nazi terror. One of the most important and sobering historical sites in the city.',
  'c2000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Niederkirchnerstraße 8, Kreuzberg, Berlin',
  52.5048, 13.3819,
  true, 'Free',
  'Allow 2–3 hours. The outdoor section follows the remaining stretch of the Berlin Wall along Niederkirchnerstraße — you can see original Wall sections here for free. The indoor exhibition is dense but essential. Goes well with a walk to Checkpoint Charlie (5 minutes away) though the memorial itself is heavily commercialised.'
),
(
  'Hamburger Bahnhof — Museum für Gegenwart',
  'Berlin''s contemporary art museum in a converted 19th-century railway station. The permanent collection includes Joseph Beuys, Andy Warhol, and Cy Twombly. The building — with its enormous hall and glass roof — is as impressive as the art.',
  'c2000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Invalidenstraße 50-51, Mitte, Berlin',
  52.5313, 13.3668,
  false, 'Free first Thursday 4–8pm, ~€14 other times',
  'Free on the first Thursday of every month from 4–8pm. The permanent Beuys installation alone is worth the trip. The museum is directly behind the main train station (Hauptbahnhof) and easy to combine with arriving or departing Berlin.'
),

-- Hikes
(
  'Müggelberge Forest and Müggelsee',
  'Berlin''s highest natural point (115m — Berlin is very flat) sits in the middle of the Müggelberge forest in the far southeast of the city, above the Müggelsee lake. Proper trails through mixed woodland, swimming in the lake in summer, and a 19th-century forest tower at the top.',
  'c2000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Müggelberge, Köpenick, Berlin',
  52.4160, 13.6550,
  true, 'Free',
  'Take the S-Bahn S3 to Erkner, then tram 60 or 61 to Rüdersdorf. The hike from the tram stop to the summit and down to the lake takes about 2 hours at a relaxed pace. Swim in the Müggelsee (free, unsupervised beaches) and take the ferry back across — the whole day costs almost nothing.'
),
(
  'Krumme Lanke to Schlachtensee',
  'A 5km lakeside walk through the Grunewald forest connecting two swimming lakes in southwest Berlin. Flat, well-marked trail through pine forest, with free swimming spots along both lakes. A genuine escape from the city.',
  'c2000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Krumme Lanke, Zehlendorf, Berlin',
  52.4478, 13.2478,
  true, 'Free',
  'Take the U-Bahn U3 to Krumme Lanke. Walk the trail south along the lake to Schlachtensee and catch the S-Bahn S1 back from Schlachtensee station. Both lakes have free swimming in summer. The forest path between them takes about 45 minutes and is quiet even on summer weekends.'
),
(
  'Köpenick Old Town and Forst Köpenick',
  'A medieval island town at the confluence of the Spree and Dahme rivers, surrounded by water and forest. The old town centre is largely intact, the 17th-century castle is free to walk around, and the surrounding Köpenick Forest has trails extending for miles.',
  'c2000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000003',
  'Altstadt Köpenick, Berlin',
  52.4486, 13.5761,
  true, 'Free',
  'Take the S-Bahn S3 to Köpenick — about 40 minutes from central Berlin. The old town feels like a different city. Walk from the town centre into the Forst Köpenick along the Dahme river for an easy 5km loop. Very few tourists make it out here.'
);