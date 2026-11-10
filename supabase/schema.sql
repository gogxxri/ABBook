-- 에이비북 Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 전체 붙여넣고 한 번 실행하세요.

create extension if not exists pgcrypto;

-- =========================================================
-- 관리자
-- =========================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- 현재 로그인 사용자가 관리자인지
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- =========================================================
-- 단가표
-- =========================================================
create table if not exists public.price_categories (
  id bigint generated always as identity primary key,
  key text not null unique,
  label text not null,
  sort_order int not null default 0
);

create table if not exists public.price_items (
  id bigint generated always as identity primary key,
  category_id bigint not null references public.price_categories (id) on delete cascade,
  name text not null,
  keywords text not null default '',      -- AI 견적 매칭용 키워드 (쉼표 구분)
  price int not null check (price >= 0),
  updated_at timestamptz not null default now()
);

alter table public.price_categories enable row level security;
alter table public.price_items enable row level security;

drop policy if exists "categories public read" on public.price_categories;
create policy "categories public read" on public.price_categories for select using (true);
drop policy if exists "categories admin write" on public.price_categories;
create policy "categories admin write" on public.price_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "items public read" on public.price_items;
create policy "items public read" on public.price_items for select using (true);
drop policy if exists "items admin write" on public.price_items;
create policy "items admin write" on public.price_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- 매입문의 (비밀번호 글)
-- =========================================================
create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 100),
  content text not null check (char_length(content) between 1 and 5000),
  author_name text not null check (char_length(author_name) between 1 and 20),
  password_hash text not null,
  status text not null default 'waiting' check (status in ('waiting', 'answered')),
  answer text,
  answered_at timestamptz,
  photo_paths text[] not null default '{}',  -- inquiry-photos 버킷 내 경로 (최대 5장)
  created_at timestamptz not null default now()
);

-- 기존 테이블에 사진 컬럼 추가 (재실행 대비)
alter table public.inquiries add column if not exists photo_paths text[] not null default '{}';

alter table public.inquiries enable row level security;

-- 일반 사용자는 테이블 직접 접근 불가, 관리자만 전체 접근
drop policy if exists "inquiries admin all" on public.inquiries;
create policy "inquiries admin all" on public.inquiries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 공개 목록 (본문·비밀번호 제외, 작성자 마스킹)
create or replace view public.inquiry_list
with (security_invoker = false) as
select
  id,
  title,
  left(author_name, 1) || repeat('*', greatest(char_length(author_name) - 1, 1)) as author_masked,
  status,
  created_at
from public.inquiries;

grant select on public.inquiry_list to anon, authenticated;

-- 문의 등록
drop function if exists public.create_inquiry(text, text, text, text);
create or replace function public.create_inquiry(
  p_title text,
  p_content text,
  p_author text,
  p_password text,
  p_photo_paths text[] default '{}'
)
returns bigint
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_id bigint;
begin
  if char_length(coalesce(p_password, '')) < 4 then
    raise exception '비밀번호는 4자 이상이어야 합니다.';
  end if;

  if coalesce(array_length(p_photo_paths, 1), 0) > 5 then
    raise exception '사진은 최대 5장까지 첨부할 수 있습니다.';
  end if;

  if exists (select 1 from unnest(p_photo_paths) as path where path not like 'inquiries/%') then
    raise exception '잘못된 사진 경로입니다.';
  end if;

  insert into public.inquiries (title, content, author_name, password_hash, photo_paths)
  values (p_title, p_content, p_author, crypt(p_password, gen_salt('bf')), coalesce(p_photo_paths, '{}'))
  returning id into new_id;

  return new_id;
end;
$$;

-- 비밀번호 확인 후 문의 상세 조회
drop function if exists public.get_inquiry(bigint, text);
create or replace function public.get_inquiry(p_id bigint, p_password text)
returns table (id bigint, title text, content text, author_name text, status text, answer text, answered_at timestamptz, photo_paths text[], created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select i.id, i.title, i.content, i.author_name, i.status, i.answer, i.answered_at, i.photo_paths, i.created_at
  from public.inquiries i
  where i.id = p_id and i.password_hash = crypt(p_password, i.password_hash);

  if not found then
    raise exception '비밀번호가 일치하지 않습니다.';
  end if;
end;
$$;

-- 비밀번호 확인 후 문의 삭제
create or replace function public.delete_inquiry(p_id bigint, p_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  delete from public.inquiries
  where id = p_id and password_hash = crypt(p_password, password_hash);

  if not found then
    raise exception '비밀번호가 일치하지 않습니다.';
  end if;
end;
$$;

grant execute on function public.create_inquiry(text, text, text, text, text[]) to anon, authenticated;
grant execute on function public.get_inquiry(bigint, text) to anon, authenticated;
grant execute on function public.delete_inquiry(bigint, text) to anon, authenticated;

-- =========================================================
-- 매입신청
-- =========================================================
create table if not exists public.purchase_requests (
  id bigint generated always as identity primary key,
  customer_name text not null check (char_length(customer_name) between 1 and 30),
  phone text not null check (char_length(phone) between 8 and 20),
  method text not null check (method in ('visit', 'parcel', 'store', 'quick')),
  items_text text not null default '',
  estimate_total int not null default 0,
  photo_path text,
  memo text,
  status text not null default 'received' check (status in ('received', 'inspecting', 'completed', 'canceled')),
  admin_memo text,
  created_at timestamptz not null default now()
);

alter table public.purchase_requests enable row level security;

drop policy if exists "requests public insert" on public.purchase_requests;
create policy "requests public insert" on public.purchase_requests for insert to anon, authenticated
  with check (status = 'received' and admin_memo is null);

drop policy if exists "requests admin read" on public.purchase_requests;
create policy "requests admin read" on public.purchase_requests for select to authenticated using (public.is_admin());

drop policy if exists "requests admin update" on public.purchase_requests;
create policy "requests admin update" on public.purchase_requests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "requests admin delete" on public.purchase_requests;
create policy "requests admin delete" on public.purchase_requests for delete to authenticated using (public.is_admin());

-- =========================================================
-- 매입후기
-- =========================================================
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  title text not null,
  items text not null default '',
  region text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (is_published or public.is_admin());
drop policy if exists "reviews admin write" on public.reviews;
create policy "reviews admin write" on public.reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- 매입신청 사진 저장소 (비공개)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('request-photos', 'request-photos', false)
on conflict (id) do nothing;

drop policy if exists "request photos public upload" on storage.objects;
create policy "request photos public upload" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'request-photos');

-- =========================================================
-- 문의 사진 저장소 (비공개: 작성자는 Edge Function 경유, 관리자는 직접 열람)
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('inquiry-photos', 'inquiry-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "inquiry photos public upload" on storage.objects;
create policy "inquiry photos public upload" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'inquiry-photos' and (storage.foldername(name))[1] = 'inquiries');

drop policy if exists "inquiry photos admin read" on storage.objects;
create policy "inquiry photos admin read" on storage.objects for select to authenticated
  using (bucket_id = 'inquiry-photos' and public.is_admin());

drop policy if exists "request photos admin read" on storage.objects;
create policy "request photos admin read" on storage.objects for select to authenticated
  using (bucket_id = 'request-photos' and public.is_admin());

-- =========================================================
-- 기본 단가표 카테고리
-- =========================================================
insert into public.price_categories (key, label, sort_order) values
  ('laptop', '노트북', 1), ('apple', '애플 기기', 2), ('ram', 'RAM', 3), ('ssd', 'SSD', 4),
  ('hdd', 'HDD', 5), ('cpu', 'CPU', 6), ('vga', '그래픽카드', 7), ('board', '메인보드', 8),
  ('power', '파워', 9), ('monitor', '모니터', 10), ('server', '서버', 11), ('game', '게임기', 12),
  ('tablet', '태블릿', 13)
on conflict (key) do nothing;
