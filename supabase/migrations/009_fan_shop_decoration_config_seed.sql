-- Fan shop decoration config seed (curated customize SKUs)
-- Idempotent: safe to re-run.

insert into public.fan_shop_decoration_config (
  style_number,
  decoration_method,
  logo_placement,
  logo_max_width_inches,
  notes
)
values
  -- T-Shirts
  ('A4N3402', 'screenprint', 'chest_center', 4.0, null),
  ('NL6010', 'screenprint', 'chest_center', 4.0, null),
  ('NL6600', 'screenprint', 'chest_center', 4.0, null),
  ('NL3600', 'screenprint', 'chest_center', 4.0, null),
  ('DT6200', 'screenprint', 'chest_center', 4.0, null),
  ('5000', 'screenprint', 'chest_center', 4.0, null),
  ('65000', 'screenprint', 'chest_center', 4.0, null),
  -- Hoodies
  ('18600', 'screenprint', 'chest_center', 4.0, null),
  ('F281', 'screenprint', 'chest_center', 4.0, null),
  ('PC78H', 'screenprint', 'chest_center', 4.0, null),
  -- Polos
  ('K500', 'embroidery', 'left_chest', 3.5, null),
  ('ST650', 'embroidery', 'left_chest', 3.5, null),
  ('K540', 'embroidery', 'left_chest', 3.5, null),
  -- Hats
  ('112', 'embroidery', 'front_center', 2.25, null),
  ('355', 'embroidery', 'front_center', 2.25, null),
  ('356', 'embroidery', 'front_center', 2.25, null),
  ('1567', 'embroidery', 'front_center', 2.25, null),
  ('1717', 'embroidery', 'front_center', 2.25, null),
  -- Bags (forward compat)
  ('9360', 'embroidery', 'front_center', 4.0, null)
on conflict (style_number) do update set
  decoration_method = excluded.decoration_method,
  logo_placement = excluded.logo_placement,
  logo_max_width_inches = excluded.logo_max_width_inches,
  notes = excluded.notes;
