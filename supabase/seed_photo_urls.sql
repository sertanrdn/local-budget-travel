-- ISTANBUL
-- Viewpoints
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1667288004144-7c6ce79bd2f9?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Çamlıca Hill' 
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1683976366920-58b54b6f497e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Pierre Loti Café Hilltop'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1607114855249-25a82098553a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Galata Tower Surroundings'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

-- Parks
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1732772978078-cbfc401669e6?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Yıldız Park'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/G%C3%BClhane_Park-Fountains.jpg/960px-G%C3%BClhane_Park-Fountains.jpg'
WHERE title = 'Gülhane Park'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

-- Street Food
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1604418990807-00c715dc622e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Simit from a Street Cart'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1766498737161-5b8f283c498b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Balık Ekmek at Eminönü'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Kumpir2.jpg/960px-Kumpir2.jpg'
WHERE title = 'Kumpir on Ortaköy Square'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

-- Markets
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Markt_in_Kad%C4%B1k%C3%B6y.jpg/960px-Markt_in_Kad%C4%B1k%C3%B6y.jpg'
WHERE title = 'Kadıköy Market (Çarşı)'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/PXL_20241209_161651842_Arasta_Bazaar_Istanbul_Turkiye_02.jpg/960px-PXL_20241209_161651842_Arasta_Bazaar_Istanbul_Turkiye_02.jpg'
WHERE title = 'Arasta Bazaar'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

-- Free Museums
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1720457726153-2d1a9cf90267?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Istanbul Modern (free on Thursdays)'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Rahmi_Ko%C3%A7_Museum_DSC_1230_%2817472451774%29.jpg/960px-Rahmi_Ko%C3%A7_Museum_DSC_1230_%2817472451774%29.jpg'
WHERE title = 'Rahmi M. Koç Museum'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

-- Hikes
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1723571654713-4bae4b431b31?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Belgrade Forest'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');

UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1739520652990-8e0bcf525107?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Princes'' Islands Day Trip'
    AND city_id = (SELECT id FROM cities WHERE slug = 'istanbul');


-- AMSTERDAM
-- Viewpoints
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/NDSM_Wharf_%40_Amsterdam_%2818302427358%29.jpg/960px-NDSM_Wharf_%40_Amsterdam_%2818302427358%29.jpg'
WHERE title = 'NDSM Wharf'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1744811231840-b54090f11aa6?q=80&w=1453&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Oudeschans Canal Corner'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/View_of_the_Port_of_Amsterdam_and_the_Havengebouw_%28Harbour_Building%29_along_the_IJ_waterfront_in_Amsterdam%2C_the_Netherlands%2C_with_Rhine_cruise_ships_moored_at_the_quay.jpg/960px-thumbnail.jpg'
WHERE title = 'Havengebouw Rooftop'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- Parks
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1746720828779-ac7ce59be31b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Vondelpark'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Overzicht_Westergasfabriek%2C_vanuit_het_Westerpark_-_Amsterdam_-_20536579_-_RCE.jpg/960px-Overzicht_Westergasfabriek%2C_vanuit_het_Westerpark_-_Amsterdam_-_20536579_-_RCE.jpg'
WHERE title = 'Westerpark'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Amsterdamse_Bos_%288%29.jpg/960px-Amsterdamse_Bos_%288%29.jpg'
WHERE title = 'Amsterdamse Bos'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- Street Food
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Raw_herring_with_pickles_and_tiny_Dutch_flags%2C_Groningen_%282020%29_01.jpg/960px-Raw_herring_with_pickles_and_tiny_Dutch_flags%2C_Groningen_%282020%29_01.jpg'
WHERE title = 'Raw Herring at a Haringhandel'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Stroopwafel_fresh_stand.jpg/960px-Stroopwafel_fresh_stand.jpg'
WHERE title = 'Stroopwafel from Albert Cuyp'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1742811893136-d264bf364a00?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Bitterballen at a Brown Café'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- Markets
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1605378560280-7e18ae08d9a9?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Albert Cuyp Market'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Noordermarkt_foto10.JPG/960px-Noordermarkt_foto10.JPG'
WHERE title = 'Noordermarkt'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Flea_Market%2C_Amsterdam_%286474737685%29.jpg/960px-Flea_Market%2C_Amsterdam_%286474737685%29.jpg'
WHERE title = 'IJ-Hallen Flea Market'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- Free museums
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/000_Amsterdam_City_Archives_10.jpg/960px-000_Amsterdam_City_Archives_10.jpg'
WHERE title = 'Amsterdam City Archives (Stadsarchief)'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Begijnhof%2C_Amsterdam.jpg/960px-Begijnhof%2C_Amsterdam.jpg'
WHERE title = 'Begijnhof (Secret Courtyard)'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Keizersgracht_609%2C_Amsterdam.JPG/960px-Keizersgracht_609%2C_Amsterdam.JPG'
WHERE title = 'Foam Photography Museum (free Fridays after 5pm)'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- Outdoor Escapes
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Waterland_weg_sloot.jpg/960px-Waterland_weg_sloot.jpg'
WHERE title = 'Cycling the Waterland Route'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sloterplas_Amsterdam.JPG/960px-Sloterplas_Amsterdam.JPG?_=20090907133413'
WHERE title = 'Swimming at Sloterplas Lake'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vondelpark_Openluchttheater%2C_Amsterdam.jpg/960px-Vondelpark_Openluchttheater%2C_Amsterdam.jpg'
WHERE title = 'Vondelpark Open-Air Theatre'
  AND city_id = (SELECT id FROM cities WHERE slug = 'amsterdam');

-- BERLIN
-- Viewpoints
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1665845042199-1ba3d96d63ef?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Teufelsberg Radar Station'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1631915486106-d1caddfdefb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Viktoriapark Kreuzberg'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1642764984363-a1d85a10b834?q=80&w=846&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'East Side Gallery Walk'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');

-- Parks
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1645716756901-0e38dc2fca35?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Tiergarten'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1684513290731-c1d83dd7dcdf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Tempelhof Field'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1667220474368-f9c0eff7debe?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Grunewald Forest and Wannsee'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');

-- Street Food
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Hahnchen_Doner_mit_Gemuse_at_Mustafas_Gemusekebap.jpg/960px-Hahnchen_Doner_mit_Gemuse_at_Mustafas_Gemusekebap.jpg'
WHERE title = 'Döner Kebab'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Currywurst-2024.jpg/960px-Currywurst-2024.jpg'
WHERE title = 'Currywurst at Curry 36'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/20240815_Falafel_Plate_Restaurant_The_Hummusapiens_Berlin_anagoria.jpg/960px-20240815_Falafel_Plate_Restaurant_The_Hummusapiens_Berlin_anagoria.jpg'
WHERE title = 'Falafel on Mauerstraße'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');

-- Markets
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Berlin-Mauerpark-Flohmarkt_%281%29.jpg/960px-Berlin-Mauerpark-Flohmarkt_%281%29.jpg'
WHERE title = 'Mauerpark Flea Market'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Berlin_Wochenmarkt_Maybachufer-20241206-RM-151828.jpg/960px-Berlin_Wochenmarkt_Maybachufer-20241206-RM-151828.jpg'
WHERE title = 'Türkischer Markt (Turkish Market)'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1728293712933-4faf77c3b56a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'RAW Flohmarkt'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');

-- Free Museums
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Berlin_Gem%C3%A4ldegalerie_008.jpg/960px-Berlin_Gem%C3%A4ldegalerie_008.jpg'
WHERE title = 'Gemäldegalerie (free under 18 / first Sunday of month)'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Topographie_des_Terrors_Berliner_Mauer_Berlin_Germany_-_panoramio.jpg/960px-Topographie_des_Terrors_Berliner_Mauer_Berlin_Germany_-_panoramio.jpg'
WHERE title = 'Topographie des Terrors'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Berlin_-_Hamburger_Bahnhof_Museum_f%C3%BCr_Gegenwart.jpg/960px-Berlin_-_Hamburger_Bahnhof_Museum_f%C3%BCr_Gegenwart.jpg'
WHERE title = 'Hamburger Bahnhof — Museum für Gegenwart'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');

-- Hikes
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/M%C3%BCggelsee_Berlin.jpg/960px-M%C3%BCggelsee_Berlin.jpg'
WHERE title = 'Müggelberge Forest and Müggelsee'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://images.unsplash.com/photo-1728306961131-02db4605c4dc?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE title = 'Krumme Lanke to Schlachtensee'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');
 
UPDATE activities 
SET photo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Berlin_Luftbild_K%C3%B6penick_Altstadt_asv2024-07.jpg/960px-Berlin_Luftbild_K%C3%B6penick_Altstadt_asv2024-07.jpg'
WHERE title = 'Köpenick Old Town and Forst Köpenick'
  AND city_id = (SELECT id FROM cities WHERE slug = 'berlin');