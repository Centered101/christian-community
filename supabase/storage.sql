-- Storage setup
-- Run after schema.sql because storage policies call public.is_admin().

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads_public_read" on storage.objects;
create policy "uploads_public_read"
  on storage.objects for select
  using (bucket_id = 'uploads');

drop policy if exists "uploads_admin_insert" on storage.objects;
create policy "uploads_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'uploads' and public.is_admin());

drop policy if exists "uploads_admin_update" on storage.objects;
create policy "uploads_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'uploads' and public.is_admin())
  with check (bucket_id = 'uploads' and public.is_admin());

drop policy if exists "uploads_admin_delete" on storage.objects;
create policy "uploads_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'uploads' and public.is_admin());
