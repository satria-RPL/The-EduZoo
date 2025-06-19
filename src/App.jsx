import { useState, useEffect } from "react";
import GamePage from "./pagebelajar.jsx";
import GameCanvas from './GameCanvas.jsx'
import './index.css'
import './GameCanvas.css'
import './pagebelajar.css'
import PageGame from "./pagegame.jsx";
import Level1Drag from "./level1_A.jsx";
import Level2Drag from "./level2_A.jsx";
import Level3Drag from "./level3_A.jsx";
import Level4Drag from "./level4_A.jsx";
import Level5Drag from "./level5_A.jsx";
import Level1Puzzle from "./level1_B.jsx";
import Level2Puzzle from "./level2_B.jsx"; 
import Level3Puzzle from "./level3_B.jsx"; 
import Level4Puzzle from "./level4_B.jsx"; 
import Level5Puzzle from "./level5_B.jsx";  // Pastikan file ini ada
import bermainImg from "./assets/play1.png";
import backgroundImg from "./assets/background.png";
import logoImg from "./assets/logo1.png";
import playImg from "./assets/belajar.png";
import soundOnImg from "./assets/sound_on.png";
import soundOffImg from "./assets/sound_off.png";
import closeImg from "./assets/close1.png";
import menuImg from "./assets/menu2.png";
import maskotImg from "./assets/maskot1.png";
import backsound from "./assets/backsound.ogg";
import dialogue from "./assets/percakapan1.ogg";
import klikSound from "./assets/klik.mp3";

function ParticleCursor() {
  useEffect(() => {
    function createParticle(x, y) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${Math.random() * 12 + 8}px`;
      particle.style.height = particle.style.width;
      particle.style.background = `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`;
      particle.style.pointerEvents = "none";
      particle.style.position = "fixed";
      particle.style.zIndex = 9999;
      particle.style.animation = "particle-fade 0.7s linear forwards";
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
    function handleMove(e) {
      createParticle(e.clientX, e.clientY);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return null;
}

function App() {
  const [showGamePage, setShowGamePage] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogActive, setDialogActive] = useState(true); // true = dialog aktif, false = tidak tampil lagi
  const [showPageGame, setShowPageGame] = useState(false);
  const [fade, setFade] = useState("hide"); // "show" | "hide"
  const [pendingPage, setPendingPage] = useState(null);
  const [showLevel1Drag, setShowLevel1Drag] = useState(false);
  const [activeLevel, setActiveLevel] = useState(null);
  const [puzzleUnlocked, setPuzzleUnlocked] = useState(false);
  const [activePuzzleLevel, setActivePuzzleLevel] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem("initialized")) {
      sessionStorage.setItem("level1_completed", "1");
      sessionStorage.removeItem("level2_completed");
      // dst...
      sessionStorage.setItem("initialized", "1");
    }
  }, []);

  // Animasi klik
  const animateClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("click-animate");
      // trigger reflow for restart animation
      void el.offsetWidth;
      el.classList.add("click-animate");
    }
  };

  const handleSoundToggle = () => {
    setSoundOn((prev) => !prev);
    const audio = document.getElementById("background-audio");
    if (audio) {
      if (!soundOn) audio.play();
      else audio.pause();
    }
    animateClick("sound-toggle");
  };

  function triggerPageChange(target) {
    setFade("show");
    setPendingPage(target);
    setTimeout(() => {
      if (target === "game") setShowPageGame(true);
      else if (target === "belajar") setShowGamePage(true);
      else if (target === "home") {
        setShowPageGame(false);
        setShowGamePage(false);
      }
      setFade("hide");
      setPendingPage(null);
    }, 1000);
  }

  function goToGameCanvas() {
    setActiveLevel(null);
    setShowPageGame(false);
    setShowGamePage(false);
    setActivePuzzleLevel(null);
  }

  function handleLevel1Win() {
    sessionStorage.setItem("level1_completed", "1");
    setActiveLevel(null);
    setShowPageGame(true);
  }
  function handleLevel2Win() {
    sessionStorage.setItem("level2_completed", "1");
    setActiveLevel(null);
    setShowPageGame(true);
  }
  function handleLevel3Win() {
    sessionStorage.setItem("level3_completed", "1");
    setActiveLevel(null);
    setShowPageGame(true);
  }
  function handleLevel4Win() {
    sessionStorage.setItem("level4_completed", "1");
    setActiveLevel(null);
    setShowPageGame(true);
  }
  function handleLevel5Win() {
    sessionStorage.setItem("level5_completed", "1");
    setPuzzleUnlocked(true);
    setActiveLevel(null);
    setShowPageGame(true);
  }

  function handleLevelLose() {
    setActiveLevel(null);
    setShowPageGame(true);
  }

  function onBackToPageGame() {
    setActiveLevel(null);
    setActivePuzzleLevel(null);
    setShowPageGame(true);
  }

  useEffect(() => {
    const playClickSound = () => {
      const audio = document.getElementById("klik-audio");
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    };
    window.addEventListener("mousedown", playClickSound);
    return () => window.removeEventListener("mousedown", playClickSound);
  }, []);

  return (
    <>
      {/* Selalu render background di paling atas */}
      <img
        id="background"
        src={backgroundImg}
        alt="Background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none"
        }}
      />

      <div className={`page-fade-overlay ${fade}`}></div>
      <ParticleCursor />

      {/* Render Level Drag jika activeLevel aktif */}
      {activeLevel === 1 && <Level1Drag onBackToGameCanvas={handleLevelLose} onWin={handleLevel1Win} />}
      {activeLevel === 2 && <Level2Drag onBackToGameCanvas={handleLevelLose} onWin={handleLevel2Win} />}
      {activeLevel === 3 && <Level3Drag onBackToGameCanvas={handleLevelLose} onWin={handleLevel3Win} />}
      {activeLevel === 4 && (
        <Level4Drag
          onBackToGameCanvas={handleLevelLose}
          onWin={handleLevel4Win}
        />
      )}
      {activeLevel === 5 && (
        <Level5Drag
          onBackToGameCanvas={handleLevelLose}
          onWin={handleLevel5Win}
        />
      )}

      {activePuzzleLevel === 1 && (
        <Level1Puzzle onBackToGameCanvas={onBackToPageGame} />
      )}
      {activePuzzleLevel === 2 && (
        <Level2Puzzle onBackToGameCanvas={onBackToPageGame} />
      )}
      {activePuzzleLevel === 3 && (
        <Level3Puzzle onBackToGameCanvas={onBackToPageGame} />
      )}
      {activePuzzleLevel === 4 && (
        <Level4Puzzle onBackToGameCanvas={onBackToPageGame} />
      )}
      {activePuzzleLevel === 5 && (
        <Level5Puzzle onBackToGameCanvas={onBackToPageGame} />
      )}

      {/* Render PageGame jika showPageGame aktif */}
      {showPageGame && !activeLevel && !activePuzzleLevel && (
        <PageGame
          onBackToGameCanvas={goToGameCanvas}
          onLevel1Drag={() => { setActiveLevel(1); setShowPageGame(false); }}
          onLevel2Drag={() => { setActiveLevel(2); setShowPageGame(false); }}
          onLevel3Drag={() => { setActiveLevel(3); setShowPageGame(false); }}
          onLevel4Drag={() => { setActiveLevel(4); setShowPageGame(false); }}
          onLevel5Drag={() => { setActiveLevel(5); setShowPageGame(false); }}
          puzzleUnlocked={puzzleUnlocked}
          onLevel1Puzzle={() => { setActivePuzzleLevel(1); setShowPageGame(false); }}
          onLevel2Puzzle={() => { setActivePuzzleLevel(2); setShowPageGame(false); }}
          onLevel3Puzzle={() => { setActivePuzzleLevel(3); setShowPageGame(false); }}
          onLevel4Puzzle={() => { setActivePuzzleLevel(4); setShowPageGame(false); }}
          onLevel5Puzzle={() => { setActivePuzzleLevel(5); setShowPageGame(false); }}
        />
      )}

      {/* Render GamePage jika showGamePage aktif */}
      {showGamePage && !activeLevel && (
        <GamePage onBackToGameCanvas={() => triggerPageChange("home")} />
      )}

      {/* Render elemen GameCanvas (logo, tombol, dsb) HANYA jika TIDAK di level drag n drop, TIDAK di PageGame, TIDAK di GamePage */}
      {!activeLevel && !showPageGame && !showGamePage && !activePuzzleLevel && (
        <>
          <img
            id="bermain-button"
            src={bermainImg}
            onClick={() => {
              animateClick("bermain-button");
              triggerPageChange("game");
            }}
          />
          <img
            id="play-button"
            src={playImg}
            onClick={() => {
              animateClick("play-button");
              triggerPageChange("belajar");
            }}
          />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            width: "100%", 
            margin: "0 0 24px 0" // ubah margin top jadi 0 agar logo lebih atas
          }}>
            <img 
              id="logo" 
              src={logoImg} 
              alt="Logo" 
              style={{ 
                marginLeft: 32,
                position: "relative",
                top: "-190px", // naikkan logo lebih atas
                left: "462px"
              }} 
            />
          </div>
          <img
            id="close-button"
            src={closeImg}
            alt="Close Button"
            onClick={() => {
              window.open('', '_self', '');
              window.close();
              window.location.href = "about:blank";
            }}
          />
          {/* ...elemen lain yang memang hanya untuk GameCanvas... */}
        </>
      )}

      {/* MENU BUTTON & MENU STYLIS: GLOBAL, boleh tetap di luar */}
      <img
        id="menu-button"
        src={menuImg}
        alt="Menu Button"
        onClick={() => setMenuOpen((open) => !open)}
        style={{ zIndex: 21 }}
      />
      <div className={`menu-stylis${menuOpen ? " menu-open" : ""}`}>
        <img
          id="sound-toggle"
          className="menu-item"
          src={soundOn ? soundOnImg : soundOffImg}
          alt="Sound Toggle"
          onClick={handleSoundToggle}
          style={{ 
            marginRight: 32,
            position: "relative",
            top: "10px",
            left: "20px",
           }}
        />
      </div>

      {/* ...elemen lain tetap... */}
      {dialogActive && !activeLevel && !showPageGame && !showGamePage && (
        <img id="maskot" src={maskotImg} alt="Maskot" />
      )}
      <div id="message-box" style={{ display: "none" }}>
        <div id="dialogue-container">
          <p id="dialogue-text"></p>
          <div id="skip-text">(Tekan Enter untuk memulai dan mengskip percakapan)</div>
        </div>
      </div>
      <div id="blur-overlay"></div>
      <audio id="background-audio" src={backsound} loop autoPlay />
      <audio id="dialogue-audio" src={dialogue} />
      <audio id="klik-audio" src={klikSound} preload="auto" />
      <GameCanvas dialogActive={dialogActive} setDialogActive={setDialogActive} />
    </>
  )
}

export default App