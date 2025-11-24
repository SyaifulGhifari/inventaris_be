# Product Requirement Document (PRD)

## 1. Overview

Website Gudang Tekstil adalah sistem manajemen inventaris berbasis web yang dirancang khusus untuk mengelola produk tekstil seperti **celana, celana jeans, baju, dan jaket**. Sistem ini memungkinkan admin atau staf gudang untuk melakukan login, melihat daftar produk tekstil, menambah produk baru dengan detail lengkap (ukuran, warna, material), serta mengedit stok produk dengan mudah. Aplikasi ini dibangun menggunakan **Next.js (TypeScript)** dan menggunakan **shadcn/ui** untuk komponen UI.

## 2. Goals

* Mempermudah pengelolaan stok gudang tekstil secara cepat dan akurat.
* Menyediakan sistem kategorisasi produk tekstil yang jelas (Celana, Celana Jeans, Baju, Jaket).
* Memudahkan pencarian produk berdasarkan kategori, ukuran, warna, dan material.
* Menyediakan antarmuka yang ramah pengguna, responsif, dan efisien.
* Memastikan keamanan data melalui sistem autentikasi login/logout.

## 3. Target Users

* Admin gudang tekstil
* Staf gudang tekstil
* Manager inventory

## 4. Core Features

### 4.1 Autentikasi

* **Login** menggunakan email & password.
* **Logout** dan destroy session.
* Proteksi halaman (hanya bisa diakses setelah login).

### 4.2 Manajemen Produk Tekstil

* **Melihat daftar produk** dengan pagination dan filtering.
* **Filter berdasarkan**:
  * Kategori (Celana, Celana Jeans, Baju, Jaket)
  * Ukuran (XS, S, M, L, XL, XXL, XXXL)
  * Warna
  * Material
* **Table** berisi kolom:
  * ID Produk
  * Nama Produk
  * Kategori (Celana / Celana Jeans / Baju / Jaket)
  * Ukuran
  * Warna
  * Material
  * Stok
  * Harga
  * Aksi (Edit, Delete)
* **Menambahkan produk baru** melalui form dengan field:
  * Nama Produk
  * Kategori (dropdown: Celana, Celana Jeans, Baju, Jaket)
  * Ukuran (multi-select atau input manual)
  * Warna
  * Material (contoh: Katun, Denim, Polyester, Wool, dll)
  * Stok awal
  * Harga
  * Deskripsi (optional)
  * Gambar produk (optional)
* **Edit produk**, termasuk:
  * Mengubah stok (tambah/kurang)
  * Update informasi produk (harga, deskripsi, dll)
* **Delete produk** dengan konfirmasi.
* **Search produk** berdasarkan nama atau ID.

### 4.3 Dashboard & Statistik

* **Total stok** per kategori (Celana, Celana Jeans, Baju, Jaket)
* **Produk dengan stok rendah** (alert jika stok < threshold tertentu)
* **Grafik stok** per kategori (optional)
* **Riwayat perubahan stok** (log aktivitas)

### 4.4 UX Requirements

* UI menggunakan komponen **shadcn/ui** (Table, Button, Input, Dialog, Pagination, Select, Badge).
* Navigasi sederhana dan mudah dipahami.
* Validasi form pada saat input data.
* Loading state & empty state.
* Responsive design untuk mobile dan desktop.
* Badge untuk kategori produk dengan warna berbeda:
  * Celana: Blue
  * Celana Jeans: Indigo
  * Baju: Green
  * Jaket: Orange

## 5. Technical Requirements

* Framework: **Next.js (TypeScript)**
* Styling dan UI: **shadcn/ui**, Tailwind CSS
* State Management: Built-in React hooks (useState, useEffect) atau Zustand jika dibutuhkan
* Pagination diimplementasikan server-side (SSR) atau client-side sesuai kebutuhan performa.
* Form validation menggunakan **React Hook Form** + **Zod**
* Database: PostgreSQL / MySQL / MongoDB (sesuai kebutuhan backend)

## 6. Page Structure

### 6.1 `/login`

* Form login (email, password)
* Button Login
* Validasi error
* Remember me checkbox (optional)

### 6.2 `/dashboard`

* **Navbar** dengan:
  * Logo/Brand
  * Menu navigasi (Dashboard, Produk, Laporan)
  * User profile dropdown
  * Tombol Logout
* **Statistik Cards**:
  * Total Produk
  * Total Stok Celana
  * Total Stok Celana Jeans
  * Total Stok Baju
  * Total Stok Jaket
  * Produk Stok Rendah
* **Quick Actions**:
  * Tombol "Tambah Produk Baru"
  * Tombol "Lihat Semua Produk"

### 6.3 `/products`

* **Filter Section**:
  * Dropdown Kategori (All, Celana, Celana Jeans, Baju, Jaket)
  * Dropdown Ukuran (All, XS, S, M, L, XL, XXL, XXXL)
  * Input Search (nama produk)
  * Button Reset Filter
* **Table daftar produk** dengan kolom:
  * ID
  * Gambar (thumbnail)
  * Nama Produk
  * Kategori (dengan badge berwarna)
  * Ukuran
  * Warna
  * Material
  * Stok (dengan warning jika < 10)
  * Harga
  * Aksi (Edit, Delete)
* **Pagination** (Next / Previous / Page Numbers)
* **Tombol "Tambah Produk"** (floating atau di header)
* **Modal Form Add Product** dengan field lengkap

### 6.4 `/products/add` atau Modal Add Product

* Form dengan field:
  * Nama Produk (required)
  * Kategori (required, dropdown)
  * Ukuran (required, multi-select atau chips)
  * Warna (required)
  * Material (required)
  * Stok Awal (required, number)
  * Harga (required, currency format)
  * Deskripsi (optional, textarea)
  * Upload Gambar (optional)
* Button Save & Cancel
* Validasi real-time

### 6.5 `/products/[id]/edit`

* Form edit dengan semua field produk
* Khusus untuk stok, ada opsi:
  * Set stok baru (replace)
  * Tambah stok (+)
  * Kurangi stok (-)
* Button Save & Cancel
* Konfirmasi sebelum save

### 6.6 `/reports` (Optional)

* Laporan stok per kategori
* Export data ke Excel/CSV
* Filter berdasarkan tanggal

## 7. Data Model (Produk Tekstil)

```typescript
interface Product {
  id: string;
  name: string;
  category: 'Celana' | 'Celana Jeans' | 'Baju' | 'Jaket';
  sizes: string[]; // ['S', 'M', 'L', 'XL']
  color: string;
  material: string; // 'Katun', 'Denim', 'Polyester', dll
  stock: number;
  price: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // user ID
}
```

## 8. Success Metrics

* Waktu input data produk tekstil lebih cepat 40%
* Pengurangan error data stok hingga 80%
* Akses mudah dan cepat oleh staf gudang
* Kemudahan dalam filtering produk berdasarkan kategori tekstil
* Peningkatan akurasi inventory produk tekstil

## 9. Future Enhancements (Optional)

* **Role management** (admin, staff, viewer)
* **Export data** ke Excel/CSV dengan filter
* **Barcode/QR scanner integration** untuk input produk cepat
* **Log aktivitas produk** (history perubahan stok)
* **Notifikasi stok rendah** via email/WhatsApp
* **Multi-warehouse support** (jika ada beberapa gudang)
* **Supplier management** untuk tracking asal produk
* **Batch import** produk via Excel/CSV
* **Advanced analytics** (produk terlaris, trend kategori, dll)
* **Mobile app** untuk staf gudang
* **Integration dengan e-commerce** untuk sync stok otomatis