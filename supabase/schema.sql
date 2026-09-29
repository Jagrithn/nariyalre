create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('generator', 'collector', 'depot', 'admin')),
  full_name text not null,
  phone text not null unique,
  upi_id text,
  rating numeric(3, 2) default 4.5,
  is_online boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  address_text text not null,
  location_type text not null check (location_type in ('temple', 'vendor', 'market')),
  created_at timestamptz not null default now()
);

create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  generator_id uuid not null references public.profiles (id) on delete cascade,
  collector_id uuid references public.profiles (id) on delete set null,
  requested_kg numeric(6, 2) not null check (requested_kg > 0),
  actual_kg numeric(6, 2),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'in_transit', 'weighed_in', 'completed')),
  geo_lat double precision not null,
  geo_lng double precision not null,
  address_text text,
  location_type text check (location_type in ('temple', 'vendor', 'market')),
  requested_slot text check (requested_slot in ('now', '06-10', '10-14', '14-18', '18-22')),
  slot_date date,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.depot_batches (
  id uuid primary key default gen_random_uuid(),
  batch_id text not null unique,
  input_raw_kg numeric(8, 2) not null check (input_raw_kg > 0),
  output_fiber_kg numeric(8, 2) not null default 0,
  output_shell_kg numeric(8, 2) not null default 0,
  output_pith_kg numeric(8, 2) not null default 0,
  processed_at timestamptz not null default now()
);

create table if not exists public.distribution_logs (
  id uuid primary key default gen_random_uuid(),
  tier text not null check (tier in ('tier1_b2b', 'tier2_shg', 'tier3_inhouse')),
  material_type text not null check (material_type in ('fiber', 'shells', 'pith', 'cocopeat', 'compost')),
  quantity_kg numeric(8, 2) not null check (quantity_kg > 0),
  destination_name text not null,
  dispatched_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('earning', 'payout')),
  amount numeric(10, 2) not null check (amount > 0),
  status text not null default 'pending'
    check (status in ('pending', 'settled', 'rejected')),
  reference text,
  upi_id text,
  pickup_id uuid references public.pickups (id) on delete set null,
  created_at timestamptz not null default now(),
  settled_at timestamptz
);

create index if not exists pickups_generator_idx on public.pickups (generator_id);
create index if not exists pickups_collector_idx on public.pickups (collector_id);
create index if not exists pickups_status_idx on public.pickups (status);
create index if not exists locations_user_idx on public.locations (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists pickups_set_updated_at on public.pickups;
create trigger pickups_set_updated_at
  before update on public.pickups
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.pickups enable row level security;
alter table public.depot_batches enable row level security;
alter table public.distribution_logs enable row level security;
alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions
  for select to authenticated using (auth.uid() = user_id);

create policy "transactions_insert_own" on public.transactions
  for insert to authenticated with check (auth.uid() = user_id);

create policy "transactions_update_own" on public.transactions
  for update to authenticated using (auth.uid() = user_id);

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "locations_select_authenticated" on public.locations
  for select to authenticated using (true);

create policy "locations_insert_own" on public.locations
  for insert to authenticated with check (auth.uid() = user_id);

create policy "pickups_select_authenticated" on public.pickups
  for select to authenticated using (true);

create policy "pickups_insert_authenticated" on public.pickups
  for insert to authenticated with check (true);

create policy "pickups_update_authenticated" on public.pickups
  for update to authenticated using (true);

create policy "depot_batches_all_authenticated" on public.depot_batches
  for all to authenticated using (true) with check (true);

create policy "distribution_logs_all_authenticated" on public.distribution_logs
  for all to authenticated using (true) with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_app_meta_data ->> 'role', 'generator'),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.phone, '', 1)),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'system'
    check (type in ('pickup_status', 'payment', 'system')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

create policy "notifications_insert_own" on public.notifications
  for insert with check (auth.uid() = user_id);

create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id);

create table public.pickup_live_locations (
  pickup_id uuid primary key references public.pickups(id) on delete cascade,
  collector_id uuid references auth.users(id) on delete set null,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);

alter table public.pickup_live_locations enable row level security;

create policy "pickup_live_locations_all_authenticated" on public.pickup_live_locations
  for all to authenticated using (true) with check (true);

alter table public.profiles drop constraint if exists "profiles_role_check";
alter table public.profiles add constraint profiles_role_check
  check (role in ('generator', 'collector', 'depot', 'admin', 'consumer'));

create table if not exists public.products (
  id text primary key,
  name text not null,
  material_type text not null check (material_type in ('fiber', 'shells', 'pith', 'cocopeat', 'compost')),
  price numeric(10, 2) not null check (price >= 0),
  unit text not null,
  description text not null default '',
  made_by text not null default '',
  stock integer not null default 10 check (stock >= 0),
  recycler_kg numeric(6, 2) not null default 1 check (recycler_kg >= 0),
  accent text not null default 'emerald' check (accent in ('emerald', 'teal', 'amber', 'lime'))
);

create table if not exists public.vending_machines (
  id text primary key,
  name text not null,
  address text not null default '',
  lat double precision not null,
  lng double precision not null,
  fill_level integer not null default 0 check (fill_level between 0 and 100),
  payout_per_kg numeric(8, 2) not null default 6 check (payout_per_kg >= 0),
  accepts text[]
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  items jsonb not null default '[]',
  total numeric(10, 2) not null check (total >= 0),
  kg_diverted numeric(8, 2) not null default 0,
  status text not null default 'placed'
    check (status in ('placed', 'processing', 'shipped', 'delivered')),
  address text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.vending_machines enable row level security;
alter table public.orders enable row level security;

create policy "products_read_public" on public.products
  for select to anon, authenticated using (true);

create policy "products_all_authenticated" on public.products
  for all to authenticated using (true) with check (true);

create policy "machines_read_public" on public.vending_machines
  for select to anon, authenticated using (true);

create policy "machines_all_authenticated" on public.vending_machines
  for all to authenticated using (true) with check (true);

create policy "orders_select_own" on public.orders
  for select to authenticated using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);

create policy "orders_update_own" on public.orders
  for update to authenticated using (auth.uid() = user_id);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);