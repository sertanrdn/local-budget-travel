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