import "./index.css";
import "./level_A.css";
import homeImg from "./assets/home1.png";
import clockImg from "./assets/time.png";
import buttonA from "./assets/button isyarat/A.png";
import buttonE from "./assets/button isyarat/E.png";
import buttonG from "./assets/button isyarat/G.png";
import buttonL from "./assets/button isyarat/L.png";
import buttonN from "./assets/button isyarat/N.png";
import elang1 from "./assets/hewan/elang 1.png";
import elang2 from "./assets/hewan/elang 2.png";
import elangSound from "./assets/suara_hewan/elang.mp3";
import menangSound from "./assets/menang.mp3";
import kalahSound from "./assets/kalah.mp3";
import maskot1 from "./assets/maskot1.png";
import tingSound from "./assets/ting.mp3";
import starImg from "./assets/star.png";
// Import semua button isyarat
import buttonB from "./assets/button isyarat/B.png";
import buttonC from "./assets/button isyarat/C.png";
import buttonD from "./assets/button isyarat/D.png";
import buttonF from "./assets/button isyarat/F.png";
import buttonH from "./assets/button isyarat/H.png";
import buttonI from "./assets/button isyarat/I.png";
import buttonJ from "./assets/button isyarat/J.png";
import buttonK from "./assets/button isyarat/K.png";
import buttonM from "./assets/button isyarat/M.png";
import buttonO from "./assets/button isyarat/O.png";
import buttonP from "./assets/button isyarat/P.png";
import buttonQ from "./assets/button isyarat/Q.png";
import buttonR from "./assets/button isyarat/R.png";
import buttonS from "./assets/button isyarat/S.png";
import buttonT from "./assets/button isyarat/T.png";
import buttonU from "./assets/button isyarat/U.png";
import buttonV from "./assets/button isyarat/V.png";
import buttonW from "./assets/button isyarat/W.png";
import buttonX from "./assets/button isyarat/X.png";
import buttonY from "./assets/button isyarat/Y.png";
import buttonZ from "./assets/button isyarat/Z.png";
import buttonDrop from "./assets/button.png";
import soundA from "./assets/sound/A1.mp3";
import soundB from "./assets/sound/B.mp3";
import soundC from "./assets/sound/C.mp3";
import soundD from "./assets/sound/D.mp3";
import soundE from "./assets/sound/E.mp3";
import soundF from "./assets/sound/F.mp3";
import soundG from "./assets/sound/G.mp3";
import soundH from "./assets/sound/H.mp3";
import soundI from "./assets/sound/I.mp3";
import soundJ from "./assets/sound/J.mp3";
import soundK from "./assets/sound/K.mp3";
import soundL from "./assets/sound/L.mp3";
import soundM from "./assets/sound/M.mp3";
import soundN from "./assets/sound/N.mp3";
import soundO from "./assets/sound/O1.mp3";
import soundP from "./assets/sound/P.mp3";
import soundQ from "./assets/sound/Q.mp3";
import soundR from "./assets/sound/R.mp3";
import soundS from "./assets/sound/S.mp3";
import soundT from "./assets/sound/T.mp3";
import soundU from "./assets/sound/U.mp3";
import soundV from "./assets/sound/V.mp3";
import soundW from "./assets/sound/W.mp3";
import soundX from "./assets/sound/X.mp3";
import soundY from "./assets/sound/Y1.mp3";
import soundZ from "./assets/sound/Z.mp3";
import { useState, useRef, useEffect } from "react";

// Helper untuk random huruf selain G, A, J, H (max 3x)
const allButtons = [
  { huruf: "A", img: buttonA },
  { huruf: "B", img: buttonB },
  { huruf: "C", img: buttonC },
  { huruf: "D", img: buttonD },
  { huruf: "E", img: buttonE },
  { huruf: "F", img: buttonF },
  { huruf: "G", img: buttonG },
  { huruf: "H", img: buttonH },
  { huruf: "I", img: buttonI },
  { huruf: "J", img: buttonJ },
  { huruf: "K", img: buttonK },
  { huruf: "L", img: buttonL },
  { huruf: "M", img: buttonM },
  { huruf: "N", img: buttonN },
  { huruf: "O", img: buttonO },
  { huruf: "P", img: buttonP },
  { huruf: "Q", img: buttonQ },
  { huruf: "R", img: buttonR },
  { huruf: "S", img: buttonS },
  { huruf: "T", img: buttonT },
  { huruf: "U", img: buttonU },
  { huruf: "V", img: buttonV },
  { huruf: "W", img: buttonW },
  { huruf: "X", img: buttonX },
  { huruf: "Y", img: buttonY },
  { huruf: "Z", img: buttonZ },
];

// Kata kunci: E, L, A, N, G
const kunci = [
  { huruf: "E", img: buttonE },
  { huruf: "L", img: buttonL },
  { huruf: "A", img: buttonA },
  { huruf: "N", img: buttonN },
  { huruf: "G", img: buttonG },
];

// Fungsi untuk generate 8 huruf drag (5 kunci + 3 random, tidak double > 3)
function generateDragButtons() {
  let dragBtns = [...kunci];
  while (dragBtns.length < 8) {
    const idx = Math.floor(Math.random() * allButtons.length);
    const { huruf, img } = allButtons[idx];
    const muncul = dragBtns.filter((b) => b.huruf === huruf).length;
    if (muncul < 3) {
      dragBtns.push({ huruf, img });
    }
  }
  // Acak urutan
  for (let i = dragBtns.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dragBtns[i], dragBtns[j]] = [dragBtns[j], dragBtns[i]];
  }
  return dragBtns;
}

const dragButtonsInit = generateDragButtons();

// Mapping huruf ke sound
const soundMap = {
  A: soundA,
  B: soundB,
  C: soundC,
  D: soundD,
  E: soundE,
  F: soundF,
  G: soundG,
  H: soundH,
  I: soundI,
  J: soundJ,
  K: soundK,
  L: soundL,
  M: soundM,
  N: soundN,
  O: soundO,
  P: soundP,
  Q: soundQ,
  R: soundR,
  S: soundS,
  T: soundT,
  U: soundU,
  V: soundV,
  W: soundW,
  X: soundX,
  Y: soundY,
  Z: soundZ,
};

export default function Level3Drag({ onBackToGameCanvas }) {
  // Reset sessionStorage jika halaman di-refresh (hanya saat mount pertama)
  useEffect(() => {
    sessionStorage.removeItem("level3_completed");
  }, []);
  const [hover, setHover] = useState(false);
  const [time, setTime] = useState(45);
  const [timerActive, setTimerActive] = useState(true); // Timer langsung aktif
  const audioRef = useRef(null);
  const menangAudioRef = useRef(null);
  const kalahAudioRef = useRef(null);
  const tingAudioRef = useRef(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);

  const [dragButtons, setDragButtons] = useState(dragButtonsInit);
  const [dropSlots, setDropSlots] = useState(Array(5).fill(null)); // 5 slot drop

  // Drag and drop logic
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [starParticles, setStarParticles] = useState([false, false, false, false, false]);
  const [showElang2, setShowElang2] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || time <= 0) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timerActive, time]);

    // Win jika semua slot terisi dengan benar
    useEffect(() => {
      if (
        dropSlots.every((s, idx) => s && s.huruf === kunci[idx].huruf)
      ) {
        sessionStorage.setItem("level3_A_completed", "1");
        setShowWinModal(true);
        if (menangAudioRef.current) {
          menangAudioRef.current.currentTime = 0;
          menangAudioRef.current.play();
        }
      }
    }, [dropSlots]);

  // LOSE
  useEffect(() => {
    if (timerActive && time === 0 && !hasEnded) {
      setHasEnded(true);
      setShowLoseModal(true);
      if (kalahAudioRef.current) {
        kalahAudioRef.current.currentTime = 0;
        kalahAudioRef.current.play();
      }
    }
  }, [time, timerActive, hasEnded]);

  const handleHomeClick = () => {
    // Jangan set apapun, hanya pindah ke gamecanvas
    if (onBackToGameCanvas) onBackToGameCanvas("gamecanvas");
  };

  const handleMouseEnter = () => {
    setHover(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setHover(false);
    // Biarkan suara tetap berbunyi
  };

  function handleDragStart(idx) {
    setDraggedIdx(idx);
  }
  function handleDragEnd() {
    setDraggedIdx(null);
  }
  function handleDrop(slotIdx) {
    if (draggedIdx === null) return;
    const draggedBtn = dragButtons[draggedIdx];
    if (dropSlots[slotIdx]) return;
    if (draggedBtn && draggedBtn.huruf === kunci[slotIdx].huruf) {
      const newSlots = [...dropSlots];
      newSlots[slotIdx] = draggedBtn;
      setDropSlots(newSlots);

      const newDrags = [...dragButtons];
      newDrags[draggedIdx] = null;
      setDragButtons(newDrags);

      // Tampilkan partikel bintang
      setStarParticles((prev) => {
        const arr = [...prev];
        arr[slotIdx] = true;
        return arr;
      });
      // Play ting sound
      if (tingAudioRef.current) {
        tingAudioRef.current.currentTime = 0;
        tingAudioRef.current.play();
      }
      setTimeout(() => {
        setStarParticles((prev) => {
          const arr = [...prev];
          arr[slotIdx] = false;
          return arr;
        });
      }, 900);

      // Play sound sesuai huruf, volume lebih keras
      const huruf = draggedBtn.huruf.toUpperCase();
      const hurufSound = soundMap[huruf];
      if (hurufSound) {
        const audio = new window.Audio(hurufSound);
        audio.volume = 1.0;
        audio.currentTime = 0;
        audio.play();
      }

      // Jika semua slot sudah terisi, ganti gambar & mainkan suara
      setTimeout(() => {
        if (newSlots.every((s) => s)) {
          setShowElang2(true);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }
      }, 400);
    }
    setDraggedIdx(null);
  }

  function handleRemoveDrop(slotIdx) {
    const newDrags = [...dragButtons];
    const newSlots = [...dropSlots];
    const dropBtn = newSlots[slotIdx];
    if (!dropBtn) return;
    const emptyIdx = newDrags.findIndex((b) => b === null);
    if (emptyIdx !== -1) {
      newDrags[emptyIdx] = dropBtn;
      newSlots[slotIdx] = null;
      setDragButtons(newDrags);
      setDropSlots(newSlots);
    }
  }

  useEffect(() => {
    if (
      dropSlots.every((s, idx) => s && s.huruf === kunci[idx].huruf) &&
      !hasEnded
    ) {
      sessionStorage.setItem("level3_A_completed", "1");
      setTimeout(() => {
        setShowWinModal(true);
        if (menangAudioRef.current) {
          menangAudioRef.current.currentTime = 0;
          menangAudioRef.current.play();
        }
      }, 100);
    }
  }, [dropSlots, hasEnded]);

  return (
    <div className="levelA-drag-container">
      {/* HOME BUTTON */}
      <img
        id="home-button"
        src={homeImg}
        alt="Home Button"
        onClick={handleHomeClick}
        style={{
          position: "absolute",
          top: 5,
          left: 20,
          width: 120,
          height: "auto",
          cursor: "pointer",
          zIndex: 11,
          transition: "filter 0.3s, transform 0.3s",
        }}
      />

      {/* LABEL LEVEL DAN WAKTU */}
      <div className="level-label-roww">
        <div className="level-label label-level">Level 3</div>
        <div className="level-label label-timer">
          <img src={clockImg} alt="Waktu" className="label-clock-img" />
          <span className="label-timer-text">: {String(time).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Teks instruksi di bawah label */}
      <div className="level-instruksi" style={{ top: "25%", left: "45%" }}>
        Ayoo, susun abjad SIBI menjadi nama hewan tersebut!
      </div>
      <div className="level-instruksi1" style={{ top: "11%", left: "11%" }}>
        Arahkan kursor ke hewan
      </div>
      <div className="level-instruksi2" style={{ top: "19%", left: "5%" }}>
        Jika kamu ingin Mendengar suaranya!
      </div>

      {/* Panel utama dengan elang */}
      <div className="hewan-panel" style={{ left: "23%", top: "150px" }}>
        <img
          src={showElang2 ? elang2 : hover ? elang2 : elang1}
          alt="Elang"
          className={`hewan-img${hover ? " hewan-img-besar" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <audio ref={audioRef} src={elangSound} />
      </div>

      {/* Slot drop */}
      <div
        style={{
          position: "absolute",
          left: "70%",
          top: "41%",
          width: "420px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "18px",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            style={{
              width: 80,
              height: 80,
              border: "none",
              borderRadius: 18,
              background: `url(${buttonDrop}) center/cover no-repeat`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px #0002",
              cursor: dropSlots[i] ? "pointer" : "default",
              position: "relative",
              opacity: dropSlots[i] ? 1 : 0.5,
              transition: "opacity 0.3s",
            }}
            onClick={() => handleRemoveDrop(i)}
          >
            {dropSlots[i] && (
              <img
                src={dropSlots[i].img}
                alt={dropSlots[i].huruf}
                style={{
                  width: 60,
                  height: 60,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                draggable={false}
              />
            )}
            {/* Partikel bintang */}
            {starParticles[i] && (
              <img
                src={starImg}
                alt="Star"
                className="star-particles-img"
                style={{
                  position: "absolute",
                  width: 48,
                  height: 48,
                  top: -18,
                  left: "50%",
                  transform: "translateX(-50%) scale(1.2)",
                  pointerEvents: "none",
                  animation: "star-pop 0.9s",
                  zIndex: 10,
                }}
              />
            )}
            {/* Nomor slot */}
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 8,
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                textShadow: "1px 1px 4px #000a",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 5,
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Panel drag */}
      <div
        className="drag-panel"
        style={{
          left: "71%",
          top: "52%",
          width: "700px",
          height: "240px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          transform: "translateX(-50%)",
          position: "absolute",
        }}
      >
        {/* Baris 1: 4 tombol */}
        <div style={{ display: "flex", gap: "12px" }}>
          {dragButtons.slice(0, 4).map((btn, i) =>
            btn ? (
              <img
                key={i}
                src={btn.img}
                alt={btn.huruf}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnd={handleDragEnd}
                style={{
                  width: 80,
                  height: 80,
                  margin: 2,
                  cursor: "grab",
                  opacity: draggedIdx === i ? 0.5 : 1,
                  border: "2px solid #fff",
                  borderRadius: 16,
                  background: "#e0ffe0",
                  boxShadow: "0 2px 8px #0002",
                }}
              />
            ) : (
              <div
                key={i}
                style={{
                  width: 80,
                  height: 80,
                  margin: 2,
                  border: "2px dashed #bbb",
                  borderRadius: 16,
                  background: "#f8f8f8",
                }}
              />
            )
          )}
        </div>
        {/* Baris 2: 4 tombol */}
        <div style={{ display: "flex", gap: "12px" }}>
          {dragButtons.slice(4, 8).map((btn, i) =>
            btn ? (
              <img
                key={i + 4}
                src={btn.img}
                alt={btn.huruf}
                draggable
                onDragStart={() => handleDragStart(i + 4)}
                onDragEnd={handleDragEnd}
                style={{
                  width: 80,
                  height: 80,
                  margin: 2,
                  cursor: "grab",
                  opacity: draggedIdx === i + 4 ? 0.5 : 1,
                  border: "2px solid #fff",
                  borderRadius: 16,
                  background: "#e0ffe0",
                  boxShadow: "0 2px 8px #0002",
                }}
              />
            ) : (
              <div
                key={i + 4}
                style={{
                  width: 80,
                  height: 80,
                  margin: 2,
                  border: "2px dashed #bbb",
                  borderRadius: 16,
                  background: "#f8f8f8",
                }}
              />
            )
          )}
        </div>
      </div>

      {showWinModal && (
        <div className="popup-modal-overlay">
          <div className="popup-modal win">
            <div className="popup-title">🎉 Selamat! 🎉</div>
            <img
              src={maskot1}
              alt="Maskot"
              style={{
                width: 90,
                height: "auto",
                margin: "10px auto 0 auto",
                display: "block"
              }}
            />
            <div className="popup-message">
              Puzzle abjad berhasil disusun! <br /> Ayoo lanjut ke level berikutnya!
            </div>
            <button className="popup-btn popup-btn-check" onClick={() => onBackToGameCanvas("pagegame")}>
              <span className="popup-btn-icon">&#10003;</span>
            </button>
          </div>
        </div>
      )}

      {showLoseModal && (
        <div className="popup-modal-overlay">
          <div className="popup-modal lose">
            <div className="popup-title">😢 Waktu Habis</div>
            <img
              src={maskot1}
              alt="Maskot"
              style={{
                width: 90,
                height: "auto",
                margin: "10px auto 0 auto",
                display: "block"
              }}
            />
            <div className="popup-message">
              Silakan coba lagi! <br /> Jangan mudah menyerah yaa!
            </div>
            <button className="popup-btn popup-btn-close" onClick={() => onBackToGameCanvas("pagegame")}>
              <span className="popup-btn-icon">&times;</span>
            </button>
          </div>
        </div>
      )}

      <audio ref={menangAudioRef} src={menangSound} />
      <audio ref={kalahAudioRef} src={kalahSound} />
      <audio ref={tingAudioRef} src={tingSound} />
    </div>
  );
}