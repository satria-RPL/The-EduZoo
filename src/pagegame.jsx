import { useState, useEffect, useRef } from "react";
import backgroundImg from "./assets/background1.png";
import soundOnImg from "./assets/sound_on.png";
import soundOffImg from "./assets/sound_off.png";
import achievementImg from "./assets/achievement.png";
import homeImg from "./assets/home1.png";
import dragndropImg from "./assets/dragndrop2.png";
import puzzleImg from "./assets/puzzle.png";
import papanImg from "./assets/papan.png";
import angka1 from "./assets/angka/Angka 1.png";
import angka2 from "./assets/angka/Angka 2.png";
import angka3 from "./assets/angka/Angka 3.png";
import angka4 from "./assets/angka/Angka 4.png";
import angka5 from "./assets/angka/Angka 5.png";
import lockImg from "./assets/gembok.png";
import maskot1 from "./assets/maskot1.png";
import maskot2 from "./assets/maskot2.png";
import dialog1 from "./assets/percakapanG1.mp3";
import dialog2 from "./assets/percakapanG2.mp3";
import congratsSound from "./assets/congrats.mp3";
import "./pagegame.css";
import "./index.css";

const angkaAssets = [
  angka1, angka2, angka3, angka4, angka5
];

export default function PageGame(props) {
  const {
    onBackToGameCanvas,
    onLevel1Drag,
    onLevel2Drag,
    onLevel3Drag,
    onLevel4Drag,
    onLevel5Drag,
    onLevel1Puzzle,
    onLevel2Puzzle,
    onLevel3Puzzle,
    onLevel4Puzzle,
    onLevel5Puzzle
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [dialogActive, setDialogActive] = useState(() => !sessionStorage.getItem("pagegame_dialog_shown"));
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [firstInteraction, setFirstInteraction] = useState(false);
  const dialogueAudioRef = useRef(null);
  const congratsAudioRef = useRef(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const dialogues = [
    {
      text: "Selamat datang di menu permainan! Selesaikan level 1 untuk memulai petualanganmu.",
      maskot: maskot1,
      sound: dialog1,
    },
    {
      text: "Selesaikan level secara berurutan untuk membuka tantangan berikutnya. Selamat bermain!",
      maskot: maskot2,
      sound: dialog2,
    },
  ];

  const animateClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("click-animate");
      void el.offsetWidth;
      el.classList.add("click-animate");
    }
  };

  const handleSoundToggle = () => {
    setSoundOn((prev) => !prev);
    animateClick("sound-toggle");
  };

  const handleAchievementClick = () => {
    animateClick("achievement-button");
    alert("Achievement button clicked!");
  };

  const handleHomeClick = () => {
    animateClick("home-button");
    if (onBackToGameCanvas) onBackToGameCanvas();
  };

  const handlePanelClick = (panel) => {
    if (activePanel === panel) setActivePanel(null);
    else setActivePanel(panel);
  };

  // Fungsi cek unlock per level
  const isPuzzleUnlocked = (i) => {
    if (i === 0) return true; // Level 1B selalu terbuka
    // Cek apakah level sebelumnya sudah selesai
    return sessionStorage.getItem(`level${i}_B_completed`) === "1";
  };

  // Fungsi cek unlock per level drag n drop
  const isDragUnlocked = (i) => {
    if (i === 0) {
      // Level 1A terbuka jika level 5B sudah selesai
      return sessionStorage.getItem("level5_B_completed") === "1";
    }
    // Level berikutnya terbuka jika level sebelumnya sudah selesai
    return sessionStorage.getItem(`level${i}_A_completed`) === "1";
  };

  const isAllLevelCompleted = () => {
    // Puzzle dan Drag n Drop, level 1-5
    for (let i = 1; i <= 5; i++) {
      if (
        sessionStorage.getItem(`level${i}_A_completed`) !== "1" ||
        sessionStorage.getItem(`level${i}_B_completed`) !== "1"
      ) {
        return false;
      }
    }
    return true;
  };

  // Typing effect
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

  // Tandai sudah tampil dialog di sessionStorage
  useEffect(() => {
    if (!dialogActive) {
      sessionStorage.setItem("pagegame_dialog_shown", "1");
    }
  }, [dialogActive]);

  useEffect(() => {
    if (isAllLevelCompleted()) {
      setTimeout(() => {
        setShowCongrats(true);
        if (congratsAudioRef.current) {
          congratsAudioRef.current.currentTime = 0;
          congratsAudioRef.current.play();
        }
      }, 800); // beri delay agar tidak langsung muncul saat reload
    }
  }, []);

  useEffect(() => {
    if (showCongrats && congratsAudioRef.current) {
      congratsAudioRef.current.currentTime = 0;
      congratsAudioRef.current.play().catch(() => {});
    }
  }, [showCongrats]);

  return (
    <>
      <img id="background" src={backgroundImg} alt="Background" />
      {/* HOME BUTTON */}
      <img
        id="home-button"
        src={homeImg}
        alt="Home Button"
        onClick={handleHomeClick}
      />

      {/* MENU STYLIS */}
      <div className={`menu-stylis${menuOpen ? " menu-open" : ""}`}>
        <img
          id="sound-toggle"
          className="menu-item"
          src={soundOn ? soundOnImg : soundOffImg}
          alt="Sound Toggle"
          onClick={handleSoundToggle}
          style={{ marginTop: 0 }}
        />
        <img
          id="achievement-button"
          className="menu-item"
          src={achievementImg}
          alt="Achievement Button"
          onClick={handleAchievementClick}
          style={{ marginTop: 10 }}
        />
      </div>

      {/* JUDUL DI ATAS */}
      <div className="judul-game-atas">Selamat Bermain!</div>

      {/* DUA PAPAN BERDAMPINGAN, POSISI MANUAL */}
      <div className="panel-game-row-manual">
        {/* Papan kiri: Puzzle */}
        <div
          className="papan-game-container manual-puzzle"
          style={{ position: "relative" }}
        >
          <div className="papan-inner">
            <img
              src={papanImg}
              alt="Papan Puzzle"
              className="papan-game-img"
              style={{ filter: "none" }}
            />
            <button
              className="panel-btn"
              id="puzzle-btn"
              onClick={() => handlePanelClick("puzzle")}
              tabIndex={0}
              style={{ filter: "none" }}
            >
              <img
                src={puzzleImg}
                alt="Puzzle"
                style={{ filter: "none" }}
              />
            </button>
            <div className="level-grid">
              {angkaAssets.map((img, i) => (
                <button
                  key={i}
                  className={`level-btn${i === 4 ? " level-btn-center" : ""}`}
                  tabIndex={0}
                  onClick={
                    (i === 0 && typeof onLevel1Puzzle === "function") ? onLevel1Puzzle
                    : (i === 1 && typeof onLevel2Puzzle === "function") ? onLevel2Puzzle
                    : (i === 2 && typeof onLevel3Puzzle === "function") ? onLevel3Puzzle
                    : (i === 3 && typeof onLevel4Puzzle === "function") ? onLevel4Puzzle
                    : (i === 4 && typeof onLevel5Puzzle === "function") ? onLevel5Puzzle
                    : undefined
                  }
                  style={{ position: "relative" }}
                  disabled={!isPuzzleUnlocked(i)}
                >
                  <img
                    src={img}
                    alt={`Level ${i + 1}`}
                    className="level-img"
                    style={{ opacity: !isPuzzleUnlocked(i) ? 0.5 : 1 }}
                  />
                  {!isPuzzleUnlocked(i) && (
                    <img
                      src={lockImg}
                      alt="Terkunci"
                      className="lock-overlay"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "40%",
                        height: "40%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        opacity: 0.85,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Papan kanan: Drag n Drop */}
        <div
          className="papan-game-container manual-dragndrop"
          style={{
            position: "relative"
          }}
        >
          <div className="papan-inner">
            <img src={papanImg} alt="Papan Drag n Drop" className="papan-game-img" />
            <button
              className="panel-btn"
              id="dragndrop-btn"
              onClick={() => handlePanelClick("dragndrop")}
              tabIndex={0}
            >
              <img src={dragndropImg} alt="Drag n Drop" />
            </button>
            <div className="level-grid">
              {angkaAssets.map((img, i) => (
                <button
                  key={i}
                  className={`level-btn${i === 4 ? " level-btn-center" : ""}`}
                  tabIndex={0}
                  style={{ position: "relative" }}
                  onClick={
                    i === 0 && onLevel1Drag ? onLevel1Drag
                    : i === 1 && onLevel2Drag ? onLevel2Drag
                    : i === 2 && onLevel3Drag ? onLevel3Drag
                    : i === 3 && onLevel4Drag ? onLevel4Drag
                    : i === 4 && onLevel5Drag ? onLevel5Drag
                    : undefined
                  }
                  disabled={!isDragUnlocked(i)}
                >
                  <img
                    src={img}
                    alt={`Level ${i + 1}`}
                    className="level-img"
                    style={{ opacity: !isDragUnlocked(i) ? 0.5 : 1 }}
                  />
                  {!isDragUnlocked(i) && (
                    <img
                      src={lockImg}
                      alt="Terkunci"
                      className="lock-overlay"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "40%",
                        height: "40%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        opacity: 0.85,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol level A */}
      <button onClick={onLevel1Drag}>Level 1 A</button>
      <button onClick={onLevel2Drag}>Level 2 A</button>
      <button onClick={onLevel3Drag}>Level 3 A</button>
      <button onClick={onLevel4Drag}>Level 4 A</button>
      <button onClick={onLevel5Drag}>Level 5 A</button>

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

      {/* CONGRATS POPUP */}
      {showCongrats && (
        <div className="popup-modal-overlay congrats-fall-anim">
          {/* Confetti/Fall Animation */}
          <div className="fall-container">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`fall-item fall-item-${i % 6}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
          <div className="popup-modal congrats-modal">
            <div className="popup-title congrats-title">🎉 Congratulations! 🎉</div>
            <img
              src={maskot2}
              alt="Maskot"
              className="popup-maskot"
              style={{
                width: 140,
                height: "auto",
                margin: "18px auto 0 auto",
                display: "block"
              }}
            />
            <div className="popup-message congrats-message">
              Semua level telah kamu selesaikan!<br />
              Kamu luar biasa! 🏆
            </div>
            <button
              className="popup-btn popup-btn-trophy"
              onClick={() => setShowCongrats(false)}
              aria-label="Tutup"
            >
              <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
                <ellipse cx="32" cy="60" rx="18" ry="4" fill="#FFD700" opacity="0.3"/>
                <path d="M16 8h32v12a16 16 0 11-32 0V8z" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
                <path d="M24 52h16v6a8 8 0 01-16 0v-6z" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
                <rect x="28" y="44" width="8" height="8" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
                <path d="M8 16c0 8 4 16 12 16M56 16c0 8-4 16-12 16" stroke="#B8860B" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      <audio ref={congratsAudioRef} src={congratsSound} />
    </>
  );
}