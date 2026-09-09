const loader = document.getElementById("page-loader");

const progress = document.getElementById("progress");

const progressNumber = document.getElementById("progress-number");

let progressValue = 0;

const loadingInterval = setInterval(() => {
  const increase = Math.floor(Math.random() * 6) + 2;

  progressValue += increase;

  if (progressValue >= 100) {
    progressValue = 100;
  }

  progress.style.width = progressValue + "%";

  progressNumber.textContent = progressValue + "%";

  if (progressValue === 100) {
    clearInterval(loadingInterval);

    setTimeout(() => {
      loader.classList.add("hidden");
    }, 500);
  }
}, 100);
