// ============================================================================
//  gallery.js — DAFTAR FOTO
//
//  CARA MENAMBAH FOTO
//  1. Taruh file di folder  public/images/  (image1.jpg, image2.jpg, ... dst)
//  2. Salin satu blok { ... } di bawah, tempel di akhir daftar, lalu ubah
//     id dan src (id harus unik dan berbeda-beda).
//
//  PENJELASAN PROPERTI
//  id        : nomor unik.
//  src       : lokasi file, selalu diawali "/images/".
//  caption   : tulisan pendek di bawah foto. Kosongkan ("") jika tidak perlu.
//  category  : dipakai untuk tombol filter. Bebas diganti (huruf kecil lebih rapi).
//              Kalau semua foto memakai kategori yang sama, tombol filter hilang.
//  alt       : deskripsi foto untuk pembaca layar. Tuliskan apa yang terlihat.
//  ratio     : bentuk bingkai foto. Contoh: "4/5" (potret), "1/1" (kotak),
//              "4/3" (lanskap), "3/4", "3/2". Isi "auto" untuk memakai
//              rasio asli foto tanpa dipotong.
//  featured  : true = foto ikut tampil sebagai pratinjau di halaman Home
//              (bagian "Little Moments"; yang dipakai maksimal 4 foto).
// ============================================================================

export const galleryIntro = {
  title: "Little Moments",
  text: "Album kecil yang disusun pelan-pelan. Tekan foto untuk melihatnya lebih besar.",
  handNote: "pelan-pelan saja",
  emptyTitle: "Belum ada foto",
  emptyText: "Tambahkan foto ke public/images/ lalu daftarkan di src/data/gallery.js.",
};

export const photos = [
  {
    id: 1,
    src: "/images/image1.jpg",
    caption: "one of my favorite memories",
    category: "memories",
    alt: "Kenangan Rahma Aryani",
    ratio: "4/5",
    featured: true,
  },
  {
    id: 2,
    src: "/images/image2.jpg",
    caption: "",
    category: "moments",
    alt: "Rahma Aryani pada satu momen kecil",
    ratio: "1/1",
    featured: true,
  },
  {
    id: 3,
    src: "/images/image3.jpg",
    caption: "a quiet little moment",
    category: "moments",
    alt: "Momen tenang bersama Rahma Aryani",
    ratio: "3/4",
    featured: true,
  },
  {
    id: 4,
    src: "/images/image4.jpg",
    caption: "",
    category: "memories",
    alt: "Kenangan Rahma Aryani yang keempat",
    ratio: "4/3",
  },
  {
    id: 5,
    src: "/images/image5.jpg",
    caption: "just as it was",
    category: "favorites",
    alt: "Foto favorit Rahma Aryani",
    ratio: "4/5",
    featured: true,
  },
  {
    id: 6,
    src: "/images/image6.jpg",
    caption: "",
    category: "moments",
    alt: "Rahma Aryani pada momen keenam",
    ratio: "1/1",
  },
  {
    id: 7,
    src: "/images/image7.jpg",
    caption: "remember this one?",
    category: "memories",
    alt: "Kenangan Rahma Aryani yang ketujuh",
    ratio: "3/4",
  },
  {
    id: 8,
    src: "/images/image8.jpg",
    caption: "",
    category: "favorites",
    alt: "Foto favorit Rahma Aryani yang kedua",
    ratio: "3/2",
  },
  {
    id: 9,
    src: "/images/image9.jpg",
    caption: "a good day",
    category: "moments",
    alt: "Rahma Aryani pada hari yang menyenangkan",
    ratio: "4/5",
  },
  {
    id: 10,
    src: "/images/image10.jpg",
    caption: "",
    category: "memories",
    alt: "Rahma Aryani yang kesepuluh",
    ratio: "1/1",
  },
  {
    id: 11,
    src: "/images/image11.jpg",
    caption: "",
    category: "moments",
    alt: "Rahma Aryani yang ke Sebelas",
    ratio: "4/5",
  },
  {
    id: 12,
    src: "/images/image12.jpg",
    caption: "",
    category: "memories",
    alt: "Rahma Aryani yang ke Duabelas",
    ratio: "1/1",
  },
  {
    id: 13,
    src: "/images/image13.jpg",
    caption: "",
    category: "favorites",
    alt: "Rahma Aryani yang ke Tiga belas",
    ratio: "3/4",
  },
  {
    id: 14,
    src: "/images/image14.jpg",
    caption: "",
    category: "moments",
    alt: "Rahma Aryani yang ke Empat belas",
    ratio: "4/3",
  },
  {
    id: 15,
    src: "/images/image15.jpg",
    caption: "",
    category: "memories",
    alt: "Rahma Aryani yang ke Lima belas",
    ratio: "4/5",
  },
  {
    id: 16,
    src: "/images/image16.jpg",
    caption: "",
    category: "favorites",
    alt: "Rahma Aryani yang ke Enam belas",
    ratio: "1/1",
  },
  // Lanjutkan pola ini: image11.jpg, image12.jpg, ...
  // { id: 11, src: "/images/image11.jpg", caption: "", category: "memories", alt: "", ratio: "4/5" },
];
