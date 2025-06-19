import { useEffect } from "react";
import "./GameCanvas.css";

export default function GameCanvas({ dialogActive, setDialogActive }) {
  useEffect(() => {
    if (!dialogActive) return; // Jika dialog sudah tidak aktif, jangan jalankan dialog lagi

    // Dialog dan sound
    const dialogues = [
      {
        text: "Selamat datang di game The EduZoo, Perkenalkan nama aku Zeko, aku adalah Maskot dari game The Edu Zoo, Salam kenal yaaa!",
        maskot: "/src/assets/maskot1.png",
        sound: "/src/assets/percakapan1.ogg"
      },
      {
        text: "Ini adalah game tentang Binatang, Kamu bisa belajar banyak binatang melalui bahasa isyarat disini",
        maskot: "/src/assets/maskot2.png",
        sound: "/src/assets/percakapan2.ogg"
      }
    ];

    let currentDialogueIndex = 0;
    let isTyping = false;
    let typingInterval = null;
    let firstInteraction = false;
    let dialogueFinished = false;

    // DOM
    const messageBox = document.getElementById("message-box");
    const dialogueText = document.getElementById("dialogue-text");
    const maskotImage = document.getElementById("maskot");
    const blurOverlay = document.getElementById("blur-overlay");
    const background = document.getElementById("background");
    const logo = document.getElementById("logo");
    const playButton = document.getElementById("play-button");
    const soundButton = document.getElementById("sound-button");
    const closeButton = document.getElementById("close-button");
    const backgroundAudio = document.getElementById("background-audio");
    const dialogueAudio = document.getElementById("dialogue-audio");
    const menuButton = document.getElementById("menu-button");
    const bermainButton = document.getElementById("bermain-button");
    // soundToggle & achievementButton dikontrol React, tidak perlu diakses di sini

    // Set dialog audio src dinamis
    function setDialogueAudio(src) {
      dialogueAudio.pause();
      dialogueAudio.currentTime = 0;
      dialogueAudio.src = src;
      dialogueAudio.load();
    }

    // Typing effect
    function typeDialogue(text, callback) {
      let charIndex = 0;
      isTyping = true;
      if (typingInterval) clearInterval(typingInterval);
      dialogueText.textContent = "";

      typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          dialogueText.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typingInterval);
          typingInterval = null;
          isTyping = false;
          if (callback) callback();
        }
      }, 50);
    }

    // Skip typing (tampilkan langsung)
    function skipTyping() {
      if (typingInterval) clearInterval(typingInterval);
      typingInterval = null;
      isTyping = false;
      dialogueText.textContent = dialogues[currentDialogueIndex].text;
    }

    // Tampilkan dialog sesuai index
    function showDialogue(index) {
      if (index >= dialogues.length) {
        // Dialog selesai
        blurOverlay.style.display = "none";
        background.classList.remove("blurred");
        if (logo) logo.classList.remove("blurred");
        if (playButton) playButton.classList.remove("blurred");
        if (soundButton) soundButton.classList.remove("blurred");
        if (closeButton) closeButton.classList.remove("blurred");
        if (menuButton) menuButton.classList.remove("blurred");
        if (bermainButton) bermainButton.classList.remove("blurred");
        messageBox.style.display = "none";
        maskotImage.style.display = "none";
        dialogueFinished = true;
        setDialogActive(false); // Matikan dialog untuk selanjutnya
        return;
      }
      // Set maskot dan text
      maskotImage.src = dialogues[index].maskot;
      typeDialogue(dialogues[index].text);
      // Set dan play sound dialog
      setDialogueAudio(dialogues[index].sound);
      dialogueAudio.play().catch(() => {});
    }

    // Interaksi pertama: tampilkan dialog pertama
    function startAllAudio() {
      if (!firstInteraction) {
        backgroundAudio.play().catch(() => {});
        firstInteraction = true;
        showDialogue(0);
      }
    }

    // Event listener enter
    document.addEventListener("keydown", (event) => {
      if (dialogueFinished) return;
      if (event.key === "Enter") {
        if (!firstInteraction) return; // Belum mulai dialog
        if (isTyping) {
          // Enter pertama: skip typing
          skipTyping();
        } else {
          // Enter kedua: lanjut ke dialog berikutnya
          currentDialogueIndex++;
          showDialogue(currentDialogueIndex);
        }
      }
    });

    // Event listener tombol close untuk keluar dari tab atau reset halaman
    function handleClose() {
      // Coba tutup tab (jika diizinkan browser)
      window.open('', '_self', '');
      window.close();
      // Apapun hasilnya, langsung arahkan ke about:blank agar user keluar dari aplikasi
      window.location.href = "about:blank";
    }

    // Interaksi pertama (click/keydown)
    document.addEventListener("click", startAllAudio);
    document.addEventListener("keydown", startAllAudio);

    // Tampilkan box dialog saat awal (tapi text belum dimuat)
    messageBox.style.display = "flex";
    maskotImage.style.display = "block";
    blurOverlay.style.display = "block";
    background.classList.add("blurred");
    if (logo) logo.classList.add("blurred");
    if (playButton) playButton.classList.add("blurred");
    if (soundButton) soundButton.classList.add("blurred");
    if (closeButton) closeButton.classList.add("blurred");
    if (menuButton) menuButton.classList.add("blurred");
    if (bermainButton) bermainButton.classList.add("blurred");

    // Efek jejak kursor, animasi, dsb (tidak diubah)
    background.addEventListener("mousemove", (event) => {
      const particle = document.createElement("div");
      particle.className = "particle";
      document.body.appendChild(particle);

      const size = Math.random() * 10 + 8;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${event.pageX - size / 2}px`;
      particle.style.top = `${event.pageY - size / 2}px`;

      particle.addEventListener("animationend", () => {
        particle.remove();
      });
    });

    background.addEventListener("mouseenter", () => {
      logo.classList.add("shadow-animate");
      playButton.classList.add("shadow-animate");
    });
    background.addEventListener("mouseleave", () => {
      logo.classList.remove("shadow-animate");
      playButton.classList.remove("shadow-animate");
    });

    [logo, playButton, soundButton, closeButton, menuButton].forEach((element) => {
      if (element) {
        element.addEventListener("mouseenter", () => element.classList.add("hover-animate"));
        element.addEventListener("mouseleave", () => element.classList.remove("hover-animate"));
      }
    });

    window.addEventListener("load", () => {
      logo.classList.add("animate");
      playButton.classList.add("animate");
    });

    // --- BACKSOUND AUTOPLAY ---
    if (backgroundAudio) {
      backgroundAudio.volume = 0.5;
      backgroundAudio.play().catch(() => {});
    }

    // Cleanup event listener saat unmount
    return () => {
      document.removeEventListener("click", startAllAudio);
      document.removeEventListener("keydown", startAllAudio);
      document.removeEventListener("keydown", () => {});
      if (closeButton) {
        closeButton.removeEventListener("click", handleClose);
      }
    };
  }, [dialogActive, setDialogActive]);

  
  return null;
}
