document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener(
      "click",
      () => {
        card.classList.toggle("flipped");
      },
      { passive: true }
    );
  });
});