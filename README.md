# Community CMS

Open-source community website and admin CMS built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

The app is designed for churches, local groups, youth communities, clubs, and small organizations that need a public website with editable content, member profiles, events, resources, chat-style messages, videos, and an admin panel.

## Features

- Public site with home, members, activities, calendar, chat, resources, scripture/resource links, and videos
- Admin CMS at `/admin`
- Editable navigation and page titles from the database
- Thai and English content support
- Supabase Postgres with RLS policies
- Supabase Storage uploads for images, files, and videos
- Admin login with signed cookies
- Image upload processing with `sharp`
- Mobile bottom navigation and admin drawer
- No mock content required: production content is intended to come from the database

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Postgres, RLS, and Storage
- Font Awesome
- Sonner
- Sharp

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your own values.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

ADMIN_FALLBACK_USERNAME=admin
ADMIN_FALLBACK_PASSWORD=change-this-password
ADMIN_SECRET=use-a-long-random-secret

NEXT_PUBLIC_ADMIN_DISPLAY=Admin
```

Never commit `.env.local` or any real service-role key.

`ADMIN_FALLBACK_USERNAME` and `ADMIN_FALLBACK_PASSWORD` are always accepted as a fallback admin login, even when stored admin credentials exist in Supabase `admin_settings`. `ADMIN_PASSWORD` is still supported as a legacy fallback if `ADMIN_FALLBACK_PASSWORD` is not set.

## Supabase Setup

Run the SQL files in this order from the Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/storage.sql`
3. `supabase/seed.sql` if you add seed data

`schema.sql` contains tables, indexes, functions, and RLS policies.

`storage.sql` contains the `uploads` bucket and Storage policies.

`seed.sql` is intentionally empty by default. Add optional starter rows there if your project needs them.

## Admin Setup

1. Start the app.
2. Go to `/admin/login`.
3. Log in using `ADMIN_FALLBACK_USERNAME` with `ADMIN_FALLBACK_PASSWORD`.
4. Go to `/admin/settings` and change the admin username/password.
5. Add real content from the admin panel.

After an admin account is saved in the database, the app accepts both the stored Supabase admin credential and the env fallback credential.

## Project Structure

```text
app/
  (site)/              Public website routes
  admin/               Admin CMS routes
  api/admin/           Admin API routes
components/
  admin/               Admin forms, tables, sidebar, upload controls
  sections/            Public site sections
lib/
  data.ts              Database read helpers
  admin-tables.ts      Admin API table and column allow-list
  member-age.ts        Member age and eligibility helpers
  supabase/            Supabase clients
supabase/
  schema.sql           Database schema and RLS
  storage.sql          Storage bucket and policies
  seed.sql             Optional table seed data
public/
  images and static assets
```

## Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Do not prefix service-role keys with `NEXT_PUBLIC_`.
- Do not commit real `.env.local` files.
- Remove personal data before publishing a fork or demo.
- Public visitors use the anon key and can only access data allowed by RLS.
- Admin writes go through server-side API routes after cookie-based admin checks.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npx tsc --noEmit
```

## License

MIT
