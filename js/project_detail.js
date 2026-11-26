document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector("article");
  if (!article) return;

  // 1. Thanh tiến trình đọc (Reading Progress Bar)
  const progressBar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
  });

  // 2. Tự động tính thời gian đọc (tốc độ ~200 từ/phút)
  const readTimeEl = document.getElementById("read-time");
  if (readTimeEl) {
    const text = article.innerText || "";
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    readTimeEl.textContent = `${minutes} min de lecture`;
  }

  // 3. Tự động tạo Mục lục từ các thẻ <h2>
  const tocList = document.getElementById("toc-list");
  const headings = article.querySelectorAll("h2");
  if (tocList && headings.length > 0) {
    headings.forEach((h2, index) => {
      const id = `section-${index + 1}`;
      h2.id = id;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = h2.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  // 4. Lightbox phóng to hình ảnh khi click
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `<img src="" alt="" /><p class="lightbox-caption"></p>`;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector("img");
  const overlayCap = overlay.querySelector(".lightbox-caption");

  article.querySelectorAll("figure img").forEach((img) => {
    img.classList.add("zoomable");
    img.addEventListener("click", () => {
      overlayImg.src = img.src;
      overlayImg.alt = img.alt;
      const figcaption = img.closest("figure")?.querySelector("figcaption");
      overlayCap.textContent = figcaption ? figcaption.textContent : img.alt;
      overlay.classList.add("active");
    });
  });

  const closeLightbox = () => overlay.classList.remove("active");
  overlay.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});
