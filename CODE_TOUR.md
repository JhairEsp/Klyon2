# 🗺️ Code Tour - BizManager

A guided walkthrough of the codebase to understand how everything works.

---

## 🎯 5-Minute Overview

**BizManager** is a Next.js + Supabase SaaS for managing restaurants and barbershops.

```
User → Login → Dashboard → Manage Businesses/Users
                ↓
           Supabase Auth
                ↓
           Verify Role
                ↓
        Fetch Data with RLS
                ↓
           Display UI
```

---

## 📂 File Structure Explained

```
app/
├── auth/
│   ├── login/page.tsx              ← User login form
│   ├── signup/page.tsx             ← Signup (disabled)
│   └── callback/route.ts           ← OAuth callback
│
├── dashboard/
│   ├── page.tsx                    ← Main dashboard (SuperAdmin only)
│   ├── layout.tsx                  ← Layout wrapper
│   └── admin/
│       ├── businesses/page.tsx    ← CRUD businesses
│       └── users/page.tsx         ← CRUD users
│
└── layout.tsx                      ← Root HTML structure

lib/
├── supabase/
│   ├── client.ts                  ← Browser Supabase client
│   ├── server.ts                  ← Server Supabase client
│   └── middleware.ts              ← Route protection
│
├── types.ts                       ← TypeScript interfaces
└── utils.ts                       ← Helper functions

scripts/
└── 001_create_schema.sql         ← Database tables + RLS

documents/
├── README.md                     ← Setup guide
├── QUICK_START.md               ← Get started (5 min)
├── SUPABASE_SETUP.md            ← Database config
├── IMPLEMENTATION_SUMMARY.md    ← Technical details
└── CODE_TOUR.md                 ← This file
```

---

## 🔐 Authentication Flow

### Step 1: User Visits Login Page
```
URL: /auth/login
File: app/auth/login/page.tsx
├─ Shows email + password form
├─ On submit: calls supabase.auth.signInWithPassword()
└─ If success: redirects to /dashboard
```

### Step 2: Supabase Verifies Credentials
```
Supabase Auth checks:
├─ Email exists in auth.users table
├─ Password matches (bcrypt)
└─ Creates session + JWT token
```

### Step 3: Dashboard Checks Authorization
```
File: app/dashboard/page.tsx
├─ Gets session with supabase.auth.getSession()
├─ Checks email === 'jhairoswaldo@gmail.com'
├─ If not super_admin: redirects to /auth/login
└─ Shows dashboard if authorized
```

### Step 4: User Logs Out
```
Button click → supabase.auth.signOut() → Redirects to /auth/login
```

---

## 🏢 Business Management Flow

### Create Business
```
File: app/dashboard/admin/businesses/page.tsx

1. User clicks "Nuevo" button
   ↓
2. Form appears with fields:
   - name, type, email, phone, address, city
   ↓
3. User submits form
   ↓
4. Code calls:
   await supabase.from('businesses').insert([formData])
   ↓
5. Supabase checks RLS policy:
   - Is user super_admin? YES → Allow
   - Is user owner? YES → Allow
   - Otherwise → Deny
   ↓
6. Business saved to database
   ↓
7. List refreshes with new business
```

### Read Businesses
```
File: app/dashboard/admin/businesses/page.tsx

useEffect(() => {
  fetchBusinesses();
}, []);

const fetchBusinesses = async () => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*');
  
  // RLS Policy automatically filters:
  // - Super admin: sees ALL businesses
  // - Other users: sees only their business
  
  setBusinesses(data);
};
```

### Update Business
```
// Not yet implemented in UI
// When ready: use .update() instead of .insert()
const { error } = await supabase
  .from('businesses')
  .update(updatedData)
  .eq('id', businessId);
```

### Delete Business
```
File: app/dashboard/admin/businesses/page.tsx

const handleDelete = async (id: string) => {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);
  
  // RLS checks: must be owner or super_admin
  // If denied: error returned
  // If success: deleted from database
  
  fetchBusinesses(); // Refresh list
};
```

---

## 👥 User Management Flow

### Similar to Businesses
```
File: app/dashboard/admin/users/page.tsx

CRUD Operations:
├─ Create: .insert([userData])
├─ Read:  .select('*')
├─ Update: .update(userData).eq('id', userId)
└─ Delete: .delete().eq('id', userId)

All operations checked by RLS policies
```

---

## 🔒 Row Level Security (RLS) Example

### SQL Policy
```sql
CREATE POLICY "super_admin_all_businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
```

### What This Means
```
If user role = 'super_admin':
  └─ Can SELECT, INSERT, UPDATE, DELETE all businesses

If user role = 'admin':
  └─ Denied (policy doesn't apply)
  └─ But they might have other policies
```

### Real Example
```
User Login: jhairoswaldo@gmail.com
   ↓
Check users table WHERE email = 'jhairoswaldo@gmail.com'
   ↓
Find: role = 'super_admin'
   ↓
Try to SELECT from businesses
   ↓
Supabase checks: Is this user super_admin?
   ↓
YES! → Returns all rows
```

---

## 💾 Database Client Setup

### Browser Client (Client-Side)
```typescript
// File: lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Usage in components:
const supabase = createClient();
const { data } = await supabase.from('businesses').select();
```

### Server Client (Server-Side)
```typescript
// File: lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (await cookies()).getAll()
        },
        // ...
      }
    }
  )

// Usage in server components:
const supabase = await createClient();
const { data } = await supabase.from('businesses').select();
```

---

## 🎨 Component Structure

### Dashboard Page
```typescript
// File: app/dashboard/page.tsx

'use client'

export default function DashboardPage() {
  // 1. Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  // 2. Check role
  if (!isSuperAdmin) {
    return <AccessDenied />;
  }

  // 3. Show dashboard
  return (
    <div>
      <Header />
      <Stats />
      <QuickLinks />
    </div>
  );
}
```

### Businesses Page
```typescript
// File: app/dashboard/admin/businesses/page.tsx

'use client'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch businesses on mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // 2. Helper functions for CRUD
  const fetchBusinesses = async () => { ... };
  const handleSubmit = async () => { ... };
  const handleDelete = async () => { ... };

  // 3. Render UI
  if (loading) return <Spinner />;
  return (
    <div>
      <Header />
      <Form />
      <List />
    </div>
  );
}
```

---

## 📊 Data Flow Example

### User Creates a Business

```
User fills form (name="Taco King", type="restaurant")
         ↓
Clicks "Create" button
         ↓
handleSubmit() called
         ↓
supabase.from('businesses').insert([{ name, type, ... }])
         ↓
Request sent to Supabase with session token
         ↓
Supabase checks RLS policy:
   - Gets auth.uid() from token
   - Queries users table: role = 'super_admin'?
   - If YES: allows insert
   - If NO: returns "Permission Denied"
         ↓
If allowed: Business inserted into businesses table
         ↓
Return response to client
         ↓
Client calls fetchBusinesses()
         ↓
Data fetched with RLS filters applied
         ↓
setState(businesses) updates state
         ↓
UI re-renders with new business in list
```

---

## 🚀 Environment Variables

### What They Do
```
NEXT_PUBLIC_SUPABASE_URL
├─ URL of your Supabase project
├─ Example: https://xxxx.supabase.co
└─ PUBLIC (safe to expose)

NEXT_PUBLIC_SUPABASE_ANON_KEY
├─ Public API key for anonymous users
├─ Example: eyJhbGciOi...
└─ PUBLIC (safe to expose)
```

### Where They Go
```
Local development:
  → .env.local file

Vercel production:
  → Settings → Vars

Supabase:
  → They already know these
  → Just verify in console
```

---

## 🧪 Testing a Feature

### Example: Test Businesses CRUD

```typescript
// 1. Open browser DevTools (F12)
// 2. Go to /dashboard/admin/businesses
// 3. You should see empty list or existing businesses
// 4. Click "Nuevo" to show form
// 5. Fill in:
//    - Name: "Test Restaurant"
//    - Type: "restaurant"
//    - Email: "test@example.com"
// 6. Click "Create"
// 7. Check the database:
//    - Supabase → Table Editor → businesses
//    - You should see the new row
// 8. Go back to page, refresh
// 9. New business appears in list ✅
// 10. Click delete
// 11. Business removed ✅
```

---

## 📱 Responsive Design Code

### Example: Grid Layout
```typescript
// Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {businesses.map(business => (
    <Card key={business.id} {...} />
  ))}
</div>
```

### Example: Button Responsiveness
```typescript
// Mobile: icon only, Desktop: icon + text
<Button className="gap-2">
  <Plus className="h-4 w-4" />
  <span className="hidden sm:inline">Nuevo</span>
</Button>
```

---

## 🔍 Debugging Tips

### 1. Check Authentication
```javascript
// In browser console:
const { data: { session } } = await supabase.auth.getSession();
console.log(session); // Should show user + token
```

### 2. Check User Role
```javascript
// In browser console:
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'jhairoswaldo@gmail.com');
console.log(data); // Should show role: 'super_admin'
```

### 3. Check RLS Policies
```javascript
// Try a query that should fail:
const { data, error } = await supabase
  .from('businesses')
  .select('*');
  
console.log(error); // Should show "new row violates row-level security policy"
                    // or data should return successfully
```

### 4. Check Console for Errors
```javascript
// Press F12 to open DevTools
// Click "Console" tab
// Look for red errors
// Click to expand for details
```

---

## 🎓 Code Reading Guide

**If you want to understand a specific feature:**

1. **Login**: 
   - Start: `/app/auth/login/page.tsx`
   - Read: How form submits
   - Check: `supabase.auth.signInWithPassword()`

2. **Dashboard**:
   - Start: `/app/dashboard/page.tsx`
   - Read: Role checking logic
   - Check: Permission validation

3. **Business CRUD**:
   - Start: `/app/dashboard/admin/businesses/page.tsx`
   - Read: Fetch, create, delete logic
   - Check: RLS in action

4. **Database**:
   - Start: `/scripts/001_create_schema.sql`
   - Read: Table structure
   - Check: RLS policies

---

## 💡 Pro Tips

### Tip 1: Use Supabase Console
```
Go to supabase.com → Your Project
├─ Table Editor: See data
├─ SQL Editor: Run queries
├─ Auth: Manage users
└─ Policies: Check RLS
```

### Tip 2: Browser Console Queries
```javascript
// Quick test queries
const { data } = await supabase
  .from('businesses')
  .select('*')
  .limit(5);
```

### Tip 3: TypeScript for Safety
```typescript
// Get autocomplete for all columns
const { data } = await supabase
  .from('users')
  .select('email, role, first_name') // IDE autocompletes!
  .single();
```

### Tip 4: Add Console Logs
```typescript
console.log("[v0] User:", user);
console.log("[v0] Businesses:", businesses);
console.log("[v0] Error:", error);
```

---

## 🚀 Next Development Steps

### 1. Add Restaurant Features
```typescript
// File: app/restaurant/[businessId]/orders/page.tsx
// What: Order management interface
// How: Similar to businesses page
```

### 2. Add Barbershop Features
```typescript
// File: app/barbershop/[businessId]/appointments/page.tsx
// What: Appointment booking
// How: Calendar + queue management
```

### 3. Add Real-Time Updates
```typescript
// Use Supabase Realtime
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => console.log('New order:', payload)
  )
  .subscribe();
```

---

## 📚 Further Learning

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

**Happy coding! 🚀**

*Last Updated: April 5, 2026*
