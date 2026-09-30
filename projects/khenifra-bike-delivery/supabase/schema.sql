create extension if not exists "pgcrypto";

create type public.delivery_status as enum (
  'requested','assigned','rider_to_pickup','picked_up',
  'rider_to_dropoff','delivered','cancelled','failed'
);

create type public.delivery_category as enum (
  'food','groceries','documents','parcel'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferred_language text not null default 'ar'
    check (preferred_language in ('ar','fr','en')),
  created_at timestamptz not null default now()
);

create table public.riders (
  id uuid primary key references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','approved','suspended')),
  is_online boolean not null default false,
  vehicle_type text not null default 'bike'
    check (vehicle_type in ('bike','motorbike')),
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  phone text,
  pickup_address text not null,
  created_at timestamptz not null default now()
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null
    default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  customer_id uuid references public.profiles(id) on delete set null,
  rider_id uuid references public.riders(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  category public.delivery_category not null,
  status public.delivery_status not null default 'requested',
  pickup_address text not null,
  dropoff_address text not null,
  sender_phone text not null,
  recipient_phone text not null,
  notes text,
  quoted_price_mad numeric(10,2),
  final_price_mad numeric(10,2),
  delivery_pin text,
  requested_at timestamptz not null default now(),
  assigned_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz
);

create table public.delivery_events (
  id bigint generated always as identity primary key,
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  status public.delivery_status not null,
  note text,
  actor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index deliveries_status_idx on public.deliveries(status);
create index deliveries_rider_idx on public.deliveries(rider_id);
create index delivery_events_delivery_idx on public.delivery_events(delivery_id, created_at);

alter table public.profiles enable row level security;
alter table public.riders enable row level security;
alter table public.businesses enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_events enable row level security;

-- Add policies after authentication roles/admin claims are finalized.
-- Never expose the service-role key to client-side code.


-- Performance indexes required by foreign keys
create index if not exists businesses_owner_idx on public.businesses(owner_id);
create index if not exists deliveries_business_idx on public.deliveries(business_id);
create index if not exists deliveries_customer_idx on public.deliveries(customer_id);
create index if not exists delivery_events_actor_idx on public.delivery_events(actor_id);

-- Authenticated ownership/participant policies
create policy "profiles_select_own"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "riders_select_own"
on public.riders for select to authenticated
using ((select auth.uid()) = id);

create policy "riders_update_own"
on public.riders for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "businesses_owner_all"
on public.businesses for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "deliveries_customer_insert"
on public.deliveries for insert to authenticated
with check ((select auth.uid()) = customer_id);

create policy "deliveries_participant_select"
on public.deliveries for select to authenticated
using (
  (select auth.uid()) = customer_id
  or (select auth.uid()) = rider_id
);

create policy "deliveries_participant_update"
on public.deliveries for update to authenticated
using (
  (select auth.uid()) = customer_id
  or (select auth.uid()) = rider_id
)
with check (
  (select auth.uid()) = customer_id
  or (select auth.uid()) = rider_id
);

create policy "delivery_events_participant_select"
on public.delivery_events for select to authenticated
using (
  exists (
    select 1
    from public.deliveries d
    where d.id = delivery_id
      and (
        d.customer_id = (select auth.uid())
        or d.rider_id = (select auth.uid())
      )
  )
);
