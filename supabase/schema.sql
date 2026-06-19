create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique,
  telegram_username text,
  telegram_name text,
  wallet_address text,
  created_at timestamp default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  profile_id uuid references profiles(id),
  telegram_id text,
  wallet_address text,
  card_type text check (card_type in ('virtual','physical','free')),
  full_name text not null,
  telegram_username text,
  shipping_address text,
  city text,
  country text,
  coupon_code text,
  secret_code text not null,
  token_id text,
  status text default 'pending',
  shipment_status text default 'Not shipped yet',
  tracking_note text default 'Tracking will be updated soon.',
  created_at timestamp default now()
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  order_id text references orders(order_id),
  holder_name text,
  card_number text,
  cvv text,
  expiry text,
  status text default 'inactive',
  balance numeric default 0,
  created_at timestamp default now()
);

create table admin_settings (
  id uuid primary key default gen_random_uuid(),
  reload_enabled boolean default true,
  withdraw_enabled boolean default true,
  min_reload numeric default 10,
  max_reload numeric default 500,
  min_withdraw numeric default 10,
  max_withdraw numeric default 500,
  free_card_min_activation numeric default 50,
  created_at timestamp default now()
);

insert into admin_settings (
  reload_enabled,
  withdraw_enabled,
  min_reload,
  max_reload,
  min_withdraw,
  max_withdraw,
  free_card_min_activation
) values (
  true,
  true,
  10,
  500,
  10,
  500,
  50
);
