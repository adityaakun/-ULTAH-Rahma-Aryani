// Foto berdua otomatis dibaca dari src/assets/us/ (lihat CATATAN-FOTO.txt di folder itu).
import { usPhotos } from "../lib/usPhotos.js";

export const person = {
  name: "Rahma Aryani",
  birthDay: 11,
  birthMonth: 11, // 11 = november
  birthYear: 2009,
  timeZone: "Asia/Jakarta", // countdown selalu mengikuti zona waktu ini
  displayDate: "11.11.2009",
  longDate: "11 November 2009",
  showAge: true, // false = jangan tampilkan umur di countdown / ucapan hari-H
};

// ---- Info situs ------------------------------------------------------------
export const site = {
  title: "Rahma Aryani",
  description:
    "Sebuah sudut kecil di internet, dibuat khusus untuk ulang tahun Rahma Aryani.",
  footerNote: "dibuat dengan sepenuh hati untuk Rahma Aryani",
};

// ---- Fitur on/off (true / false) -------------------------------------------
export const features = {
  // Halaman Wishes (ucapan dari teman).
  //   true  = halaman, menu, dan tombol "Read the wishes" tampil
  //   false = semuanya dihapus; alamat /wishes menjadi "halaman tidak ada"
  wishes: false,
};

// ---- Intro kue (muncul transparan di atas Home, hanya saat awal masuk) -----
// Komponen: src/components/CakeIntro.jsx  |  gaya: src/styles/intro.css
// Hanya kuenya saja (tanpa teks / background). Begitu lagu mulai, balon terbang
// dan dua kupu-kupu mengelilingi kue.
export const landing = {
  enabled: true, // false = intro dimatikan, langsung ke Home
  song: "https://u.pone.rs/qvbbldqa.mp3", // lagu otomatis ("" = tanpa lagu)
  volume: 0.85, // 0 sampai 1
  // Masuk otomatis ke Home setelah sekian detik (lagu selesai juga otomatis masuk).
  // 0 = tidak otomatis. Pengunjung bisa mengetuk layar / Enter untuk masuk lebih cepat.
  autoEnterSeconds: 90,
};

// ---- Menu navigasi ---------------------------------------------------------
// show: false  -> item disembunyikan (diatur lewat "features" di atas)
export const nav = [
  { to: "/home", label: "Home", end: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/us", label: "Us", show: usPhotos.length > 0 },
  { to: "/wishes", label: "Wishes", show: features.wishes },
  { to: "/letter", label: "Letter" },
  { to: "/music", label: "Music" },
].filter((item) => item.show !== false);

// ---- Hero (bagian paling atas halaman Home) --------------------------------
export const hero = {
  handNote: "happy birthday", // tulisan tangan kecil di dekat nama
  headline: "a little corner of the world, just for you",
  description:
    "Tempat kecil ini dibuat untuk merayakan harimu. Ada foto-foto, sebuah surat, dan beberapa lagu. Silakan jalan-jalan pelan-pelan.",
  primaryCta: { label: "Open the gallery", to: "/gallery" },
  // Tombol kedua: Wishes kalau aktif, kalau tidak -> foto berdua (jika sudah ada), kalau tidak ada keduanya -> hilang.
  secondaryCta: features.wishes
    ? { label: "Read the wishes", to: "/wishes" }
    : usPhotos.length > 0
      ? { label: "See us together", to: "/us" }
      : null,
  // Foto utama & foto kecil. Letakkan file di public/images/
  mainPhoto: {
    src: "/images/image1.jpg",
    alt: "Foto Rahma Aryani",
    caption: "",
  },
  secondPhoto: {
    src: "/images/image2.jpg",
    alt: "Foto Rahma Aryani yang kedua",
    caption: "",
  },
  stampText: "Rahma Aryani · 11 November 2009 · happy birthday · ",
};

// ---- Section di halaman Home ----------------------------------------------
export const home = {
  intro: {
    title: "A Little Introduction",
    handNote: "hello, you",
    paragraphs: [
      "Ini adalah halaman kecil yang disiapkan khusus untuk Rahma Aryani. Tidak ada yang rumit di sini, hanya hal-hal yang ingin disimpan dan diberikan di hari ulang tahunnya.",
      // GANTI paragraf di bawah dengan perkenalan singkatmu tentang Rahma Aryani.
      "Tuliskan di sini beberapa kalimat hangat tentang Rahma Aryani, apa adanya, dengan kata-katamu sendiri.",
    ],
    // Daftar kecil di samping teks. Tambah / hapus baris sesukamu.
    facts: [
      { label: "Nama", value: "Rahma Aryani" },
      { label: "Lahir", value: "11 November 2009" },
    ],
  },

  moments: {
    title: "Little Moments",
    text: "Beberapa potongan kecil yang dikumpulkan di satu tempat. Kalau mau lihat semuanya, album lengkapnya ada di halaman Gallery.",
    cta: "See all the photos",
  },

  song: {
    title: "A Song for You",
    text: "Ada satu lagu yang ingin diperdengarkan hari ini. Tekan play kapan pun kamu siap.",
    cta: "Go to the music page",
    emptyTitle: "Lagu pilihan akan muncul di sini",
    emptyText: "Isi link Spotify di src/data/music.js.",
  },

  countdown: {
    title: "Birthday Countdown",
    text: "Menghitung mundur menuju 11 November, tanpa melewatkan satu detik pun.",
    // {age} diganti otomatis dengan umur yang akan dicapai.
    untilTextWithAge: "menuju ulang tahun ke-{age}",
    untilText: "menuju hari ulang tahun",
    unitLabels: { days: "hari", hours: "jam", minutes: "menit", seconds: "detik" },
    // Tampil saat tanggal 11 November sedang berlangsung (zona Asia/Jakarta).
    birthdayTitle: "Selamat ulang tahun, Rahma Aryani",
    birthdayTextWithAge: "Hari ini kamu genap {age} tahun. Semoga harinya menyenangkan dari pagi sampai malam.",
    birthdayText: "Semoga harimu menyenangkan dari pagi sampai malam.",
  },

  note: {
    title: "A Little Note",
    text: "Terima kasih sudah mampir ke sudut kecil ini. Semoga harimu terasa ringan, hangat, dan penuh hal-hal baik.",
    signature: "with care", // kosongkan ("") kalau tidak mau ada tanda tangan
  },
};
