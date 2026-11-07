import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CakeIntro from "./components/CakeIntro.jsx";
import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Us from "./pages/Us.jsx";
import Wishes from "./pages/Wishes.jsx";
import BirthdayLetter from "./pages/BirthdayLetter.jsx";
import Music from "./pages/Music.jsx";
import NotFound from "./pages/NotFound.jsx";
import { features, landing } from "./data/birthday.js";
import { usPhotos } from "./lib/usPhotos.js";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Intro kue hanya muncul saat pertama membuka website lewat alamat "/".
  // Di belakangnya Home sudah tampil, jadi kue terlihat transparan di atas Home.
  const [intro, setIntro] = useState(() => landing.enabled !== false && location.pathname === "/");
  const closeIntro = useCallback(() => setIntro(false), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // "/" langsung dialihkan ke "/home" (tanpa memuat ulang Home).
  useEffect(() => {
    if (location.pathname === "/") navigate("/home", { replace: true });
  }, [location.pathname, navigate]);

  return (
    <>
      <a className="skip-link" href="#main">
        Lompat ke konten
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        {/* key membuat transisi halus dijalankan ulang di setiap halaman */}
        <div className="page" key={location.pathname === "/" ? "/home" : location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            {usPhotos.length > 0 && <Route path="/us" element={<Us />} />}
            {features.wishes && <Route path="/wishes" element={<Wishes />} />}
            <Route path="/letter" element={<BirthdayLetter />} />
            <Route path="/music" element={<Music />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      {intro && <CakeIntro onDone={closeIntro} />}
    </>
  );
}
