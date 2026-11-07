import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { landing, person } from "../data/birthday.js";

// ---------------------------------------------------------------------------
// Intro kue: tampil transparan DI ATAS Home, hanya saat pertama masuk website.
// Isinya hanya kue (tanpa teks / background). Lagu otomatis berputar; begitu
// lagu mulai, balon terbang dan dua kupu-kupu mengelilingi kue.
// Semua pengaturan ada di `landing` (src/data/birthday.js).
// ---------------------------------------------------------------------------

const FADE_MS = 1000; // lama kue memudar saat masuk ke Home
const READY_MS = 5500; // setelah kue selesai tersusun, ketuk layar = masuk
const TRAIL_COUNT = 12; // jumlah hati kecil yang jatuh dari kupu-kupu

const BALLOON_COLORS = [
  ["#ffd1dc", "#ee7f9d"],
  ["#e9d5ff", "#a983e6"],
  ["#c4e5ff", "#5f9fec"],
  ["#ffe2b8", "#f2a057"],
  ["#d9f3d3", "#74c077"],
  ["#ffc9c2", "#ec7168"],
  ["#fff2b9", "#efc94e"],
];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeBalloons(count) {
  const rnd = mulberry32(2009);
  return Array.from({ length: count }, (_, i) => {
    const [c1, c2] = BALLOON_COLORS[i % BALLOON_COLORS.length];
    return {
      id: i,
      x: 3 + rnd() * 90,
      size: 46 + rnd() * 38,
      dur: 9 + rnd() * 6,
      delay: rnd() * 6,
      sway: 10 + rnd() * 22,
      swayDur: 2.6 + rnd() * 2.4,
      c1,
      c2,
    };
  });
}

// ---- Kue ------------------------------------------------------------------

// Lapisan krim di atas satu tingkat kue, lengkap dengan lelehan ("drips").
function icing(x0, x1, y, drips) {
  const yb = y + 14;
  let d = `M${x0} ${y + 8} Q${x0} ${y - 4} ${x0 + 12} ${y - 4} L${x1 - 12} ${y - 4} Q${x1} ${y - 4} ${x1} ${y + 8} L${x1} ${yb}`;
  [...drips]
    .sort((a, b) => b[0] - a[0])
    .forEach(([c, depth, w]) => {
      const r = w / 2;
      d += ` L${c + r} ${yb} L${c + r} ${yb + depth - r} A${r} ${r} 0 0 1 ${c - r} ${yb + depth - r} L${c - r} ${yb}`;
    });
  return `${d} L${x0} ${yb} Z`;
}

function Tier({ x, y, w, h, fillY, pearlY, step, icingId, drips, delay }) {
  const pearls = [];
  for (let px = x + 16; px <= x + w - 16; px += step) pearls.push(px);
  return (
    <g className="cake-tier" style={{ "--dl": `${delay}s` }}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="url(#cakeSponge)" stroke="#7a5c50" strokeWidth="2" />
      <rect x={x + 1} y={fillY} width={w - 2} height="7" fill="#fff8ea" />
      <g className="cake-icing" style={{ "--dl": `${delay + 0.8}s` }}>
        <path d={icing(x, x + w, y, drips)} fill={`url(#${icingId})`} stroke="#c2788f" strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      <g className="cake-pearls" style={{ "--dl": `${delay + 1.2}s` }}>
        {pearls.map((px) => (
          <circle key={px} cx={px} cy={pearlY} r="4.6" fill="#fffdf8" stroke="#dcbf94" strokeWidth="1.1" />
        ))}
      </g>
    </g>
  );
}

function Berry({ x, y, delay }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="cake-berry" style={{ "--dl": `${delay}s` }}>
        <path d="M0 -11 C13 -11 15 5 0 17 C-15 5 -13 -11 0 -11Z" fill="#e6405a" stroke="#a82a43" strokeWidth="1.2" />
        <path d="M-8 -11 Q-3 -19 0 -13 Q3 -19 8 -11 Q0 -7 -8 -11Z" fill="#62a85f" stroke="#3f7c43" strokeWidth="1" />
        <g fill="#ffe7a3">
          <ellipse cx="-4" cy="-3" rx="1" ry="1.6" />
          <ellipse cx="4" cy="-2" rx="1" ry="1.6" />
          <ellipse cx="0" cy="3" rx="1" ry="1.6" />
          <ellipse cx="-3" cy="8" rx="0.9" ry="1.4" />
          <ellipse cx="3" cy="7" rx="0.9" ry="1.4" />
        </g>
      </g>
    </g>
  );
}

const CANDLES = [156, 178, 200, 222, 244];
const SPARKLES = [
  [30, 150, 0.2],
  [374, 196, 1.1],
  [58, 64, 0.7],
  [342, 84, 1.6],
  [200, 40, 0.4],
  [24, 300, 1.3],
  [380, 322, 0.9],
  [118, 98, 1.9],
  [286, 104, 0.1],
];

const CakeSvg = memo(function CakeSvg() {
  return (
    <svg className="cake-svg" viewBox="0 0 400 470" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cakeSponge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1dc" />
          <stop offset="1" stopColor="#f1d3a8" />
        </linearGradient>
        <linearGradient id="icingPink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9e1" />
          <stop offset="1" stopColor="#f29fb6" />
        </linearGradient>
        <linearGradient id="icingCream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#ffd6df" />
        </linearGradient>
        <linearGradient id="icingRose" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9b4c6" />
          <stop offset="1" stopColor="#e7819f" />
        </linearGradient>
        <linearGradient id="plateGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf0d3" />
          <stop offset="1" stopColor="#d8ae68" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff6a3d" />
          <stop offset="0.55" stopColor="#ffb13f" />
          <stop offset="1" stopColor="#fff3a8" />
        </linearGradient>
        <radialGradient id="flameGlow">
          <stop offset="0" stopColor="#ffd678" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd678" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="groundShadow">
          <stop offset="0" stopColor="#3e1b2b" stopOpacity="0.32" />
          <stop offset="1" stopColor="#3e1b2b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="462" rx="188" ry="11" fill="url(#groundShadow)" />

      <g className="cake-stand">
        <path d="M176 432 Q200 427 224 432 L232 452 Q200 460 168 452 Z" fill="url(#plateGold)" stroke="#b98b4e" strokeWidth="1.5" />
        <ellipse cx="200" cy="456" rx="66" ry="8" fill="url(#plateGold)" stroke="#b98b4e" strokeWidth="1.5" />
        <ellipse cx="200" cy="426" rx="196" ry="15" fill="url(#plateGold)" stroke="#b98b4e" strokeWidth="1.5" />
        <ellipse cx="200" cy="426" rx="184" ry="10" fill="#fff8e6" opacity="0.55" />
      </g>

      <Tier
        x={36} y={330} w={328} h={90} fillY={385} pearlY={410} step={22}
        icingId="icingPink" delay={0.35}
        drips={[[66, 24, 16], [112, 14, 14], [158, 30, 16], [204, 16, 14], [250, 28, 16], [296, 12, 14], [336, 22, 16]]}
      />
      <Tier
        x={80} y={252} w={240} h={82} fillY={300} pearlY={324} step={20}
        icingId="icingCream" delay={1.05}
        drips={[[102, 18, 14], [140, 28, 16], [180, 14, 14], [220, 30, 16], [260, 16, 14], [298, 24, 14]]}
      />
      <Tier
        x={120} y={178} w={160} h={78} fillY={224} pearlY={246} step={20}
        icingId="icingRose" delay={1.75}
        drips={[[140, 20, 14], [170, 30, 16], [200, 14, 14], [230, 28, 16], [260, 18, 12]]}
      />

      <Berry x={58} y={322} delay={3.0} />
      <Berry x={342} y={322} delay={3.15} />
      <Berry x={100} y={244} delay={3.3} />
      <Berry x={300} y={244} delay={3.45} />
      <Berry x={132} y={172} delay={3.6} />
      <Berry x={268} y={172} delay={3.75} />

      {CANDLES.map((cx, i) => {
        const dl = 4.0 + i * 0.14;
        return (
          <g key={cx} transform={`translate(${cx} 0)`}>
            <g className="cake-candle" style={{ "--dl": `${dl}s` }}>
              <rect x="-4.2" y="132" width="8.4" height="46" rx="2.2" fill="#fffdf8" stroke="#c9a37a" strokeWidth="1.2" />
              <rect x="-4.2" y="142" width="8.4" height="6" fill={i % 2 ? "#f2a3b8" : "#9cc9f5"} />
              <rect x="-4.2" y="156" width="8.4" height="6" fill="#ecc66b" />
              <path d="M0 132 L0 125" stroke="#5a3b2e" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <circle className="cake-flame-glow" style={{ "--dl": `${dl + 0.9}s` }} cx="0" cy="112" r="28" fill="url(#flameGlow)" />
            <g className="cake-flame" style={{ "--dl": `${dl + 0.9}s`, "--fd": `${0.28 + i * 0.05}s` }}>
              <path d="M0 91 C8 102 10 113 0 125 C-10 113 -8 102 0 91Z" fill="url(#flameGrad)" />
              <path d="M0 108 C4 113 4 119 0 124 C-4 119 -4 113 0 108Z" fill="#fff8d6" />
            </g>
          </g>
        );
      })}

      {SPARKLES.map(([x, y, dl], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path
            className="cake-sparkle"
            style={{ "--dl": `${5.2 + dl}s` }}
            d="M0 -11 Q1.6 -1.6 11 0 Q1.6 1.6 0 11 Q-1.6 1.6 -11 0 Q-1.6 -1.6 0 -11Z"
            fill="#ffd96a"
            stroke="#e0a43f"
            strokeWidth="0.9"
          />
        </g>
      ))}
    </svg>
  );
});

// ---- Kupu-kupu --------------------------------------------------------------

const WING_UPPER = "M49 40 C44 18 26 2 10 6 C-2 9 2 32 14 42 C24 50 40 48 49 44 Z";
const WING_UPPER_IN = "M47 40 C42 24 28 12 16 14 C10 16 12 30 20 38 C28 44 40 44 47 42 Z";
const WING_LOWER = "M49 44 C38 46 22 50 20 64 C19 78 36 84 44 70 C48 62 49 52 49 44 Z";

const PALETTE_HER = { a: "#ffc7d9", b: "#ee5f92", b2: "#ffa6c4", edge: "#7c2a4a", soft: "#fff3f7", dot: "#ffe28a" };
const PALETTE_HIM = { a: "#c6e6ff", b: "#4f90ee", b2: "#8cc1f7", edge: "#1f3d78", soft: "#eef8ff", dot: "#ffe28a" };

function Butterfly({ id, p, delay }) {
  const g1 = `bf${id}a`;
  const g2 = `bf${id}b`;
  const wings = (
    <>
      <path d={WING_UPPER} fill={`url(#${g1})`} stroke={p.edge} strokeWidth="1.6" strokeLinejoin="round" />
      <path d={WING_LOWER} fill={`url(#${g2})`} stroke={p.edge} strokeWidth="1.6" strokeLinejoin="round" />
      <path d={WING_UPPER_IN} fill={p.soft} opacity="0.55" />
      <circle cx="21" cy="22" r="4.2" fill={p.dot} />
      <circle cx="14" cy="33" r="2.4" fill={p.dot} />
      <circle cx="29" cy="68" r="3.4" fill={p.dot} />
    </>
  );
  return (
    <svg viewBox="0 0 100 90" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g1} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.a} />
          <stop offset="1" stopColor={p.b} />
        </linearGradient>
        <linearGradient id={g2} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.b2} />
          <stop offset="1" stopColor={p.b} />
        </linearGradient>
      </defs>
      <g className="bfly__flap" style={{ animationDelay: `${delay}s` }}>{wings}</g>
      <g transform="translate(100 0) scale(-1 1)">
        <g className="bfly__flap" style={{ animationDelay: `${delay}s` }}>{wings}</g>
      </g>
      <path d="M49 30 Q44 18 38 13 M51 30 Q56 18 62 13" stroke="#3a2230" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="13" r="1.6" fill="#3a2230" />
      <circle cx="62" cy="13" r="1.6" fill="#3a2230" />
      <ellipse cx="50" cy="50" rx="3.3" ry="16" fill="#3a2230" />
      <circle cx="50" cy="32" r="3.8" fill="#3a2230" />
    </svg>
  );
}

// ---- Komponen utama ---------------------------------------------------------

export default function CakeIntro({ onDone }) {
  const [musicOn, setMusicOn] = useState(false); // lagu sudah mulai (atau tidak ada lagu)
  const [needTap, setNeedTap] = useState(false); // browser menolak autoplay
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const rootRef = useRef(null);
  const audioRef = useRef(null);
  const onDoneRef = useRef(onDone);
  const startedRef = useRef(false);
  const erroredRef = useRef(false);
  const readyRef = useRef(false);
  const leavingRef = useRef(false);
  const fadeTimer = useRef(0);
  const doneTimer = useRef(0);
  const herRef = useRef(null);
  const himRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const balloons = useMemo(() => makeBalloons(window.innerWidth < 700 ? 11 : 18), []);

  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);

    const audio = audioRef.current;
    if (audio && !audio.paused) {
      const v0 = audio.volume;
      const steps = 20;
      let i = 0;
      fadeTimer.current = window.setInterval(() => {
        i += 1;
        audio.volume = Math.max(0, v0 * (1 - i / steps));
        if (i >= steps) {
          window.clearInterval(fadeTimer.current);
          audio.pause();
        }
      }, FADE_MS / steps);
    }
    doneTimer.current = window.setTimeout(() => onDoneRef.current?.(), FADE_MS);
  }, []);

  // Gerakan pertama pengunjung: bila lagu belum jalan (autoplay ditolak) -> putar lagu.
  // Setelah itu ketukan / Enter masuk ke Home.
  const gesture = useCallback(() => {
    const audio = audioRef.current;
    if (audio && landing.song && !startedRef.current && !erroredRef.current) {
      audio.play().catch(() => {});
      return;
    }
    if (readyRef.current) leave();
  }, [leave]);

  // Lagu otomatis.
  useEffect(() => {
    if (!landing.song) {
      setMusicOn(true);
      return undefined;
    }
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = Math.min(1, Math.max(0, Number(landing.volume ?? 0.85)));
    audio.src = landing.song;
    audioRef.current = audio;

    const onPlaying = () => {
      startedRef.current = true;
      setNeedTap(false);
      setMusicOn(true);
    };
    const onEnded = () => leave();
    const onError = () => {
      // Link lagu mati: animasi tetap jalan supaya intro tidak terasa kosong.
      erroredRef.current = true;
      setNeedTap(false);
      setMusicOn(true);
    };
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    const attempt = audio.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch((err) => {
        if (err && err.name === "NotAllowedError") setNeedTap(true);
      });
    }

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      window.clearInterval(fadeTimer.current);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [leave]);

  // Waktu, keyboard, kunci scroll.
  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      readyRef.current = true;
      setReady(true);
    }, READY_MS);

    const seconds = Number(landing.autoEnterSeconds);
    const autoTimer = seconds > 0 ? window.setTimeout(leave, seconds * 1000) : 0;

    const onKey = (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        gesture();
      }
    };
    window.addEventListener("keydown", onKey);

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    rootRef.current?.focus({ preventScroll: true });

    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(autoTimer);
      window.clearTimeout(doneTimer.current);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
    };
  }, [leave, gesture]);

  // Dua kupu-kupu terbang berdampingan, mengelilingi kue.
  useEffect(() => {
    if (!musicOn) return undefined;
    const her = herRef.current;
    const him = himRef.current;
    if (!her || !him) return undefined;

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    let nextTrail = 0;
    let trailIndex = 0;

    const frame = (now) => {
      const t = (now - t0) / 1000 + 1.5;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cakeW = Math.min(w * 0.94, 640, (h * 0.82) / 1.2);
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.max(90, Math.min(cakeW / 2 + 90, w / 2 - 34));
      const ry = cakeW * 1.2 * 0.38;
      const bs = Math.min(1, Math.max(0.7, w / 560));

      // Titik tengah pasangan mengitari kue; keduanya saling berputar kecil di sekitarnya.
      const sample = (tt) => {
        const th = tt * 0.5;
        const px = cx + rx * Math.cos(th);
        const py = cy + ry * Math.sin(th) + 16 * Math.sin(tt * 1.4);
        const rho = (54 + 18 * Math.sin(tt * 0.8)) * bs;
        const ph = tt * 1.7;
        const dx = rho * Math.cos(ph);
        const dy = rho * 0.7 * Math.sin(ph);
        return { her: [px + dx, py + dy], him: [px - dx, py - dy], depth: Math.sin(th) };
      };

      const place = (el, p0, p1, depth) => {
        const rot = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI + 90;
        const scale = bs * (1 + 0.2 * depth);
        el.style.transform = `translate3d(${p0[0].toFixed(1)}px, ${p0[1].toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.zIndex = depth > 0 ? "3" : "1";
      };

      const s0 = sample(t);
      const s1 = sample(t + 0.05);
      place(her, s0.her, s1.her, s0.depth);
      place(him, s0.him, s1.him, s0.depth);

      if (!reduce && now > nextTrail) {
        nextTrail = now + 240;
        const pool = trailRefs.current;
        const el = pool[trailIndex % pool.length];
        const fromHer = trailIndex % 2 === 0;
        trailIndex += 1;
        if (el) {
          const p = fromHer ? s0.her : s0.him;
          el.style.left = `${(p[0] + (Math.random() - 0.5) * 14).toFixed(1)}px`;
          el.style.top = `${(p[1] + 8).toFixed(1)}px`;
          el.dataset.tone = fromHer ? "her" : "him";
          el.classList.remove("is-go");
          void el.offsetWidth; // mulai ulang animasi
          el.classList.add("is-go");
        }
      }

      if (!reduce) raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
  }, [musicOn]);

  return (
    <div
      ref={rootRef}
      className={`cake-intro${leaving ? " is-leaving" : ""}${musicOn ? " has-music" : ""}`}
      style={{ "--intro-fade": `${FADE_MS}ms` }}
      role="dialog"
      aria-modal="true"
      aria-label={`Kue ulang tahun untuk ${person.name}`}
      tabIndex={-1}
      onPointerDown={gesture}
    >
      {musicOn && (
        <div className="intro-balloons" aria-hidden="true">
          {balloons.map((b) => (
            <span
              key={b.id}
              className="balloon"
              style={{
                "--x": `${b.x}%`,
                "--s": `${b.size}px`,
                "--d": `${b.dur}s`,
                "--delay": `${b.delay}s`,
                "--sway": `${b.sway}px`,
                "--sd": `${b.swayDur}s`,
                "--c1": b.c1,
                "--c2": b.c2,
              }}
            >
              <span className="balloon__sway">
                <span className="balloon__body" />
                <span className="balloon__knot" />
                <span className="balloon__string" />
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="cake-intro__stage">
        <CakeSvg />
      </div>

      <div className="intro-critters" aria-hidden="true">
        <div ref={herRef} className="bfly">
          <Butterfly id="her" p={PALETTE_HER} delay={0} />
        </div>
        <div ref={himRef} className="bfly">
          <Butterfly id="him" p={PALETTE_HIM} delay={-0.12} />
        </div>
        {Array.from({ length: TRAIL_COUNT }, (_, i) => (
          <span
            key={i}
            className="trail-heart"
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
          >
            <svg viewBox="0 0 24 22" width="100%" height="100%">
              <path d="M12 21 C3 14 1 9 1 6.5 C1 3 3.6 1 6.5 1 C9 1 11 2.4 12 4.6 C13 2.4 15 1 17.5 1 C20.4 1 23 3 23 6.5 C23 9 21 14 12 21Z" />
            </svg>
          </span>
        ))}
      </div>

      {/* Hanya ikon, tanpa teks. */}
      {!leaving && needTap && (
        <div className="cake-intro__hint cake-intro__hint--tap" aria-hidden="true" key="tap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        </div>
      )}
      {!leaving && !needTap && ready && (
        <div className="cake-intro__hint cake-intro__hint--enter" aria-hidden="true" key="enter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      )}
    </div>
  );
}
