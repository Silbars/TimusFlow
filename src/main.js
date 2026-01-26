import "./style.css"
let state = "idle";
let selectedDuration = 25;
let remainingTime = 0;
let timerId = null;
let endTime = null;

let tasks = [];

const durationSection = document.querySelector(".duration-section");
const durationButtons = document.querySelectorAll(".duration-option");
const startBtnWrapper = document.querySelector(".start-btn");
const startButton = startBtnWrapper.querySelector("button");
const taskSelect = document.querySelector(".task-input-section select");
const timerCard = document.querySelector(".timer-card");
const taskListEl = document.querySelector(".task-list");
const taskCountEl = document.querySelector(".task-count");
const taskInput = document.querySelector(".task-input");
const addTaskBtn = document.querySelector(".add-task-btn");

const countdownEl = document.createElement("div");
countdownEl.className = "text-5xl font-bold text-center text-slate-900 my-8";
countdownEl.style.display = "none";

timerCard.insertBefore(countdownEl, document.querySelector(".task-input-section"));

const resetButton = document.createElement("button");
resetButton.textContent = "Reset";
resetButton.className = "mt-3 w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100";
resetButton.style.display = "none";

startBtnWrapper.appendChild(resetButton);

loadState();

addTaskBtn.addEventListener("click", () => {
  const val = taskInput.value.trim();
  if (!val) return;
  tasks.push(val);
  taskInput.value = "";
  renderTasks();
  updateTaskSelect();
  saveState();
  updateURL();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTaskBtn.click();
  }
});

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
  endTime = Date.now() + remainingTime * 1000;

  durationSection.style.display = "none";
  lockConfiguration();

  updateButton("Pause");
  resetButton.style.display = "block";

  countdownEl.style.display = "block";
  countdownEl.textContent = formatTime(remainingTime);

  timerId = setInterval(tick, 1000);
  saveState();
}

function tick() {
  if (endTime) {
    remainingTime = Math.ceil((endTime - Date.now()) / 1000);
  } else {
    remainingTime--;
  }

  if (remainingTime <= 0) {
    endSession();
    return;
  }

  countdownEl.textContent = formatTime(remainingTime);
  saveState();
}

function pauseSession() {
  clearInterval(timerId);
  timerId = null;
  state = "paused";
  updateButton("Resume");
  if (endTime) {
    remainingTime = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    endTime = null;
  }
  saveState();
}

function resumeSession() {
  state = "running";
  updateButton("Pause");
  endTime = Date.now() + remainingTime * 1000;
  timerId = setInterval(tick, 1000);
  saveState();
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
  endTime = null;
  saveState();
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
  endTime = null;
  saveState();
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

function saveState() {
  try {
    const payload = {
      state,
      selectedDuration,
      remainingTime,
      endTime,
      tasks,
      selectedTaskIndex: taskSelect.selectedIndex
    };
    localStorage.setItem("timus_state", JSON.stringify(payload));
  } catch (e) {
  }
}

function loadState() {
  const urlParams = new URLSearchParams(window.location.search);
  const tasksParam = urlParams.get("tasks");
  if (tasksParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(tasksParam));
      if (Array.isArray(parsed)) tasks = parsed;
    } catch (e) {
    }
  }

  try {
    const raw = localStorage.getItem("timus_state");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!tasks.length && Array.isArray(parsed.tasks)) tasks = parsed.tasks;
      if (parsed.selectedDuration) {
        selectedDuration = parsed.selectedDuration;
      }
      if (parsed.state) state = parsed.state;
      if (parsed.remainingTime) remainingTime = parsed.remainingTime;
      if (parsed.endTime) endTime = parsed.endTime;
      var loadedSelectedTaskIndex = (typeof parsed.selectedTaskIndex === 'number') ? parsed.selectedTaskIndex : null;
    }
  } catch (e) {}

  renderTasks();
  updateTaskSelect();

  try {
    if (typeof loadedSelectedTaskIndex === 'number' && loadedSelectedTaskIndex >= 0 && loadedSelectedTaskIndex < taskSelect.options.length) {
      taskSelect.selectedIndex = loadedSelectedTaskIndex;
    }
  } catch (e) {}

  durationButtons.forEach(btn => {
    const d = Number(btn.dataset.duration);
    if (d === selectedDuration) {
      btn.classList.add("bg-orange-500", "text-white", "border-orange-400");
      btn.classList.remove("bg-slate-100", "text-slate-800", "border-slate-400");
    } else {
      btn.classList.remove("bg-orange-500", "text-white", "border-orange-400");
      btn.classList.add("bg-slate-100", "text-slate-800", "border-slate-400");
    }
  });

  if (state === "running") {
    durationSection.style.display = "none";
    lockConfiguration();
    updateButton("Pause");
    resetButton.style.display = "block";
    countdownEl.style.display = "block";
    if (endTime) {
      remainingTime = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    }
    if (remainingTime <= 0) {
      endSession();
    } else {
      countdownEl.textContent = formatTime(remainingTime);
      timerId = setInterval(tick, 1000);
    }
  } else if (state === "paused") {
    durationSection.style.display = "none";
    lockConfiguration();
    updateButton("Resume");
    resetButton.style.display = "block";
    countdownEl.style.display = "block";
    countdownEl.textContent = formatTime(remainingTime);
  } else {
    state = "idle";
    updateButton("Start Session");
  }
}

function renderTasks() {
  taskListEl.innerHTML = "";
  tasks.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "task-item flex items-center justify-between px-3 py-2 border rounded-lg";
    div.textContent = t;

    const rem = document.createElement("button");
    rem.className = "ml-2 px-2 py-1 text-sm text-red-600";
    rem.textContent = "Remove";
    rem.addEventListener("click", () => {
      tasks.splice(i, 1);
      renderTasks();
      updateTaskSelect();
      saveState();
      updateURL();
    });

    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-between";
    wrapper.appendChild(div);
    div.appendChild(rem);

    taskListEl.appendChild(div);
  });
  taskCountEl.textContent = `${tasks.length} / ${tasks.length}`;
}

function updateTaskSelect() {
  const current = taskSelect.selectedIndex;
  taskSelect.innerHTML = "";
  const defaultOpt = document.createElement("option");
  defaultOpt.textContent = "No task (general purpose)";
  taskSelect.appendChild(defaultOpt);
  tasks.forEach(t => {
    const o = document.createElement("option");
    o.textContent = t;
    taskSelect.appendChild(o);
  });
  if (typeof current === "number" && current >= 0 && current <= taskSelect.options.length - 1) {
    taskSelect.selectedIndex = current;
  }
}

function updateURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (tasks.length) {
      params.set("tasks", encodeURIComponent(JSON.stringify(tasks)));
    } else {
      params.delete("tasks");
    }
    const newUrl = `${location.pathname}?${params.toString()}`;
    history.replaceState(null, "", newUrl);
  } catch (e) {}
}
