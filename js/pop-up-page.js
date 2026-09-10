// DỮ LIỆU CÁC DỰ ÁN (ẢNH, VIDEO, FILES)
const projectsData = {
  1: {
    title: "Automatic Landing System",
    category: "EMBEDDED SYSTEMS",
    images: [],
    video: "", // Hoặc link video mp4
    files: [
      { name: "Sơ đồ mạch Arduino (.pdf)", url: "#" },
      { name: "Mã nguồn C++ (.zip)", url: "#" },
    ],
  },
  2: {
    title: "PLC Mini Simulator",
    category: "AUTOMATION",
    images: ["assets/cat2.jpeg"],
    video: "",
    files: [{ name: "Tài liệu PLC Siemens (.pdf)", url: "#" }],
  },
  3: {
    title: "Automatic Door System",
    category: "ELECTRONICS",
    images: ["assets/cat3.jpeg"],
    video: "",
    files: [], // theo format này { name: "Bản vẽ 3D Cảm biến (.dwg)", url: "#" }
  },
};

// ĐIỀU KHIỂN MODAL POPUP
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.querySelector(".modal-close-btn");
  const overlay = document.querySelector(".modal-overlay");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const viewBtns = document.querySelectorAll(".project-button");

  // Gắn sự kiện cho từng nút "View Project"
  viewBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const projectId = index + 1; // Lấy ID tương ứng 1, 2, 3...
      openProjectModal(projectId);
    });
  });

  function openProjectModal(id) {
    const data = projectsData[id];
    if (!data) return;

    // Đổ dữ liệu chữ
    document.getElementById("modal-title").innerText = data.title;
    document.getElementById("modal-category").innerText = data.category;

    // Đổ danh sách Ảnh (Kiểm tra mảng rỗng)
    const galleryEl = document.getElementById("modal-gallery");
    galleryEl.innerHTML =
      data.images && data.images.length > 0
        ? data.images
            .map((img) => `<img src="${img}" alt="Project image">`)
            .join("")
        : `<p class="empty-msg">Aucune photo disponible pour ce projet.</p>`;

    // Đổ Video
    const videoEl = document.getElementById("modal-video");
    videoEl.innerHTML = data.video
      ? `<iframe src="${data.video}" frameborder="0" allowfullscreen></iframe>`
      : `<p class="empty-msg">Aucune vidéo démo disponible pour ce projet.</p>`;

    // Đổ danh sách File (Kiểm tra mảng rỗng)
    const filesEl = document.getElementById("modal-files");
    filesEl.innerHTML =
      data.files && data.files.length > 0
        ? data.files
            .map(
              (f) => `
          <li class="file-item">
            <span>📄 ${f.name}</span>
            <a href="${f.url}" download>Télécharger ↓</a>
          </li>
        `,
            )
            .join("")
        : `<p class="empty-msg">Aucun fichier joint pour ce projet.</p>`;

    // Mở Modal
    modal.classList.add("active");
  }

  // Đóng Modal khi bấm X hoặc bấm ra ngoài
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  overlay.addEventListener("click", () => modal.classList.remove("active"));

  // Chuyển Tab Ảnh / Video / File
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
});
