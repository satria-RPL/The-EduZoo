import "./index.css";
import "./level_B.css";
import homeImg from "./assets/home1.png";
import clockImg from "./assets/time.png";
import benarImg from "./assets/benar.png";
import salahImg from "./assets/salah.png";
import benarSound from "./assets/benar.mp3";
import salahSound from "./assets/salah.mp3";
import gajahPuzzle1 from "./assets/puzzle_hewan/gajah (1).png";
import gajahPuzzle2 from "./assets/puzzle_hewan/gajah (2).png";
import gajahPuzzle3 from "./assets/puzzle_hewan/gajah (3).png";
import gajahPuzzle4 from "./assets/puzzle_hewan/gajah (4).png";
import elang1 from "./assets/puzzle_hewan/1elang (1).png";
import elang2 from "./assets/puzzle_hewan/1elang (2).png";
import elang3 from "./assets/puzzle_hewan/1elang (3).png";
import elang4 from "./assets/puzzle_hewan/1elang (4).png";
import gagak1 from "./assets/puzzle_hewan/gagak (1).png";
import gagak2 from "./assets/puzzle_hewan/gagak (2).png";
import gagak3 from "./assets/puzzle_hewan/gagak (3).png";
import gagak4 from "./assets/puzzle_hewan/gagak (4).png";
import jerapah1 from "./assets/puzzle_hewan/jerapah (1).png";
import jerapah2 from "./assets/puzzle_hewan/jerapah (2).png";
import jerapah3 from "./assets/puzzle_hewan/jerapah (3).png";
import jerapah4 from "./assets/puzzle_hewan/jerapah (4).png";
import paus1 from "./assets/puzzle_hewan/paus (1).png";
import paus2 from "./assets/puzzle_hewan/paus (2).png";
import paus3 from "./assets/puzzle_hewan/paus (3).png";
import paus4 from "./assets/puzzle_hewan/paus (4).png";
import pelangSound from "./assets/sound_puzzle/pelang.mp3";
import menangSound from "./assets/menang.mp3";
import kalahSound from "./assets/kalah.mp3";
import maskot1 from "./assets/maskot1.png";
import { useState, useRef, useEffect } from "react";

// Elang (kunci slot drop)
const elangPieces = [
  { id: 0, img: elang1 },
  { id: 1, img: elang2 },
  { id: 2, img: elang3 },
  { id: 3, img: elang4 },
];

// Semua potongan hewan lain (pilih 4 random, tanpa elang)
const allOtherPieces = [
  { img: gajahPuzzle1 }, { img: gajahPuzzle2 }, { img: gajahPuzzle3 }, { img: gajahPuzzle4 },
  { img: gagak1 }, { img: gagak2 }, { img: gagak3 }, { img: gagak4 },
  { img: jerapah1 }, { img: jerapah2 }, { img: jerapah3 }, { img: jerapah4 },
  { img: paus1 }, { img: paus2 }, { img: paus3 }, { img: paus4 },
];

function getRandomDragPieces() {
  let shuffled = [...allOtherPieces];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const random4 = shuffled.slice(0, 4);
  const combined = [
    ...elangPieces.map(p => ({ ...p })),
    ...random4.map((p, idx) => ({ id: 4 + idx, img: p.img }))
  ];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export default function Level3Puzzle({ onBackToGameCanvas }) {
  const [pieces, setPieces] = useState(getRandomDragPieces);
  const [slots, setSlots] = useState(Array(8).fill(null));
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);

  const menangAudioRef = useRef(null);
  const kalahAudioRef = useRef(null);

  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  // Animasi benar/salah per slot
  const [slotFeedback, setSlotFeedback] = useState(Array(8).fill(null));
  const feedbackTimeouts = useRef([]);
  const benarAudioRef = useRef(null);
  const salahAudioRef = useRef(null);
  const puzzleAudioRef = useRef(null);

  useEffect(() => {
    if (puzzleAudioRef.current) {
      puzzleAudioRef.current.currentTime = 0;
      puzzleAudioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setShowLoseModal(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (showWinModal || showLoseModal) {
      setTimerActive(false);
    }
  }, [showWinModal, showLoseModal]);

  useEffect(() => {
    if (showWinModal && menangAudioRef.current) {
      menangAudioRef.current.currentTime = 0;
      menangAudioRef.current.play().catch(() => {});
    }
  }, [showWinModal]);

  useEffect(() => {
    if (showLoseModal && kalahAudioRef.current) {
      kalahAudioRef.current.currentTime = 0;
      kalahAudioRef.current.play().catch(() => {});
    }
  }, [showLoseModal]);

  function handleDrop(targetIdx) {
    if (draggedIdx === null || slots[targetIdx]) return;
    let isCorrect = false;
    if (targetIdx < 4 && pieces[draggedIdx].id === targetIdx) {
      isCorrect = true;
    }
    const newSlots = [...slots];
    newSlots[targetIdx] = pieces[draggedIdx];
    setSlots(newSlots);

    const newPieces = [...pieces];
    newPieces[draggedIdx] = null;
    setPieces(newPieces);

    setSlotFeedback((prev) => {
      const arr = [...prev];
      arr[targetIdx] = isCorrect ? "benar" : "salah";
      return arr;
    });
    if (isCorrect) {
      if (benarAudioRef.current) {
        benarAudioRef.current.currentTime = 0;
        benarAudioRef.current.play();
      }
    } else {
      if (salahAudioRef.current) {
        salahAudioRef.current.currentTime = 0;
        salahAudioRef.current.play();
      }
    }
    clearTimeout(feedbackTimeouts.current[targetIdx]);
    feedbackTimeouts.current[targetIdx] = setTimeout(() => {
      setSlotFeedback((prev) => {
        const arr = [...prev];
        arr[targetIdx] = null;
        return arr;
      });
    }, 900);

    setDraggedIdx(null);
  }

  function handleSlotClick(i) {
    if (!slots[i]) return;
    const newPieces = [...pieces];
    const emptyIdx = newPieces.findIndex((p) => p === null);
    if (emptyIdx !== -1) {
      newPieces[emptyIdx] = slots[i];
      const newSlots = [...slots];
      newSlots[i] = null;
      setPieces(newPieces);
      setSlots(newSlots);
    }
  }

  // WIN: cek jika semua slot benar
  useEffect(() => {
    if ([0, 1, 2, 3].every((idx) => slots[idx] && slots[idx].id === idx)) {
      sessionStorage.setItem("level3_B_completed", "1"); // ganti X sesuai level
      setShowWinModal(true);
    }
  }, [slots]);

  const handleHomeClick = () => {
    if (onBackToGameCanvas) onBackToGameCanvas("gamecanvas");
  };

  const handleWinOk = () => {
    setShowWinModal(false);
    if (onBackToGameCanvas) onBackToGameCanvas("pagegame");
  };
  const handleLoseOk = () => {
    setShowLoseModal(false);
    if (onBackToGameCanvas) onBackToGameCanvas("pagegame");
  };

  return (
    <div className="level-puzzle-container">
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
      <div className="level-label-row">
        <div className="level-label label-level" style={{ marginRight: "20px" }}>
          Elang
        </div>
        <div className="level-label label-level">
          Level 3
        </div>
        <div className="level-label label-timer">
          <img src={clockImg} alt="Timer" className="label-clock-img" />
          <span className="label-timer-text">{timeLeft} detik</span>
        </div>
      </div>
      <div className="level-instruksi">
        Ayoo, susun pecahan gambar menjadi gambar hewan tersebut!
      </div>
      <div className="level-instruksi1">
        Arahkan kursor ke hewan
      </div>
      <div className="level-instruksi2">
        Jika kamu ingin Mendengar suaranya!
      </div>
      <div className="big-drop-panel">
        <div className="puzzle-slot-grid">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="puzzle-slot"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onClick={() => handleSlotClick(i)}
              style={{
                position: "relative",
                animation:
                  slotFeedback[i] === "benar"
                    ? "slot-blink-green 0.9s"
                    : slotFeedback[i] === "salah"
                    ? "slot-blink-red 0.9s"
                    : undefined,
              }}
            >
              <span className="slot-number">{i + 1}</span>
              {slots[i] && (
                <img
                  src={slots[i].img}
                  alt={`Slot ${i + 1}`}
                  draggable={false}
                  className="puzzle-slot-img"
                />
              )}
              {slotFeedback[i] === "benar" && (
                <img
                  src={benarImg}
                  alt="Benar"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    pointerEvents: "none",
                    animation: "pop-scale 0.9s",
                  }}
                />
              )}
              {slotFeedback[i] === "salah" && (
                <img
                  src={salahImg}
                  alt="Salah"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    pointerEvents: "none",
                    animation: "pop-scale 0.9s",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="drag-panels-container">
        <div className="drag-panels-2row">
          <div className="drag-panels-row">
            {pieces.slice(0, 4).map((piece, i) => (
              <div className="drag-panel" key={i}>
                <div className="drag-panel-inner">
                  {piece ? (
                    <img
                      src={piece.img}
                      alt={`Puzzle ${i + 1}`}
                      draggable
                      onDragStart={() => setDraggedIdx(i)}
                      onDragEnd={() => setDraggedIdx(null)}
                      className={`drag-panel-img${draggedIdx === i ? " dragging" : ""}`}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="drag-panels-row">
            {pieces.slice(4, 8).map((piece, i) => (
              <div className="drag-panel" key={i + 4}>
                <div className="drag-panel-inner">
                  {piece ? (
                    <img
                      src={piece.img}
                      alt={`Puzzle ${i + 5}`}
                      draggable
                      onDragStart={() => setDraggedIdx(i + 4)}
                      onDragEnd={() => setDraggedIdx(null)}
                      className={`drag-panel-img${draggedIdx === i + 4 ? " dragging" : ""}`}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <audio ref={benarAudioRef} src={benarSound} />
      <audio ref={salahAudioRef} src={salahSound} />
      <audio ref={puzzleAudioRef} src={pelangSound} />
      <audio ref={menangAudioRef} src={menangSound} />
      <audio ref={kalahAudioRef} src={kalahSound} />

      {/* WIN MODAL */}
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
            <div className="popup-message">Puzzle gambar berhasil disusun! <br /> Ayoo lanjut kelevel berikutnyaa!</div>
            <button className="popup-btn popup-btn-check" onClick={handleWinOk}>
              <span className="popup-btn-icon">&#10003;</span>
            </button>
          </div>
        </div>
      )}

      {/* LOSE MODAL */}
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
            <div className="popup-message">Silakan coba lagi! <br /> jangan mudah menyerah yaa!</div>
            <button className="popup-btn popup-btn-close" onClick={handleLoseOk}>
              <span className="popup-btn-icon">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}