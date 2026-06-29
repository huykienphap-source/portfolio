const form = document.getElementById("contact-form");
const success = document.getElementById("success-message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      success.style.visibility = "visible";
      success.innerHTML = "✔ Message envoyé avec succès ! Merci 😊";

      form.reset();

      setTimeout(() => {
        success.style.visibility = "hidden";
        window.location.href = "#ContactContainer";
      }, 2500);
    })
    .catch(() => {
      success.style.visibility = "visible";
      success.innerHTML = "❌ Erreur, veuillez réessayer.";
    });
});

// scroll-vitesse
function smoothScroll(target, duration = 1200) {
  const start = window.pageYOffset;
  const end = target.offsetTop;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(0, start + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      smoothScroll(target, 1800); // 1800ms = 1.8 giây
    }
  });
});
