const mascot = document.getElementById("mascot");

const reactions = [
  { x: "0%", y: "0%" }, // Yêu thích / Tim
  { x: "50%", y: "0%" }, // Cười lấp lánh
  { x: "100%", y: "0%" }, // Ngạc nhiên
  { x: "0%", y: "50%" }, // Mắt ngôi sao
  { x: "50%", y: "50%" }, // Ngượng ngùng / Thẹn
  { x: "0%", y: "100%" }, // Chóng mặt
  { x: "50%", y: "100%" }, // Cười hớn hở
];

let isReacting = false;
let reactionTimeout;
let ticking = false;

if (mascot) {
  mascot.style.backgroundImage = "url('./assets/rocket-directions.webp')";
  mascot.style.setProperty("--bg-x", "50%");
  mascot.style.setProperty("--bg-y", "50%");
}

document.addEventListener("mousemove", (e) => {
  if (!mascot || isReacting || ticking) return;

  ticking = true;

  requestAnimationFrame(() => {
    const rect = mascot.getBoundingClientRect();
    const mascotX = rect.left + rect.width / 2;
    const mascotY = rect.top + rect.height / 2;

    const angle =
      Math.atan2(e.clientY - mascotY, e.clientX - mascotX) * (180 / Math.PI);

    let bgX = "50%",
      bgY = "50%";

    if (angle >= -150 && angle < -110) {
      bgX = "0%";
      bgY = "0%"; // Nhìn Trên - Trái
    } else if (angle >= -110 && angle < -70) {
      bgX = "50%";
      bgY = "0%"; // Nhìn Trên - Giữa
    } else if (angle >= -70 && angle < -30) {
      bgX = "100%";
      bgY = "0%"; // Nhìn Trên - Phải
    } else if (angle >= -30 && angle < 30) {
      bgX = "100%";
      bgY = "50%"; // Nhìn Sang Phải
    } else if (angle >= 30 && angle < 70) {
      bgX = "100%";
      bgY = "100%"; // Nhìn Dưới - Phải
    } else if (angle >= 70 && angle < 110) {
      bgX = "50%";
      bgY = "100%"; // Nhìn Dưới - Giữa
    } else if (angle >= 110 && angle < 150) {
      bgX = "0%";
      bgY = "100%"; // Nhìn Dưới - Trái
    } else {
      bgX = "0%";
      bgY = "50%"; // Nhìn Sang Trái
    }

    mascot.style.backgroundImage = "url('./assets/rocket-directions.webp')";
    mascot.style.setProperty("--bg-x", bgX);
    mascot.style.setProperty("--bg-y", bgY);

    ticking = false;
  });
});

if (mascot) {
  mascot.addEventListener("click", () => {
    isReacting = true;
    clearTimeout(reactionTimeout);

    const randomReaction =
      reactions[Math.floor(Math.random() * reactions.length)];

    mascot.style.backgroundImage = "url('./assets/rocket-reactions.webp')";
    mascot.style.setProperty("--bg-x", randomReaction.x);
    mascot.style.setProperty("--bg-y", randomReaction.y);

    reactionTimeout = setTimeout(() => {
      isReacting = false;
    }, 1500); // 1.5 giây
  });
}
