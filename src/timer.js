let state = "idle";
let selectedDuration = 25;
let remainingTime = 0;
let timerId = null;

const durationSection = document.querySelector(".duration-section");
const durationButtons = document.querySelectorAll(".duration-option");
const startBtnWrapper = document.querySelector(".start-btn");
const startButton = startBtnWrapper.querySelector("button");
const taskSelect = document.querySelector(".task-input-section select");
const timerCard = document.querySelector(".timer-card");

const countdownEl = document.createElement("div");
countdownEl.className = "text-5xl font-bold text-center text-slate-900 my-8";
countdownEl.style.display = "none";

timerCard.insertBefore(countdownEl, document.querySelector(".task-input-section"));

const resetButton = document.createElement("button");
resetButton.textContent = "Reset";
resetButton.className = "mt-3 w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100";
resetButton.style.display = "none";

startBtnWrapper.appendChild(resetButton);

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

durationButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (state !== "idle") return;

    selectedDuration = Number(button.dataset.duration);

    durationButtons.forEach(btn => {
      btn.classList.remove("bg-orange-500", "text-white", "border-orange-400");
      btn.classList.add("bg-slate-100", "text-slate-800", "border-slate-400");
    });

    button.classList.add("bg-orange-500", "text-white", "border-orange-400");
    button.classList.remove("bg-slate-100", "text-slate-800", "border-slate-400");
  });
});

startButton.addEventListener("click", () => {
  if (state === "idle") {
    startSession();
  } else if (state === "running") {
    pauseSession();
  } else if (state === "paused") {
    resumeSession();
  }
});

resetButton.addEventListener("click", resetSession);

function startSession() {
  state = "running";
  remainingTime = selectedDuration * 60;

  durationSection.style.display = "none";
  lockConfiguration();

  updateButton("Pause");
  resetButton.style.display = "block";

  countdownEl.style.display = "block";
  countdownEl.textContent = formatTime(remainingTime);

  timerId = setInterval(tick, 1000);
}

function tick() {
  remainingTime--;
  countdownEl.textContent = formatTime(remainingTime);

  if (remainingTime <= 0) {
    endSession();
  }
}

function pauseSession() {
  clearInterval(timerId);
  timerId = null;
  state = "paused";
  updateButton("Resume");
}

function resumeSession() {
  state = "running";
  updateButton("Pause");
  timerId = setInterval(tick, 1000);
}

function resetSession() {
  clearInterval(timerId);
  timerId = null;

  state = "idle";
  remainingTime = 0;

  countdownEl.style.display = "none";
  durationSection.style.display = "block";

  unlockConfiguration();
  updateButton("Start Session");
  resetButton.style.display = "none";
}

function endSession() {
  clearInterval(timerId);
  timerId = null;

  state = "idle";
  remainingTime = 0;

  countdownEl.style.display = "none";
  durationSection.style.display = "block";

  unlockConfiguration();
  updateButton("Start Session");
  resetButton.style.display = "none";
}

function lockConfiguration() {
  durationButtons.forEach(btn => (btn.disabled = true));
  taskSelect.disabled = true;
}

function unlockConfiguration() {
  durationButtons.forEach(btn => (btn.disabled = false));
  taskSelect.disabled = false;
}

function updateButton(text) {
  startButton.textContent = text;
}
