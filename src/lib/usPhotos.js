import { usCaptions } from "../data/us.js";

// Membaca semua foto di src/assets/us/ secara otomatis (tanpa daftar manual).
// Urutan mengikuti nama file (us01.jpg, us02.jpg, ...). Folder kosong = halaman
// "Us" dan menunya tidak tampil.
const files = import.meta.glob("../assets/us/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const usPhotos = Object.entries(files)
  .map(([path, src]) => ({ name: path.split("/").pop(), src }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
  .map(({ name, src }, i) => ({
    id: `us-${i + 1}`,
    src,
    caption: usCaptions[name] || "",
    category: "us",
    alt: "Foto kita berdua",
    ratio: "auto", // pakai rasio asli foto, jadi potret & lanskap boleh dicampur
  }));
