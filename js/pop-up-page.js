// DỮ LIỆU CÁC DỰ ÁN (ẢNH, VIDEO, FILES)
const projectsData = {
  1: {
    title: "Mini-panneau de contrôle de vol",
    category: ["AUTOMATIQUE", "SYSTÈME EMBARQUÉ"],
    images: [
      "assets/control_panel_circuit.png",
      "assets/flap_image.jpg",
      "assets/Mini_Panel_1.jpg",
      "assets/Mini_Panel_2.jpg",
      "assets/Mini_Panel_3.jpg",
      "assets/Mini_Panel_4.jpg",
    ],
    video: "https://www.youtube.com/embed/k57FZC_rVEM", // Hoặc link video mp4
    files: [
      {
        name: "Mini Control Panel Code (.cpp)",
        url: "assets/Mini Control Panel Code.cpp",
      },
      { name: "Mini Control Panel Materials (.pdf)", url: "#" },
    ],
  },
  2: {
    title: "Système radar de détection d'obstacles",
    category: ["AUTOMATIQUE", "SYSTÈME EMBARQUÉ"],
    images: [
      "assets/obstacle_radar_circuit.png",
      "assets/obstacle_radar_image_1.jpg",
      "assets/obstacle_radar_image_2.jpg",
      "assets/obstacle_radar_image_3.jpg",
    ],
    video: "https://www.youtube.com/embed/EvvDYUcivAs",
    files: [
      {
        name: "Obstacle Radar Materials (.pdf)",
        url: "assets/Obstacle Detection Radar System.pdf",
      },
      {
        name: "Obstacle Radar Code Python (.py)",
        url: "assets/radar_2d.py",
      },
      {
        name: "Obstacle Radar Code (.cpp)",
        url: "assets/Obstacle Radar Code.cpp",
      },
    ],
  },
  3: {
    title: "Système de porte automatique",
    category: ["AUTOMATIQUE", "SYSTÈME EMBARQUÉ"],
    images: [
      "assets/automatic_door_circuit.png",
      "assets/automatic_door_image_1.jpg",
      "assets/automatic_door_image_2.jpg",
      "assets/automatic_door_image_3.jpg",
    ],
    video: "https://www.youtube.com/embed/i3bBuMMdMZI",
    files: [
      {
        name: "Automatic Door Materials (.pdf)",
        url: "assets/Automatic Door.pdf",
      },
      {
        name: "Automatic Door Code (.cpp)",
        url: "assets/Automatic Door.cpp",
      },
    ], // format: { name: "Bản vẽ 3D Cảm biến (.dwg)", url: "#" }
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
    const categoryEl = document.getElementById("modal-category");

    categoryEl.innerHTML = "";

    const categories = Array.isArray(data.category)
      ? data.category
      : [data.category || "TECHNOLOGIE"];

    categories.forEach((category) => {
      const tag = document.createElement("span");
      tag.className = "project-type";
      tag.textContent = category;

      categoryEl.appendChild(tag);
    });

    // 2. Đổ danh sách Ảnh (Kiểm tra kỹ mảng rỗng)
    const galleryEl = document.getElementById("modal-gallery");
    galleryEl.innerHTML = ""; // Xóa sạch bộ nhớ tạm

    if (Array.isArray(data.images) && data.images.length > 0) {
      const fragment = document.createDocumentFragment();
      data.images.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "Image du projet";
        img.loading = "lazy";
        img.decoding = "async";
        // CHỈ PROJECT 1:
        // 2 ảnh đầu tiên = mỗi ảnh 1 hàng
        if (id === 1 && index < 2) {
          img.classList.add("project1-full-width");
        }

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
