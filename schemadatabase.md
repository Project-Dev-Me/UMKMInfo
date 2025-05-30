
# Database Schema untuk Aplikasi UMKM

## Overview
Database schema ini dirancang untuk mendukung aplikasi UMKM (Usaha Mikro, Kecil, dan Menengah) yang memungkinkan pengguna untuk mendaftar, mengelola UMKM mereka, dan berinteraksi dengan UMKM lain melalui ulasan dan rating.

## Tables

### 1. users
Tabel untuk menyimpan informasi pengguna aplikasi.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik pengguna |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email pengguna |
| password | VARCHAR(255) | NOT NULL | Password yang di-hash |
| full_name | VARCHAR(255) | NOT NULL | Nama lengkap pengguna |
| phone | VARCHAR(20) | | Nomor telepon |
| avatar_url | TEXT | | URL foto profil |
| is_verified | BOOLEAN | DEFAULT FALSE | Status verifikasi akun |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan akun |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

### 2. umkm
Tabel untuk menyimpan informasi UMKM yang didaftarkan oleh pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik UMKM |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | ID pemilik UMKM |
| name | VARCHAR(255) | NOT NULL | Nama UMKM |
| description | TEXT | | Deskripsi UMKM |
| category | VARCHAR(100) | NOT NULL | Kategori UMKM (makanan, fashion, kerajinan, dll) |
| address | TEXT | NOT NULL | Alamat lengkap UMKM |
| latitude | DECIMAL(10,8) | | Koordinat latitude |
| longitude | DECIMAL(11,8) | | Koordinat longitude |
| phone | VARCHAR(20) | | Nomor telepon UMKM |
| whatsapp | VARCHAR(20) | | Nomor WhatsApp |
| email | VARCHAR(255) | | Email UMKM |
| website | TEXT | | Website UMKM |
| image_url | TEXT | | URL gambar utama UMKM |
| opening_hours | JSON | | Jam operasional (format JSON) |
| status | ENUM('pending', 'active', 'suspended') | DEFAULT 'pending' | Status UMKM |
| is_verified | BOOLEAN | DEFAULT FALSE | Status verifikasi UMKM |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pendaftaran |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

### 3. products
Tabel untuk menyimpan produk/layanan yang ditawarkan oleh UMKM.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik produk |
| umkm_id | INTEGER | FOREIGN KEY REFERENCES umkm(id) | ID UMKM pemilik |
| name | VARCHAR(255) | NOT NULL | Nama produk |
| description | TEXT | | Deskripsi produk |
| price | DECIMAL(10,2) | | Harga produk |
| image_url | TEXT | | URL gambar produk |
| is_available | BOOLEAN | DEFAULT TRUE | Status ketersediaan |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

### 4. reviews
Tabel untuk menyimpan ulasan pengguna terhadap UMKM.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik ulasan |
| umkm_id | INTEGER | FOREIGN KEY REFERENCES umkm(id) | ID UMKM yang diulas |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | ID pengguna yang memberikan ulasan |
| rating | INTEGER | CHECK(rating >= 1 AND rating <= 5) | Rating 1-5 bintang |
| comment | TEXT | | Komentar ulasan |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan ulasan |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

### 5. categories
Tabel untuk menyimpan kategori UMKM yang tersedia.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik kategori |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Nama kategori |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | Slug untuk URL |
| icon | VARCHAR(50) | | Icon kategori |
| description | TEXT | | Deskripsi kategori |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif kategori |

### 6. favorites
Tabel untuk menyimpan UMKM favorit pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik favorit |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | ID pengguna |
| umkm_id | INTEGER | FOREIGN KEY REFERENCES umkm(id) | ID UMKM favorit |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu ditambahkan ke favorit |

### 7. notifications
Tabel untuk menyimpan notifikasi pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik notifikasi |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | ID penerima notifikasi |
| title | VARCHAR(255) | NOT NULL | Judul notifikasi |
| message | TEXT | NOT NULL | Isi notifikasi |
| type | ENUM('info', 'success', 'warning', 'error') | DEFAULT 'info' | Tipe notifikasi |
| is_read | BOOLEAN | DEFAULT FALSE | Status sudah dibaca |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |

### 8. user_settings
Tabel untuk menyimpan pengaturan pengguna.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unik pengaturan |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) | ID pengguna |
| notifications_enabled | BOOLEAN | DEFAULT TRUE | Status notifikasi aktif |
| language | VARCHAR(10) | DEFAULT 'id' | Bahasa aplikasi |
| theme | VARCHAR(20) | DEFAULT 'light' | Tema aplikasi |
| location_sharing | BOOLEAN | DEFAULT FALSE | Berbagi lokasi |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu update terakhir |

## Relationships

### One-to-Many Relationships:
- `users` → `umkm` (Satu pengguna dapat memiliki banyak UMKM)
- `umkm` → `products` (Satu UMKM dapat memiliki banyak produk)
- `umkm` → `reviews` (Satu UMKM dapat memiliki banyak ulasan)
- `users` → `reviews` (Satu pengguna dapat memberikan banyak ulasan)
- `users` → `favorites` (Satu pengguna dapat memiliki banyak favorit)
- `users` → `notifications` (Satu pengguna dapat memiliki banyak notifikasi)
- `users` → `user_settings` (Satu pengguna memiliki satu pengaturan)

### Many-to-Many Relationships:
- `users` ↔ `umkm` (melalui tabel `favorites`)

## Indexes
Untuk optimasi performa, index berikut disarankan:

```sql
-- Index untuk pencarian berdasarkan kategori
CREATE INDEX idx_umkm_category ON umkm(category);

-- Index untuk pencarian berdasarkan lokasi
CREATE INDEX idx_umkm_location ON umkm(latitude, longitude);

-- Index untuk pencarian berdasarkan status
CREATE INDEX idx_umkm_status ON umkm(status);

-- Index untuk ulasan berdasarkan UMKM
CREATE INDEX idx_reviews_umkm_id ON reviews(umkm_id);

-- Index untuk favorit berdasarkan pengguna
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Index untuk produk berdasarkan UMKM
CREATE INDEX idx_products_umkm_id ON products(umkm_id);

-- Index untuk notifikasi berdasarkan pengguna
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

## Sample Data Structure

### Contoh data kategori:
```json
[
  {"name": "Makanan & Minuman", "slug": "makanan-minuman", "icon": "utensils"},
  {"name": "Fashion & Pakaian", "slug": "fashion-pakaian", "icon": "shirt"},
  {"name": "Kerajinan Tangan", "slug": "kerajinan-tangan", "icon": "palette"},
  {"name": "Jasa", "slug": "jasa", "icon": "tools"},
  {"name": "Elektronik", "slug": "elektronik", "icon": "smartphone"},
  {"name": "Kesehatan & Kecantikan", "slug": "kesehatan-kecantikan", "icon": "heart"}
]
```

### Contoh struktur jam operasional (JSON):
```json
{
  "monday": {"open": "08:00", "close": "17:00", "is_closed": false},
  "tuesday": {"open": "08:00", "close": "17:00", "is_closed": false},
  "wednesday": {"open": "08:00", "close": "17:00", "is_closed": false},
  "thursday": {"open": "08:00", "close": "17:00", "is_closed": false},
  "friday": {"open": "08:00", "close": "17:00", "is_closed": false},
  "saturday": {"open": "09:00", "close": "15:00", "is_closed": false},
  "sunday": {"open": "", "close": "", "is_closed": true}
}
```

## Security Considerations

1. **Password Hashing**: Gunakan bcrypt atau argon2 untuk hashing password
2. **Email Verification**: Implementasi verifikasi email sebelum akun aktif
3. **Rate Limiting**: Batasi jumlah request untuk mencegah spam
4. **Data Validation**: Validasi semua input di level aplikasi dan database
5. **Soft Delete**: Implementasi soft delete untuk data penting
6. **Audit Trail**: Catat perubahan penting untuk audit

## Backup Strategy

1. **Daily Backup**: Backup harian untuk data utama
2. **Incremental Backup**: Backup incremental setiap 6 jam
3. **Geographic Redundancy**: Simpan backup di lokasi berbeda
4. **Recovery Testing**: Test recovery procedure secara berkala

Ini adalah schema database yang komprehensif untuk aplikasi UMKM Anda. Schema ini dapat diimplementasikan menggunakan SQLite untuk development atau PostgreSQL/MySQL untuk production.
