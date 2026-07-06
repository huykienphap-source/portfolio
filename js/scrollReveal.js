const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    root: null,
    threshold: 0.05,
    rootMargin: "0px 0px -12% 0px",
  },
);

reveals.forEach((item) => observer.observe(item));
