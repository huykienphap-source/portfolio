document.addEventListener("DOMContentLoaded", () => {
  // Tìm tất cả các hộp content-box có chức năng flip-card
  const flipCards = document.querySelectorAll(".content-box.flip-card");

  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Thực hiện thêm/xóa class .flipped để lật ngược hoặc xuôi
      card.classList.toggle("flipped");
    });
  });
});
