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
    files: [], // format: { name: "Bản vẽ 3D Cảm biến (.dwg)", url: "#" }
  },
};

// ĐIỀU KHIỂN MODAL POPUP (TỐI ƯU HIỆU NĂNG & DỮ LIỆU RỖNG)
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

    // 1. Đổ tiêu đề & danh mục
    document.getElementById("modal-title").textContent = data.title || "Projet";
    document.getElementById("modal-category").textContent =
      data.category || "TECHNOLOGIE";

    // 2. Đổ danh sách Ảnh (Kiểm tra kỹ mảng rỗng)
    const galleryEl = document.getElementById("modal-gallery");
    galleryEl.innerHTML = ""; // Xóa sạch bộ nhớ tạm

    if (Array.isArray(data.images) && data.images.length > 0) {
      const fragment = document.createDocumentFragment();
      data.images.forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "Image du projet";
        img.loading = "lazy";
        img.decoding = "async";
        fragment.appendChild(img);
      });
      galleryEl.appendChild(fragment);
    } else {
      galleryEl.innerHTML = `<p class="empty-msg">Aucune photo disponible pour ce projet.</p>`;
    }

    // 3. Đổ Video (Tránh lag bằng cách nạp sau khi animation bật popup hoàn tất)
    const videoEl = document.getElementById("modal-video");
    videoEl.innerHTML = "";
    if (data.video && data.video.trim() !== "") {
      setTimeout(() => {
        videoEl.innerHTML = `<iframe src="${data.video}" frameborder="0" loading="lazy" allowfullscreen></iframe>`;
      }, 250);
    } else {
      videoEl.innerHTML = `<p class="empty-msg">Aucune vidéo démo disponible pour ce projet.</p>`;
    }

    // 4. Đổ danh sách File (Kiểm tra kỹ mảng rỗng)
    const filesEl = document.getElementById("modal-files");
    filesEl.innerHTML = "";

    if (Array.isArray(data.files) && data.files.length > 0) {
      const fragment = document.createDocumentFragment();
      data.files.forEach((f) => {
        const li = document.createElement("li");
        li.className = "file-item";
        li.innerHTML = `
          <span>📄 ${f.name}</span>
          <a href="${f.url}" download>Télécharger ↓</a>
        `;
        fragment.appendChild(li);
      });
      filesEl.appendChild(fragment);
    } else {
      filesEl.innerHTML = `<p class="empty-msg">Aucun fichier joint pour ce projet.</p>`;
    }

    // 5. Kích hoạt Modal bằng GPU Frame
    requestAnimationFrame(() => {
      modal.classList.add("active");
    });
  }

  // Đóng Modal
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  overlay.addEventListener("click", () => modal.classList.remove("active"));

  // Chuyển Tab (Images / Video / Files)
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const activeTabContent = document.getElementById(btn.dataset.tab);
      if (activeTabContent) {
        activeTabContent.classList.add("active");
      }
    });
  });
});
