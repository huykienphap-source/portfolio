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
