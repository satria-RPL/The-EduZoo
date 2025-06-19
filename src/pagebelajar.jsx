import { useState, useEffect, useRef } from "react";
import backgroundImg from "./assets/background1.png";
import soundOnImg from "./assets/sound_on.png";
import soundOffImg from "./assets/sound_off.png";
import achievementImg from "./assets/achievement.png";
import homeImg from "./assets/home1.png";
import aImg from "./assets/huruf/A.png";
import bImg from "./assets/huruf/B.png";
import cImg from "./assets/huruf/C.png";
import dImg from "./assets/huruf/D.png";
import eImg from "./assets/huruf/E.png";
import fImg from "./assets/huruf/F.png";
import gImg from "./assets/huruf/G.png";
import hImg from "./assets/huruf/H.png";
import iImg from "./assets/huruf/I.png";
import jImg from "./assets/huruf/J.png";
import kImg from "./assets/huruf/K.png";
import lImg from "./assets/huruf/L.png";
import mImg from "./assets/huruf/M.png";
import nImg from "./assets/huruf/N.png";
import oImg from "./assets/huruf/O.png";
import pImg from "./assets/huruf/P.png";
import qImg from "./assets/huruf/Q.png";
import rImg from "./assets/huruf/R.png";
import sImg from "./assets/huruf/S.png";
import tImg from "./assets/huruf/T.png";
import uImg from "./assets/huruf/U.png";
import vImg from "./assets/huruf/V.png";
import wImg from "./assets/huruf/W.png";
import xImg from "./assets/huruf/X.png";
import yImg from "./assets/huruf/Y.png";
import zImg from "./assets/huruf/Z.png";
import aSound from "./assets/sound/A1.mp3";
import bSound from "./assets/sound/B.mp3";
import cSound from "./assets/sound/C.mp3";
import dSound from "./assets/sound/D.mp3";
import eSound from "./assets/sound/E.mp3";
import fSound from "./assets/sound/F.mp3";
import gSound from "./assets/sound/G.mp3";
import hSound from "./assets/sound/H.mp3";
import iSound from "./assets/sound/I.mp3";
import jSound from "./assets/sound/J.mp3";
import kSound from "./assets/sound/K.mp3";
import lSound from "./assets/sound/L.mp3";
import mSound from "./assets/sound/M.mp3";
import nSound from "./assets/sound/N.mp3";
import oSound from "./assets/sound/O1.mp3";
import pSound from "./assets/sound/P.mp3";
import qSound from "./assets/sound/Q.mp3";
import rSound from "./assets/sound/R.mp3";
import sSound from "./assets/sound/S.mp3";
import tSound from "./assets/sound/T.mp3";
import uSound from "./assets/sound/U.mp3";
import vSound from "./assets/sound/V.mp3";
import wSound from "./assets/sound/W.mp3";
import xSound from "./assets/sound/X.mp3";
import ySound from "./assets/sound/Y1.mp3";
import zSound from "./assets/sound/Z.mp3";
import maskot1 from "./assets/maskot1.png";
import maskot2 from "./assets/maskot2.png";
import dialog1 from "./assets/percakapanB1.mp3";
import dialog2 from "./assets/percakapanB2.mp3";
import "./pagebelajar.css";
import "./GameCanvas.css";

const hurufList = [
  { img: aImg, label: "A", sound: aSound },
  { img: bImg, label: "B", sound: bSound },
  { img: cImg, label: "C", sound: cSound },
  { img: dImg, label: "D", sound: dSound },
  { img: eImg, label: "E", sound: eSound },
  { img: fImg, label: "F", sound: fSound },
  { img: gImg, label: "G", sound: gSound },
  { img: hImg, label: "H", sound: hSound },
  { img: iImg, label: "I", sound: iSound },
  { img: jImg, label: "J", sound: jSound },
  { img: kImg, label: "K", sound: kSound },
  { img: lImg, label: "L", sound: lSound },
  { img: mImg, label: "M", sound: mSound },
  { img: nImg, label: "N", sound: nSound },
  { img: oImg, label: "O", sound: oSound },
  { img: pImg, label: "P", sound: pSound },
  { img: qImg, label: "Q", sound: qSound },
  { img: rImg, label: "R", sound: rSound },
  { img: sImg, label: "S", sound: sSound },
  { img: tImg, label: "T", sound: tSound },
  { img: uImg, label: "U", sound: uSound },
  { img: vImg, label: "V", sound: vSound },
  { img: wImg, label: "W", sound: wSound },
  { img: xImg, label: "X", sound: xSound },
  { img: yImg, label: "Y", sound: ySound },
  { img: zImg, label: "Z", sound: zSound },
];

const playSound = (sound) => {
  if (!sound) return;
  const audio = new Audio(sound);
  audio.volume = 1.0; // volume maksimal
  audio.currentTime = 0;
  audio.play();
};

export default function GamePage({ onBackToGameCanvas }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Tambahkan state dialog
  const [dialogActive, setDialogActive] = useState(() => !sessionStorage.getItem("belajar_dialog_shown"));
  const [dialogIndex, setDialogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [firstInteraction, setFirstInteraction] = useState(false);
  const dialogueAudioRef = useRef(null);

  // Dialog data
  const dialogues = [
    {
      text: "Selamat datang di halaman belajar! Di sini kamu bisa mengenal huruf dan suara isyarat SIBI.",
      maskot: maskot1,
      sound: dialog1,
    },
    {
      text: "Arahkan kursor ke gambar huruf untuk mendengar suaranya. Selamat belajar!",
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
      sessionStorage.setItem("belajar_dialog_shown", "1");
    }
  }, [dialogActive]);

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
      <div className="judul-belajar-atas">Ayoo!! Belajar bahasa isyarat</div>

      {/* ID CARD GRID */}
      <div className="idcard-grid">
        {hurufList.slice(0, 25).map(({ img, label, sound }) => (
          <div className="idcard" key={label}>
            <div className="idcard-foto">
              <img
                src={img}
                alt={label}
                className="idcard-img"
                onMouseEnter={() => playSound(sound)}
              />
            </div>
            <div className="idcard-label">{label}</div>
          </div>
        ))}
        {/* Baris terakhir: tambahkan 2 kosong, Z, 2 kosong */}
        <div className="idcard empty"></div>
        <div className="idcard empty"></div>
        <div className="idcard" key="Z">
          <div className="idcard-foto">
            <img
              src={zImg}
              alt="Z"
              className="idcard-img"
              onMouseEnter={() => playSound(zSound)}
            />
          </div>
          <div className="idcard-label">Z</div>
        </div>
        <div className="idcard empty"></div>
        <div className="idcard empty"></div>
      </div>

      {/* DIALOG */}
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
    </>
  );
}
