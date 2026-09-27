insert into public.profiles (id, role, full_name, phone, upi_id, rating, is_online) values
  ('00000000-0000-4000-8000-000000000001', 'generator', 'Mariyamma Temple Trust', '+919740000001', null, 4.8, true),
  ('00000000-0000-4000-8000-000000000002', 'generator', 'Karthik Fruit Stall', '+919740000002', null, 4.5, true),
  ('00000000-0000-4000-8000-000000000003', 'generator', 'Pondy Bazaar Market', '+919740000003', null, 4.9, false),
  ('00000000-0000-4000-8000-000000000011', 'collector', 'Ravi Shankar', '+919740000011', 'ravi.shankar@okhdfcbank', 4.7, true),
  ('00000000-0000-4000-8000-000000000012', 'collector', 'Meena Kumari', '+919740000012', 'meena.kumari@okicici', 4.9, false),
  ('00000000-0000-4000-8000-000000000021', 'depot', 'Coco Central Depot', '+919740000021', null, null, null),
  ('00000000-0000-4000-8000-000000000031', 'admin', 'Ananya Iyer', '+919740000031', null, null, null)
on conflict (id) do nothing;

insert into public.locations (id, user_id, lat, lng, address_text, location_type) values
  ('00000000-0000-4000-8000-000000000041', '00000000-0000-4000-8000-000000000001', 13.0487, 80.2757, 'Sri Kapaleeshwarar Temple, Mylapore', 'temple'),
  ('00000000-0000-4000-8000-000000000042', '00000000-0000-4000-8000-000000000002', 13.0624, 80.2507, 'Karthik Fruit Stall, Pondy Bazaar', 'vendor'),
  ('00000000-0000-4000-8000-000000000043', '00000000-0000-4000-8000-000000000003', 13.0358, 80.2220, 'Saidapet Market, Chennai', 'market'),
  ('00000000-0000-4000-8000-000000000044', '00000000-0000-4000-8000-000000000001', 13.0395, 80.2335, 'Kandaswamy Temple, Park Town', 'temple')
on conflict (id) do nothing;

insert into public.pickups (id, generator_id, collector_id, requested_kg, actual_kg, status, geo_lat, geo_lng, address_text, location_type, requested_slot, slot_date, created_at, completed_at) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000011', 42, 48, 'completed', 13.0487, 80.2757, 'Sri Kapaleeshwarar Temple, Mylapore', 'temple', '06-10', null, now() - interval '8 days', now() - interval '8 days' + interval '3 hours'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000011', 18, 21, 'weighed_in', 13.0624, 80.2507, 'Karthik Fruit Stall, Pondy Bazaar', 'vendor', '10-14', null, now() - interval '4 days', now() - interval '4 days' + interval '2 hours'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000012', 60, 66, 'in_transit', 13.0395, 80.2335, 'Kandaswamy Temple, Park Town', 'temple', 'now', null, now() - interval '1 day', null),
  ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000003', null, 120, null, 'pending', 13.0358, 80.2220, 'Saidapet Market, Chennai', 'market', '10-14', current_date, now() - interval '5 hours', null),
  ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000002', null, 25, null, 'pending', 13.0472, 80.2620, 'Luz Church Road vendor cluster', 'vendor', '18-22', current_date, now() - interval '4 hours', null),
  ('00000000-0000-4000-8000-000000000106', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000012', 34, 31, 'accepted', 13.0526, 80.2412, 'Marundeeswarar Temple, Thiruvanmiyur', 'temple', 'now', null, now() - interval '3 hours', null);

insert into public.depot_batches (id, batch_id, input_raw_kg, output_fiber_kg, output_shell_kg, output_pith_kg, processed_at) values
  ('00000000-0000-4000-8000-000000000201', 'B-2601', 1000, 260, 430, 245, now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000202', 'B-2602', 1240, 321, 538, 302, now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000203', 'B-2603', 860, 216, 366, 209, now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000204', 'B-2604', 1495, 389, 634, 358, now() - interval '6 hours')
on conflict (id) do nothing;

insert into public.distribution_logs (id, tier, material_type, quantity_kg, destination_name, dispatched_at) values
  ('00000000-0000-4000-8000-000000000301', 'tier1_b2b', 'fiber', 500, 'Sathya Agro Fibres, Coimbatore', now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000302', 'tier1_b2b', 'fiber', 320, 'TerraBloom Mattresses', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000303', 'tier2_shg', 'shells', 280, 'Kalpana Women''s SHG, Perungudi', now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000304', 'tier2_shg', 'fiber', 150, 'Green Hands SHG, Velachery', now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000305', 'tier3_inhouse', 'cocopeat', 400, 'Coco Process Unit', now() - interval '8 hours'),
  ('00000000-0000-4000-8000-000000000306', 'tier3_inhouse', 'compost', 260, 'Coco Bhoomi Block Camp', now() - interval '8 hours')
on conflict (id) do nothing;