
# Integrasi Database Supabase

## Apa yang Diperlukan

### 1. Setup Supabase Project
- Buat akun di [Supabase](https://supabase.com)
- Buat project baru di dashboard Supabase
- Dapatkan URL database dan API Key dari project settings

### 2. Environment Variables
Tambahkan ke Replit Secrets:
- `DATABASE_URL`: Connection string PostgreSQL dari Supabase
- `SUPABASE_URL`: URL project Supabase
- `SUPABASE_ANON_KEY`: Public anon key dari Supabase
- `SUPABASE_SERVICE_KEY`: Service role key (untuk operasi admin)

### 3. Dependencies yang Diperlukan
- `@supabase/supabase-js`: Client library Supabase
- Hapus dependency Neon dan ganti dengan Supabase client

### 4. Konfigurasi Database Schema
Berdasarkan `schemadatabase.md` yang sudah ada, buat tabel-tabel berikut di Supabase SQL Editor:

#### Tabel Users
```sql
- id (UUID, primary key)
- email (text, unique)
- password (text, hashed)
- full_name (text)
- phone (text)
- profile_image (text, URL)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tabel UMKM Businesses
```sql
- id (UUID, primary key)
- owner_id (UUID, foreign key ke users)
- name (text)
- description (text)
- category (text)
- address (text)
- phone (text)
- email (text)
- website (text)
- image_url (text)
- rating (decimal)
- status (enum: pending, approved, rejected)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tabel Reviews
```sql
- id (UUID, primary key)
- business_id (UUID, foreign key ke umkm_businesses)
- user_id (UUID, foreign key ke users)
- rating (integer, 1-5)
- comment (text)
- created_at (timestamp)
```

#### Tabel Categories
```sql
- id (UUID, primary key)
- name (text, unique)
- description (text)
- icon (text)
- created_at (timestamp)
```

### 5. Row Level Security (RLS)
Aktifkan RLS pada semua tabel dan buat policies:
- Users dapat read/update profil mereka sendiri
- UMKM owners dapat CRUD bisnis mereka
- Public dapat read approved businesses
- Authenticated users dapat create reviews

### 6. Storage Bucket
Setup bucket untuk upload gambar:
- Buat bucket `umkm-images` untuk foto bisnis
- Buat bucket `profile-images` untuk foto profil
- Set policies untuk upload/read sesuai kebutuhan

### 7. Authentication
Konfigurasi Supabase Auth:
- Enable email/password authentication
- Set redirect URLs untuk development dan production
- Konfigurasi email templates (optional)

### 8. Real-time Features (Optional)
- Enable real-time untuk tabel reviews (live updates)
- Enable real-time untuk notifikasi

### 9. Migrasi Data
Jika ada data existing:
- Export data dari database lama
- Import ke Supabase menggunakan SQL scripts
- Update foreign key relationships

### 10. Code Changes Required
#### Client Side:
- Setup Supabase client di `lib/supabase.ts`
- Update query functions untuk menggunakan Supabase client
- Implement authentication dengan Supabase Auth
- Update form submissions untuk menggunakan Supabase API

#### Server Side:
- Update routes untuk menggunakan Supabase client
- Implement middleware untuk auth verification
- Update CRUD operations untuk Supabase format
- Handle file uploads ke Supabase Storage

### 11. Testing
- Test authentication flow
- Test CRUD operations untuk semua entities
- Test file upload functionality
- Test real-time features
- Test RLS policies

### 12. Deployment Considerations
- Set production environment variables
- Update CORS settings di Supabase
- Configure production redirect URLs
- Test production database performance

## Keuntungan Menggunakan Supabase
1. **Built-in Authentication**: Tidak perlu implement auth dari scratch
2. **Real-time Database**: Otomatis sync data antar client
3. **Storage**: Built-in file storage dengan CDN
4. **Row Level Security**: Database-level security
5. **Auto-generated APIs**: REST dan GraphQL APIs otomatis
6. **Dashboard**: GUI untuk manage database dan users
7. **Scalability**: Auto-scaling infrastructure
8. **Free Tier**: Generous free tier untuk development

## Migration Steps
1. Setup Supabase project dan database schema
2. Install dependencies dan setup client
3. Migrate authentication system
4. Update database operations
5. Implement file upload
6. Test thoroughly
7. Deploy dengan environment variables baru
