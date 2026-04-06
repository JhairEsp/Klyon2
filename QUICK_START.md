# 🚀 Quick Start - BizManager

Get up and running in 5 minutes!

## Step 1: Get Supabase Credentials (1 min)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Go to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Add Env Variables (1 min)

In v0, click **Settings → Vars** and add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
```

## Step 3: Setup Database Schema (2 mins)

1. Go to your Supabase Dashboard
2. Open **SQL Editor**
3. Click **New Query**
4. Open `/scripts/001_create_schema.sql` from this project
5. Copy **ALL** the SQL
6. Paste into Supabase SQL Editor
7. Click **Run** (green button)

✅ All tables, indexes, and RLS policies created!

## Step 4: Create SuperAdmin Account (30 secs)

In Supabase **SQL Editor**, run this:

```sql
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'jhairoswaldo@gmail.com',
  crypt('Endgamer123_', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "super_admin"}'::jsonb
);
```

Also run this to create the user record:

```sql
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
) SELECT
  id,
  email,
  'Jhair',
  'Oswaldo',
  'super_admin',
  true,
  now(),
  now()
FROM auth.users WHERE email = 'jhairoswaldo@gmail.com';
```

## Step 5: Test It! (30 secs)

1. Open http://localhost:3000/auth/login
2. Enter:
   - **Email**: `jhairoswaldo@gmail.com`
   - **Password**: `Endgamer123_`
3. Click **Sign In**
4. You should see the Dashboard! 🎉

## 🎯 What You Can Do Now

### Dashboard (`/dashboard`)
- View system stats
- See total businesses & users
- Access admin panels

### Manage Businesses (`/dashboard/admin/businesses`)
- ➕ Create new business
- 📋 View all businesses
- ✏️ Edit business info
- 🗑️ Delete business

### Manage Users (`/dashboard/admin/users`)
- 👥 View all users
- 🔍 Search by email/name
- 📊 See user roles & status
- 🗑️ Delete user

## ✨ Features Working

- ✅ User authentication
- ✅ Role-based access (SuperAdmin only)
- ✅ Business management
- ✅ User management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time data from Supabase
- ✅ Multi-tenant with RLS

## 🛠️ Troubleshooting

### "Supabase URL not configured"
→ Check Settings → Vars has `NEXT_PUBLIC_SUPABASE_URL`

### "User not found"
→ Make sure you ran **BOTH** SQL commands above (auth.users + users table)

### "RLS denies access"
→ Make sure RLS policies were created (check in Supabase: Table → RLS)

### "Login fails"
→ Check email matches exactly: `jhairoswaldo@gmail.com`

## 📚 Learn More

- **Setup Details**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Full Docs**: See [README.md](./README.md)
- **Implementation**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 🚢 Next Steps

Once you're comfortable:

1. **Add restaurant features** (orders, tables, inventory)
2. **Add barbershop features** (appointments, queue, loyalty)
3. **Deploy to Vercel** (1-click setup)
4. **Add team members** via admin panel

---

**Time to first login**: ~5 minutes ⚡
**Time to first business**: < 1 minute ⚡
**Time to production**: 30 minutes ⚡
