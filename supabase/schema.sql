-- Finance Timeline - Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database.

-- ============================================================
-- TABLES
-- ============================================================

-- Debts (created first since transactions reference it)
create table debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  original_amount numeric(12,2) not null,
  current_balance numeric(12,2) not null,
  interest_rate numeric(7,4),
  minimum_payment numeric(12,2) not null,
  due_date date not null,
  linked_transaction_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(12,2) not null,
  type text not null check (type in ('income', 'expense')),
  date date not null,
  recurrence text not null check (recurrence in ('one-time', 'weekly', 'biweekly', 'monthly', 'yearly')),
  recurrence_end_date date,
  linked_debt_id uuid references debts(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add the foreign key from debts to transactions now that transactions exists
alter table debts
  add constraint debts_linked_transaction_id_fkey
  foreign key (linked_transaction_id) references transactions(id) on delete set null;

-- Occurrence overrides
create table occurrence_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  transaction_id uuid references transactions(id) on delete cascade not null,
  occurrence_date date not null,
  deleted boolean default false,
  override_name text,
  override_amount numeric(12,2),
  override_type text check (override_type is null or override_type in ('income', 'expense')),
  override_date date,
  unique(transaction_id, occurrence_date)
);

-- Debt payments
create table debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  debt_id uuid references debts(id) on delete cascade not null,
  amount numeric(12,2) not null,
  date date not null,
  created_at timestamptz default now()
);

-- User settings (one row per user)
create table user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_balance numeric(12,2) default 0,
  balance_as_of_date date default current_date,
  forecast_days integer default 30 check (forecast_days in (30, 60, 90)),
  minimum_safe_balance numeric(12,2) default 0
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table transactions enable row level security;
create policy "Users manage own transactions" on transactions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table occurrence_overrides enable row level security;
create policy "Users manage own overrides" on occurrence_overrides
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table debts enable row level security;
create policy "Users manage own debts" on debts
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table debt_payments enable row level security;
create policy "Users manage own debt payments" on debt_payments
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table user_settings enable row level security;
create policy "Users manage own settings" on user_settings
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE SETTINGS ON SIGNUP (via trigger)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
