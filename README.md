# UKL Frontend - SMK Telkom Malang

> Aplikasi web untuk Uji Kenaikan Level (UKL) 2024/2025  
> Kompetensi: Rekayasa Perangkat Lunak (Frontend)

![React](https://img.shields.io/badge/React-v18-blue) ![Axios](https://img.shields.io/badge/Axios-0.27.2-orange) ![MIT License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fitur

1. **Login Page**  
   - `POST https://dummyjson.com/auth/login`  
   - Input: `username`, `password`  
   - Menyimpan `accessToken`/`refreshToken` dan menampilkan data user

2. **Playlist Page**  
   - `GET https://learn.smktelkom-mlg.sch.id/ukl2/playlists`  
   - Menampilkan daftar playlist: `playlist_name`, `song_count`

3. **Song List Page**  
   - `GET https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song-list/[playlist_id]?search=keyword`  
   - Cari berdasarkan judul atau artis  
   - Daftar lagu per playlist

4. **Song Detail Page**  
   - `GET https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/[song_id]`  
   - Menampilkan video, judul, artis, deskripsi, likes, dan komentar

5. **Tambah Lagu Baru**  
   - `POST https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song`  
   - Form data: `title`, `artist`, `description`, `source`, `thumbnail` (JPG/PNG ≤ 2 MB)
