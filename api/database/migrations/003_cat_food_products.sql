-- Migration 003: Create cat food products table for the Diet Generator feature

CREATE TABLE cat_food_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('wet', 'dry', 'treat', 'supplement')),
    protein_source TEXT NOT NULL,
    img_name TEXT,
    nutritional_info TEXT
);

CREATE INDEX idx_cat_food_products_category ON cat_food_products(category);
CREATE INDEX idx_cat_food_products_protein_source ON cat_food_products(protein_source);

-- Initial seed data for cat food products (bundled with migration for existing databases)
INSERT INTO cat_food_products (name, description, category, protein_source, img_name, nutritional_info) VALUES
  ('Whiskas Chicken in Sauce', 'Tender chunks of chicken in a delicate sauce. Complete wet food for adult cats, rich in protein.', 'wet', 'chicken', 'whiskas_chicken.png', '{"protein":"10%","fat":"5%","fiber":"0.4%","moisture":"82%"}'),
  ('Royal Canin Sterilised 37', 'Dry kibble for neutered adult cats. Maintains healthy weight and supports the urinary tract.', 'dry', 'chicken', 'royal_canin_sterilised.png', '{"protein":"32%","fat":"13%","fiber":"6.7%","moisture":"8%"}'),
  ('Sheba Salmon in Jelly', 'Delicate salmon fillets in a subtle aspic. Natural aromas, no artificial colouring.', 'wet', 'salmon', 'sheba_salmon.png', '{"protein":"9%","fat":"4%","fiber":"0.3%","moisture":"83%"}'),
  ('Felix Tuna & Vegetables', 'Chunks of tuna with carrots and peas in an appetising sauce. Balanced everyday nutrition.', 'wet', 'tuna', 'felix_tuna.png', '{"protein":"8%","fat":"3.5%","fiber":"0.5%","moisture":"83%"}'),
  ('Hill''s Science Plan Adult Salmon', 'Premium dry food with salmon for adult cats. Supports skin health and a beautiful coat.', 'dry', 'salmon', 'hills_salmon.png', '{"protein":"33%","fat":"15%","fiber":"1.4%","moisture":"7.5%"}'),
  ('Purina ONE Beef', 'Wet food with beef and chicken. Nutrient-rich formula that promotes strong muscles.', 'wet', 'beef', 'purina_beef.png', '{"protein":"12%","fat":"6%","fiber":"0.5%","moisture":"80%"}'),
  ('Dreamies Chicken Treats', 'Crunchy balls with a creamy chicken filling. Perfect as a reward or food topper.', 'treat', 'chicken', 'dreamies_chicken.png', '{"protein":"29%","fat":"17%","fiber":"2%","moisture":"8%"}'),
  ('Animonda Carny Venison', 'Wet food with venison and beef. High in natural protein, grain-free and soy-free.', 'wet', 'venison', 'animonda_venison.png', '{"protein":"11%","fat":"5.5%","fiber":"0.5%","moisture":"81%"}'),
  ('Brit Care Grain Free Turkey', 'Grain-free dry food with turkey and peas. Ideal for gluten-sensitive cats.', 'dry', 'turkey', 'brit_care_turkey.png', '{"protein":"36%","fat":"16%","fiber":"2.5%","moisture":"10%"}'),
  ('Whiskas Rabbit in Jelly', 'Tender rabbit pieces in vitamin-enriched jelly. Complete everyday wet food.', 'wet', 'rabbit', 'whiskas_rabbit.png', '{"protein":"9%","fat":"4.5%","fiber":"0.3%","moisture":"82%"}'),
  ('Catisfactions Salmon Treats', 'Soft fish-shaped treats made with Atlantic salmon. No artificial colours.', 'treat', 'salmon', 'catisfactions_salmon.png', '{"protein":"26%","fat":"15%","fiber":"1.5%","moisture":"12%"}'),
  ('Advance Sterilized Chicken', 'Dry food for sterilised cats. Reduced calorie formula enriched with L-carnitine.', 'dry', 'chicken', 'advance_sterilized.png', '{"protein":"35%","fat":"11%","fiber":"4.5%","moisture":"9%"}'),
  ('Applaws Tuna & Shrimp', 'Natural wet food — 100% meat: tuna with shrimp. No broths, starch or artificial additives.', 'wet', 'tuna', 'applaws_tuna_shrimp.png', '{"protein":"14%","fat":"1%","fiber":"0.3%","moisture":"84%"}'),
  ('Omega-3 Cat Supplement', 'Salmon oil supplement supporting skin, coat and joint health.', 'supplement', 'salmon', 'omega3_supplement.png', '{"omega3":"30%","epa":"12%","dha":"8%","moisture":"2%"}'),
  ('Ziwi Peak Beef', 'High-meat food with New Zealand beef. Minimal processing, 96% meat, organs and bone.', 'dry', 'beef', 'ziwipeak_beef.png', '{"protein":"42%","fat":"22%","fiber":"2%","moisture":"14%"}');
