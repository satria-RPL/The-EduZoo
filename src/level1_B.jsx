import "./index.css";
import "./level_B.css";
import homeImg from "./assets/home1.png";
import gajahSound from "./assets/suara_hewan/gajah.mp3";
import clockImg from "./assets/time.png";
import dialog1 from "./assets/percakapan3.mp3";
import dialog2 from "./assets/percakapan5.mp3";
import maskot1 from "./assets/maskot1.png";
import maskot2 from "./assets/maskot2.png";
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
import benarImg from "./assets/benar.png";
import salahImg from "./assets/salah.png";
import benarSound from "./assets/benar.mp3";
import salahSound from "./assets/salah.mp3";
import pgajahSound from "./assets/sound_puzzle/pgajah.mp3"; // pastikan path benar
import menangSound from "./assets/menang.mp3";
import kalahSound from "./assets/kalah.mp3";
import { useState, useRef, useEffect } from "react";

// Gajah (kunci slot drop)
const gajahPieces = [
  { id: 0, img: gajahPuzzle1 },
  { id: 1, img: gajahPuzzle2 },
  { id: 2, img: gajahPuzzle3 },
  { id: 3, img: gajahPuzzle4 },
];

// Semua potongan hewan lain (pilih 4 random)
const allOtherPieces = [
  { img: elang1 }, { img: elang2 }, { img: elang3 }, { img: elang4 },
  { img: gagak1 }, { img: gagak2 }, { img: gagak3 }, { img: gagak4 },
  { img: jerapah1 }, { img: jerapah2 }, { img: jerapah3 }, { img: jerapah4 },
  { img: paus1 }, { img: paus2 }, { img: paus3 }, { img: paus4 },
];

const puzzlePieces = [
  { id: 0, img: gajahPuzzle1 },
  { id: 1, img: gajahPuzzle2 },
  { id: 2, img: gajahPuzzle3 },
  { id: 3, img: gajahPuzzle4 },
];

function getRandomizedPieces() {
  let arr = [...puzzlePieces];
  // Acak sampai tidak urut
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (arr.every((piece, idx) => piece.id === idx));
  return arr;
}

function getRandomDragPieces() {
  // Ambil 4 gambar random dari allOtherPieces
  let shuffled = [...allOtherPieces];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const random4 = shuffled.slice(0, 4);
  // Gabungkan dengan 4 gajah, lalu acak lagi
  const combined = [
    ...gajahPieces.map(p => ({ ...p })), // copy id
    ...random4.map((p, idx) => ({ id: 4 + idx, img: p.img }))
  ];
  // Acak posisi panel drag
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export default function Level1Puzzle({ onBackToGameCanvas }) {
  // Tambahkan dialog state
  const [dialogActive, setDialogActive] = useState(() => !sessionStorage.getItem("level1puzzle_dialog_shown"));
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [firstInteraction, setFirstInteraction] = useState(false);
  const dialogueAudioRef = useRef(null);

  // Tambahkan ref untuk audio puzzle
  const puzzleAudioRef = useRef(null);
  const menangAudioRef = useRef(null);
  const kalahAudioRef = useRef(null);

  // Aktifkan timer setelah dialog selesai
  const [timerActive, setTimerActive] = useState(false);

  // Dialog data
  const dialogues = [
    {
      text: "Ayooo, Selesaikan tantangan level 1 ini! Aku yakin kamu pasti bisa!",
      maskot: maskot1,
      sound: dialog1,
    },
    {
      text: "Ayooo, Susun pecahan gambar ini menjadi gambar hewan dengan menyeretnya",
      maskot: maskot2,
      sound: dialog2,
    },
  ];

  // Dialog typing effect
  useEffect(() => {
    if (!dialogActive) return;
    if (!firstInteraction) return;
    setTypedText("");
    setIsTyping(true);
    let charIndex = 0;
    const currentText = dialogues[dialogIndex].text;
    const interval = setInterval(() => {
      if (charIndex < currentText.length) {
        setTypedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [dialogIndex, dialogActive, firstInteraction]);

  // Play dialog audio
  useEffect(() => {
    if (!dialogActive || !firstInteraction) return;
    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.pause();
      dialogueAudioRef.current.currentTime = 0;
      dialogueAudioRef.current.src = dialogues[dialogIndex].sound;
      dialogueAudioRef.current.load();
      dialogueAudioRef.current.play().catch(() => {});
    }
  }, [dialogIndex, dialogActive, firstInteraction]);

  // Play sound pgajah.mp3 setelah dialog selesai
  useEffect(() => {
    if (!dialogActive) {
      // Dialog sudah selesai, play sound puzzle
      if (puzzleAudioRef.current) {
        puzzleAudioRef.current.currentTime = 0;
        puzzleAudioRef.current.play().catch(() => {});
      }
    }
  }, [dialogActive]);

  // Aktifkan timer setelah dialog selesai
  useEffect(() => {
    if (!dialogActive) {
      setTimerActive(true);
    }
  }, [dialogActive]);

  // Keyboard & click event for dialog
  useEffect(() => {
    if (!dialogActive) return;

    function handleKeyDown(event) {
      if (event.key === "Enter") {
        if (!firstInteraction) {
          setFirstInteraction(true);
          return;
        }
        if (isTyping) {
          setTypedText(dialogues[dialogIndex].text);
          setIsTyping(false);
        } else {
          if (dialogIndex < dialogues.length - 1) {
            setDialogIndex((idx) => idx + 1);
          } else {
            setDialogActive(false);
          }
        }
      }
    }
    function handleClick() {
      if (!firstInteraction) {
        setFirstInteraction(true);
        return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [dialogActive, isTyping, dialogIndex, firstInteraction]);

  // Saat dialog selesai, tandai di sessionStorage
  useEffect(() => {
    if (!dialogActive) {
      sessionStorage.setItem("level1puzzle_dialog_shown", "1");
    }
  }, [dialogActive]);

  // Dialog & timer (jika masih dipakai)
  const [hover, setHover] = useState(false);
  const audioRef = useRef(null);

  // Panel drag & drop state
  const [pieces, setPieces] = useState(getRandomDragPieces); // panel drag 8 gambar
  const [slots, setSlots] = useState(Array(8).fill(null));   // panel drop 8 slot
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);

  // Animasi benar/salah per slot
  const [slotFeedback, setSlotFeedback] = useState(Array(8).fill(null)); // "benar" | "salah" | null
  const feedbackTimeouts = useRef([]);

  // Suara benar/salah
  const benarAudioRef = useRef(null);
  const salahAudioRef = useRef(null);

  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);

  // Drag & drop logic: slot 0-3 bisa diisi gambar apapun, feedback benar/salah sesuai gambar
  function handleDrop(targetIdx) {
    if (draggedIdx === null || slots[targetIdx]) return;
    let isCorrect = false;
    let isSlotUtama = targetIdx < 4;
    if (isSlotUtama && pieces[draggedIdx].id === targetIdx) {
      isCorrect = true;
    }
    // Selalu isi slot dengan gambar yang di-drop
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

  // Kembalikan ke panel drag jika slot diklik
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
      sessionStorage.setItem("level1_B_completed", "1");
      setShowWinModal(true);
    }
  }, [slots]);

  // LOSE: waktu habis
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

  // Stop timer saat modal muncul (menang/kalah)
  useEffect(() => {
    if (showWinModal || showLoseModal) {
      setTimerActive(false);
    }
  }, [showWinModal, showLoseModal]);

  // Play menang sound when win modal is shown
  useEffect(() => {
    if (showWinModal && menangAudioRef.current) {
      menangAudioRef.current.currentTime = 0;
      menangAudioRef.current.play().catch(() => {});
    }
  }, [showWinModal]);

  // Play kalah sound when lose modal is shown
  useEffect(() => {
    if (showLoseModal && kalahAudioRef.current) {
      kalahAudioRef.current.currentTime = 0;
      kalahAudioRef.current.play().catch(() => {});
    }
  }, [showLoseModal]);

  // Handler tombol OK di modal
  const handleWinOk = () => {
    setShowWinModal(false);
    if (onBackToGameCanvas) onBackToGameCanvas("pagegame");
  };
  const handleLoseOk = () => {
    setShowLoseModal(false);
    if (onBackToGameCanvas) onBackToGameCanvas("pagegame");
  };

  const handleHomeClick = () => {
    if (onBackToGameCanvas) onBackToGameCanvas("gamecanvas");
  };

  return (
    <div className="level-puzzle-container">
      {/* DIALOG OVERLAY */}
      {dialogActive && (
        <>
          <div className="dialog-blur-overlay"></div>
          <img
            id="maskot"
            className="dialog-maskot"
            src={dialogues[dialogIndex].maskot}
            alt="Maskot"
          />
          <div id="message-box" className="dialog-message-box" style={{ display: "flex" }}>
            <div id="dialogue-container" className="dialogue-container">
              <p id="dialogue-text" className="dialogue-text">{typedText}</p>
              <div id="skip-text" className="skip-text">
                (Tekan Enter untuk memulai dan mengskip percakapan)
              </div>
            </div>
          </div>
          <audio ref={dialogueAudioRef} />
        </>
      )}
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

      {/* LABEL LEVEL */}
      <div className="level-label-row">
        {/* Label duplikat di kiri */}
        <div className="level-label label-level" style={{ marginRight: "20px" }}>
          Gajah
        </div>
        {/* Label utama */}
        <div className="level-label label-level">
          Level 1
        </div>
        <div className="level-label label-timer">
          <img src={clockImg} alt="Timer" className="label-clock-img" />
          <span className="label-timer-text">{timeLeft} detik</span>
        </div>
      </div>

      {/* Teks instruksi */}
      <div className="level-instruksi">
        Ayoo, susun pecahan gambar menjadi gambar hewan tersebut!
      </div>
      <div className="level-instruksi1">
        Arahkan kursor ke hewan
      </div>
      <div className="level-instruksi2">
        Jika kamu ingin Mendengar suaranya!
      </div>

      {/* Panel drop 2x2 (4 slot) */}
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
              {/* Animasi benar/salah */}
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

      {/* Panel drag: 4 di atas, 4 di bawah */}
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
      <audio ref={audioRef} src={gajahSound} />
      <audio ref={benarAudioRef} src={benarSound} />
      <audio ref={salahAudioRef} src={salahSound} />
      <audio ref={puzzleAudioRef} src={pgajahSound} />
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