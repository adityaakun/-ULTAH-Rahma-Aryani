import { useEffect, useState } from "react";
import { computeCountdown } from "../lib/countdown.js";
import { person, home } from "../data/birthday.js";

const cfg = home.countdown;

// Ganti placeholder seperti {age} dengan nilai dari objek values.
function fill(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

// Menjaga angka tetap rata dan tidak menggeser layout saat nilainya berubah.
function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

/**
 * Countdown ulang tahun Cypiaa.
 *
 * Catatan untuk recode:
 * - Tanggal lahir, zona waktu, dan teks diatur di src/data/birthday.js.
 * - Perhitungan waktu ada di src/lib/countdown.js; jangan duplikasi rumus di sini.
 * - Komponen ini hanya mengurus state, pembaruan berkala, dan tampilan.
 * - Pertahankan nama class CSS di bawah jika styling components.css tidak ikut diubah.
 */
export default function Countdown() {
  const [state, setState] = useState(() => computeCountdown(new Date(), person));

  useEffect(() => {
    let timerId;

    // Selaraskan update dengan pergantian detik agar countdown tidak terus bergeser.
    const tick = () => {
      setState(computeCountdown(new Date(), person));
      timerId = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    };

    // Hitung segera ketika komponen dipasang, bukan menunggu satu detik pertama.
    setState(computeCountdown(new Date(), person));
    timerId = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 8);

    // Tab yang lama tidak aktif bisa menunda timer. Segarkan nilai saat kembali.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setState(computeCountdown(new Date(), person));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Pada tanggal ulang tahun (WIB), tampilkan ucapan dan sembunyikan countdown.
  if (state.status === "birthday") {
    const text = person.showAge
      ? fill(cfg.birthdayTextWithAge, { age: state.age })
      : cfg.birthdayText;

    return (
      <div className="countdown countdown--birthday" aria-live="polite">
        <p className="countdown__today-title">{cfg.birthdayTitle}</p>
        <p className="countdown__today-text">{text}</p>
      </div>
    );
  }

  const until = person.showAge
    ? fill(cfg.untilTextWithAge, { age: state.turning })
    : cfg.untilText;

  const units = [
    { key: "days", value: state.days, digits: 1 },
    { key: "hours", value: state.hours, digits: 2 },
    { key: "minutes", value: state.minutes, digits: 2 },
    { key: "seconds", value: state.seconds, digits: 2 },
  ];

  return (
    <div className="countdown">
      <p className="countdown__until">{until}</p>
      <div
        className="countdown__grid"
        role="timer"
        aria-label={`${state.days} hari, ${state.hours} jam, ${state.minutes} menit, ${state.seconds} detik lagi`}
      >
        {units.map((unit) => (
          <div className="countdown__unit" key={unit.key} aria-hidden="true">
            <span className="countdown__num">{pad(unit.value, unit.digits)}</span>
            <span className="countdown__label">{cfg.unitLabels[unit.key]}</span>
          </div>
        ))}
      </div>
      <p className="countdown__timezone">waktu Asia/Jakarta (WIB)</p>
    </div>
  );
}