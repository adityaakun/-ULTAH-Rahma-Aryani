import { useState } from "react";
import PhotoCard from "../components/PhotoCard.jsx";
import PhotoLightbox from "../components/PhotoLightbox.jsx";
import Reveal from "../components/Reveal.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { usIntro } from "../data/us.js";
import { usPhotos } from "../lib/usPhotos.js";

// Halaman foto berdua. Foto dibaca otomatis dari src/assets/us/.
export default function Us() {
  usePageTitle("Us");
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="wrap">
      <header className="page-head page-head--gallery">
        <div className="page-head__main">
          <h1 className="page-title">{usIntro.title}</h1>
          <p className="page-lead">{usIntro.text}</p>
        </div>
        <p className="page-head__count">
          <span className="page-head__count-num">{String(usPhotos.length).padStart(2, "0")}</span>
          <span className="visually-hidden">foto</span>
          {usIntro.handNote && <span className="hand-note">{usIntro.handNote}</span>}
        </p>
      </header>

      <div className="masonry">
        {usPhotos.map((photo, i) => (
          <Reveal key={photo.id} className="masonry__item" delay={(i % 3) * 80}>
            <PhotoCard photo={photo} index={i} onOpen={setOpenIndex} />
          </Reveal>
        ))}
      </div>

      {openIndex !== null && usPhotos[openIndex] && (
        <PhotoLightbox photos={usPhotos} index={openIndex} onClose={() => setOpenIndex(null)} onChange={setOpenIndex} />
      )}
    </div>
  );
}
