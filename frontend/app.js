/* =====================================================================
   UNICORE — app.js
   Frontend-only logic. Sample data stands in for a future Flask + MySQL
   backend. Every section that will eventually hit a real endpoint is
   marked with an API placeholder function.
   ===================================================================== */

/* =====================================================================
   Authentication
   ===================================================================== */
const Auth = {
  KEY: "unicore_user",

  getUser() {
    try { return JSON.parse(sessionStorage.getItem(this.KEY)); }
    catch (e) { return null; }
  },

  setUser(user) {
    sessionStorage.setItem(this.KEY, JSON.stringify(user));
  },

  clearUser() {
    sessionStorage.removeItem(this.KEY);
  },

  requireLogin() {
    if (!this.getUser()) window.location.href = "index.html";
  }
};

function showAuthMsg(el, text, type) {
  el.textContent = text;
  el.className = "auth-msg show " + type;
}

function initLoginPage() {
  const landing = document.getElementById("view-landing");
  if (!landing) return; // not on index.html

  // View switching (landing / login / signup)
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => switchAuthView(btn.dataset.goto));
  });

  function switchAuthView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("view-" + name).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // If URL has #login or #signup, jump straight there
  if (window.location.hash === "#login") switchAuthView("login");
  if (window.location.hash === "#signup") switchAuthView("signup");

  // ---- Login form ----
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-msg");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;

    document.getElementById("login-name-field").classList.remove("field-error");
    document.getElementById("login-password-field").classList.remove("field-error");

    if (!name || !password) {
      if (!name) document.getElementById("login-name-field").classList.add("field-error");
      if (!password) document.getElementById("login-password-field").classList.add("field-error");
      showAuthMsg(loginMsg, "Please fill in both fields to continue.", "error");
      return;
    }

    // apiLogin() will call POST /api/login once the backend exists.
    const result = await apiLogin(name, password);

    if (result.success) {
      showAuthMsg(loginMsg, "Signed in successfully. Redirecting...", "success");
      Auth.setUser(result.user);
      setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
    } else {
      showAuthMsg(loginMsg, result.message || "Could not sign in. Please try again.", "error");
    }
  });

  // ---- Sign up form ----
  const signupForm = document.getElementById("signup-form");
  const signupMsg = document.getElementById("signup-msg");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentId = document.getElementById("signup-id").value.trim();
    const name = document.getElementById("signup-name").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    ["signup-id-field", "signup-name-field", "signup-password-field", "signup-confirm-field"]
      .forEach(id => document.getElementById(id).classList.remove("field-error"));

    let firstError = null;
    if (!studentId) firstError = firstError || "signup-id-field";
    if (!name) firstError = firstError || "signup-name-field";
    if (!password) firstError = firstError || "signup-password-field";
    if (password && confirm && password !== confirm) firstError = firstError || "signup-confirm-field";

    if (!studentId || !name || !password || !confirm) {
      if (!studentId) document.getElementById("signup-id-field").classList.add("field-error");
      if (!name) document.getElementById("signup-name-field").classList.add("field-error");
      if (!password) document.getElementById("signup-password-field").classList.add("field-error");
      if (!confirm) document.getElementById("signup-confirm-field").classList.add("field-error");
      showAuthMsg(signupMsg, "Please fill in every field to create your account.", "error");
      return;
    }
    if (password !== confirm) {
      document.getElementById("signup-confirm-field").classList.add("field-error");
      showAuthMsg(signupMsg, "Passwords do not match.", "error");
      return;
    }

    // apiSignup() will call POST /api/signup once the backend exists.
    const result = await apiSignup({ studentId, name, password });

    if (result.success) {
      showAuthMsg(signupMsg, "Account created. Redirecting...", "success");
      Auth.setUser(result.user);
      setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
    } else {
      showAuthMsg(signupMsg, result.message || "Could not create your account.", "error");
    }
  });
}

/* =====================================================================
   Dashboard Navigation
   ===================================================================== */
function initDashboardNav() {
  const shell = document.querySelector(".app-shell");
  if (!shell) return; // not on dashboard.html

  Auth.requireLogin();
  const user = Auth.getUser();

  // Populate profile chip / header
  const initials = (user.name || "S").trim().charAt(0).toUpperCase();
  document.getElementById("sidebar-avatar").textContent = initials;
  document.getElementById("sidebar-name").textContent = user.name || "Student";
  document.getElementById("sidebar-id").textContent = "ID: " + (user.studentId || "—");
  document.getElementById("dash-name").textContent = user.name || "Student";
  document.getElementById("dash-id").textContent = user.studentId || "—";

  const links = document.querySelectorAll(".side-link[data-view]");
  const buttons = document.querySelectorAll("[data-view]");
  const views = document.querySelectorAll(".dview");
  const mobileNav = document.getElementById("mobile-nav");

  function goTo(name) {
    views.forEach(v => v.classList.toggle("active", v.id === "dview-" + name));
    links.forEach(l => l.classList.toggle("active", l.dataset.view === name));
    if (mobileNav) mobileNav.value = name;
    window.location.hash = name;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  buttons.forEach(el => {
    el.addEventListener("click", (e) => {
      if (el.tagName === "A") e.preventDefault();
      goTo(el.dataset.view);
    });
  });

  if (mobileNav) {
    mobileNav.addEventListener("change", () => goTo(mobileNav.value));
  }

  const startView = (window.location.hash || "#dashboard").replace("#", "");
  goTo(document.getElementById("dview-" + startView) ? startView : "dashboard");

  document.getElementById("logout-btn").addEventListener("click", () => {
    apiLogout();
    Auth.clearUser();
    window.location.href = "index.html";
  });
}

/* =====================================================================
   Lost & Found
   ===================================================================== */
let lostItems = [
  {
    id: 1,
    name: "Blue Jansport backpack",
    details: "Left in the 2nd floor library reading room, near the window seats. Has a keychain with a small fox charm on the zipper.",
    location: "Library, 2nd floor",
    contact: "01711-223344",
    posted: "2 hours ago",
    status: "unclaimed",
    photo: null,
    comments: [
      { author: "Rafi", text: "Is this still there? I think I saw it at the help desk." },
      { author: "Araf", text: "This is mine, I'll come collect it today." }
    ]
  },
  {
    id: 2,
    name: "Casio calculator (fx-991)",
    details: "Found on a bench outside the Commerce building after the 3pm exam block.",
    location: "Commerce building",
    contact: "01899-004521",
    posted: "Yesterday",
    status: "unclaimed",
    photo: null,
    comments: []
  },
  {
    id: 3,
    name: "Black umbrella",
    details: "Found near the main gate during the evening rain. Slightly bent handle.",
    location: "Main gate",
    contact: "01722-556677",
    posted: "2 days ago",
    status: "claimed",
    photo: null,
    comments: [
      { author: "Mahin", text: "That's mine, thank you for holding onto it!" }
    ]
  }
];
let lfNextId = 4;

function renderLostFound(list) {
  const board = document.getElementById("lf-board");
  if (!board) return;
  board.innerHTML = "";

  if (list.length === 0) {
    board.innerHTML = '<div class="empty-state">No items match your search yet.</div>';
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    const badgeClass = item.status === "claimed" ? "badge-claimed" : "badge-unclaimed";
    const badgeText = item.status === "claimed" ? "Claimed" : "Unclaimed";
    const thumbStyle = item.photo ? `style="background-image:url(${item.photo})"` : "";

    card.innerHTML = `
      <div class="item-top">
        <div class="item-thumb" ${thumbStyle}>
          ${item.photo ? "" : icon("image")}
        </div>
        <div class="item-body">
          <div class="item-head-row">
            <h4>${escapeHtml(item.name)}</h4>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <p class="item-desc">${escapeHtml(item.details)}</p>
          <div class="item-meta">
            <span>${icon("pin")} ${escapeHtml(item.location)}</span>
            <span>${icon("phone")} ${escapeHtml(item.contact)}</span>
            <span>${icon("clock")} ${escapeHtml(item.posted)}</span>
          </div>
        </div>
      </div>
      <hr class="item-divider" />
      <div class="comments">
        ${item.comments.map(c => `<div class="comment"><b>${escapeHtml(c.author)}</b>${escapeHtml(c.text)}</div>`).join("")}
      </div>
      <form class="comment-form" data-id="${item.id}" data-kind="lf">
        <input type="text" placeholder="${item.comments.length ? "Know something about this item?" : "Add a comment"}" required />
        <button type="submit">Post</button>
      </form>
    `;
    board.appendChild(card);
  });
}

function initLostFound() {
  const form = document.getElementById("lostfound-form");
  if (!form) return;

  const photoDrop = document.getElementById("lf-photo-drop");
  const photoInput = document.getElementById("lf-photo");
  let pendingPhoto = null;

  photoDrop.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingPhoto = e.target.result;
      photoDrop.querySelector("span").textContent = file.name;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("lf-name").value.trim();
    const details = document.getElementById("lf-details").value.trim();
    const location = document.getElementById("lf-location").value.trim();
    const contact = document.getElementById("lf-contact").value.trim();
    if (!name || !location || !contact) return;

    const newItem = {
      id: lfNextId++,
      name, details, location, contact,
      posted: "Just now",
      status: "unclaimed",
      photo: pendingPhoto,
      comments: []
    };

    // apiCreateLostItem() will POST to /api/lost-items once the backend exists.
    await apiCreateLostItem(newItem);
    lostItems.unshift(newItem);
    renderLostFound(applyLostFoundSearch());
    form.reset();
    pendingPhoto = null;
    photoDrop.querySelector("span").textContent = "Upload photo (optional)";
  });

  document.getElementById("lf-board").addEventListener("submit", handleCommentSubmit);
  document.getElementById("lf-search").addEventListener("input", () => {
    renderLostFound(applyLostFoundSearch());
  });

  renderLostFound(lostItems);
}

function applyLostFoundSearch() {
  const q = (document.getElementById("lf-search").value || "").toLowerCase().trim();
  if (!q) return lostItems;
  return lostItems.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.details.toLowerCase().includes(q) ||
    i.location.toLowerCase().includes(q)
  );
}

/* =====================================================================
   Weather
   ===================================================================== */
const weatherIcons = {
  clear: `<circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke-linecap="round"/>`,
  clouds: `<path d="M6 18a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 18H6z"/>`,
  rain: `<path d="M6 15a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 15H6z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" stroke-linecap="round"/>`,
  storm: `<path d="M6 13a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 13H6z"/><path d="M12 14l-2.5 4H12l-1 3.5L14 17h-2.5z"/>`
};
function weatherIconSvg(kind, cls) {
  return `<svg class="icon ${cls || ""}" viewBox="0 0 24 24" stroke-width="1.5">${weatherIcons[kind] || weatherIcons.clear}</svg>`;
}

const sampleWeather = {
  Dhaka: {
    country: "Bangladesh", tempC: 29, tempF: 83, feelsC: 36, feelsF: 96,
    condition: "Mostly clear", conditionIcon: "clouds",
    humidity: "88%", wind: "4 km/h", pressure: "1009 hPa",
    sunrise: "5:44 AM", sunset: "6:03 PM",
    hours: [
      { t: "Now", icon: "clear", temp: "28°", rain: "0%" },
      { t: "11 PM", icon: "clouds", temp: "28°", rain: "0%" },
      { t: "12 AM", icon: "clouds", temp: "28°", rain: "0%" },
      { t: "1 AM", icon: "clouds", temp: "28°", rain: "0%" },
      { t: "2 AM", icon: "clouds", temp: "28°", rain: "1%" },
      { t: "3 AM", icon: "clouds", temp: "28°", rain: "2%" },
      { t: "4 AM", icon: "clouds", temp: "27°", rain: "3%" },
      { t: "5 AM", icon: "clear", temp: "27°", rain: "5%" }
    ],
    days: [
      { d: "Today", icon: "rain", cond: "Drizzle", hi: 34, lo: 27 },
      { d: "Tue", icon: "storm", cond: "Thunderstorm", hi: 34, lo: 26 },
      { d: "Wed", icon: "clouds", cond: "Cloudy", hi: 33, lo: 26 },
      { d: "Thu", icon: "clear", cond: "Sunny", hi: 34, lo: 27 },
      { d: "Fri", icon: "rain", cond: "Light rain", hi: 32, lo: 26 }
    ]
  },
  Chattogram: {
    country: "Bangladesh", tempC: 30, tempF: 86, feelsC: 34, feelsF: 93,
    condition: "Partly cloudy", conditionIcon: "clouds",
    humidity: "80%", wind: "9 km/h", pressure: "1007 hPa",
    sunrise: "5:38 AM", sunset: "6:05 PM",
    hours: [
      { t: "Now", icon: "clouds", temp: "30°", rain: "5%" },
      { t: "11 PM", icon: "clouds", temp: "29°", rain: "5%" },
      { t: "12 AM", icon: "clear", temp: "28°", rain: "0%" },
      { t: "1 AM", icon: "clear", temp: "28°", rain: "0%" },
      { t: "2 AM", icon: "clear", temp: "27°", rain: "0%" },
      { t: "3 AM", icon: "clouds", temp: "27°", rain: "2%" },
      { t: "4 AM", icon: "clouds", temp: "27°", rain: "3%" },
      { t: "5 AM", icon: "clear", temp: "27°", rain: "4%" }
    ],
    days: [
      { d: "Today", icon: "clouds", cond: "Partly cloudy", hi: 33, lo: 27 },
      { d: "Tue", icon: "rain", cond: "Showers", hi: 32, lo: 26 },
      { d: "Wed", icon: "clear", cond: "Sunny", hi: 33, lo: 26 },
      { d: "Thu", icon: "clouds", cond: "Cloudy", hi: 32, lo: 26 },
      { d: "Fri", icon: "clear", cond: "Sunny", hi: 33, lo: 27 }
    ]
  },
  Sylhet: {
    country: "Bangladesh", tempC: 27, tempF: 81, feelsC: 30, feelsF: 86,
    condition: "Light rain", conditionIcon: "rain",
    humidity: "91%", wind: "6 km/h", pressure: "1006 hPa",
    sunrise: "5:32 AM", sunset: "6:10 PM",
    hours: [
      { t: "Now", icon: "rain", temp: "26°", rain: "40%" },
      { t: "11 PM", icon: "rain", temp: "26°", rain: "45%" },
      { t: "12 AM", icon: "storm", temp: "25°", rain: "55%" },
      { t: "1 AM", icon: "rain", temp: "25°", rain: "40%" },
      { t: "2 AM", icon: "clouds", temp: "25°", rain: "20%" },
      { t: "3 AM", icon: "clouds", temp: "24°", rain: "15%" },
      { t: "4 AM", icon: "clouds", temp: "24°", rain: "10%" },
      { t: "5 AM", icon: "clear", temp: "24°", rain: "5%" }
    ],
    days: [
      { d: "Today", icon: "storm", cond: "Thunderstorm", hi: 30, lo: 25 },
      { d: "Tue", icon: "rain", cond: "Heavy rain", hi: 28, lo: 24 },
      { d: "Wed", icon: "rain", cond: "Showers", hi: 29, lo: 24 },
      { d: "Thu", icon: "clouds", cond: "Cloudy", hi: 30, lo: 25 },
      { d: "Fri", icon: "clear", cond: "Sunny", hi: 31, lo: 25 }
    ]
  },
  London: {
    country: "United Kingdom", tempC: 14, tempF: 57, feelsC: 12, feelsF: 54,
    condition: "Overcast", conditionIcon: "clouds",
    humidity: "76%", wind: "18 km/h", pressure: "1015 hPa",
    sunrise: "6:52 AM", sunset: "6:41 PM",
    hours: [
      { t: "Now", icon: "clouds", temp: "14°", rain: "10%" },
      { t: "11 PM", icon: "clouds", temp: "13°", rain: "10%" },
      { t: "12 AM", icon: "rain", temp: "12°", rain: "30%" },
      { t: "1 AM", icon: "rain", temp: "12°", rain: "35%" },
      { t: "2 AM", icon: "clouds", temp: "11°", rain: "20%" },
      { t: "3 AM", icon: "clouds", temp: "11°", rain: "15%" },
      { t: "4 AM", icon: "clouds", temp: "10°", rain: "10%" },
      { t: "5 AM", icon: "clear", temp: "10°", rain: "5%" }
    ],
    days: [
      { d: "Today", icon: "clouds", cond: "Overcast", hi: 15, lo: 10 },
      { d: "Tue", icon: "rain", cond: "Light rain", hi: 14, lo: 9 },
      { d: "Wed", icon: "clear", cond: "Sunny", hi: 16, lo: 8 },
      { d: "Thu", icon: "clouds", cond: "Cloudy", hi: 15, lo: 9 },
      { d: "Fri", icon: "rain", cond: "Showers", hi: 13, lo: 8 }
    ]
  }
};

function renderWeather(city, data) {
  document.getElementById("wc-city").textContent = `${city}, ${data.country}`;
  document.getElementById("wc-tempc").textContent = `${data.tempC}°C`;
  document.getElementById("wc-tempf").textContent = `/ ${data.tempF}°F`;
  document.getElementById("wc-cond").textContent = data.condition;
  document.getElementById("wc-feels").textContent = `Feels like ${data.feelsC}°C / ${data.feelsF}°F`;
  document.getElementById("wc-icon").innerHTML = weatherIcons[data.conditionIcon] || weatherIcons.clear;

  document.getElementById("wi-humidity").textContent = data.humidity;
  document.getElementById("wi-wind").textContent = data.wind;
  document.getElementById("wi-pressure").textContent = data.pressure;
  document.getElementById("wi-sunrise").textContent = data.sunrise;
  document.getElementById("wi-sunset").textContent = data.sunset;

  const hourScroll = document.getElementById("hour-scroll");
  hourScroll.innerHTML = data.hours.map(h => `
    <div class="hour-card">
      <div class="h-time">${h.t}</div>
      ${weatherIconSvg(h.icon, "icon-lg")}
      <div class="h-temp">${h.temp}</div>
      <div class="h-rain">${h.rain}</div>
    </div>
  `).join("");

  const dayList = document.getElementById("day-list");
  dayList.innerHTML = data.days.map(d => `
    <div class="day-row">
      <div class="d-name">${d.d}</div>
      ${weatherIconSvg(d.icon)}
      <div class="d-cond">${d.cond}</div>
      <div class="d-range"><span class="hi">${d.hi}°</span><span class="lo">${d.lo}°</span></div>
    </div>
  `).join("");
}

// loadWeather() is the single entry point the future Flask backend will
// feed. Right now it resolves with local sample data; later it can be
// swapped to `return apiFetchWeather(city)` without touching renderWeather().
async function loadWeather(city) {
  const key = Object.keys(sampleWeather).find(k => k.toLowerCase() === city.toLowerCase());
  const data = sampleWeather[key] || sampleWeather["Dhaka"];
  const displayCity = key || city;
  renderWeather(displayCity, data);
}

function initWeather() {
  const search = document.getElementById("weather-search");
  if (!search) return;

  loadWeather("Dhaka");

  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && search.value.trim()) {
      loadWeather(search.value.trim());
    }
  });

  document.getElementById("weather-nearme").addEventListener("click", () => {
    search.value = "";
    loadWeather("Dhaka"); // sample: "near me" resolves to campus city
  });
}

/* =====================================================================
   Alumni Network
   ===================================================================== */
const alumniData = [
  { name: "Arif Hasan", id: "2020200000768", batch: "65", dept: "CSE", gradYear: "2024", email: "arif.hasan@example.com", phone: "01711-223344", job: "Software Engineer", company: "Microsoft", location: "Seattle, USA", linkedin: "linkedin.com/in/arifhasan", bio: "Backend-leaning full-stack engineer working on Azure developer tooling. Loves mentoring juniors on DSA and job-hunt prep.", mentorship: true },
  { name: "Nusrat Jahan", id: "2019100000512", batch: "64", dept: "BBA", gradYear: "2023", email: "nusrat.jahan@example.com", phone: "01822-334455", job: "Product Manager", company: "bKash", location: "Dhaka, Bangladesh", linkedin: "linkedin.com/in/nusratjahan", bio: "Leads the merchant payments product line. Happy to talk through product management transitions from a business background.", mentorship: true },
  { name: "Tanvir Ahmed", id: "2018200000341", batch: "63", dept: "CSE", gradYear: "2022", email: "tanvir.ahmed@example.com", phone: "+1 416-555-0134", job: "Cloud Engineer", company: "Amazon", location: "Toronto, Canada", linkedin: "linkedin.com/in/tanvirahmed", bio: "Works on AWS infrastructure automation. Can help with cloud certifications and relocating for tech jobs abroad.", mentorship: true },
  { name: "Farzana Akter", id: "2020200000903", batch: "65", dept: "EEE", gradYear: "2024", email: "farzana.akter@example.com", phone: "01933-556677", job: "Data Analyst", company: "Grameenphone", location: "Dhaka, Bangladesh", linkedin: "linkedin.com/in/farzanaakter", bio: "Analyzes network usage data to guide product decisions. New to mentoring but open to a few conversations.", mentorship: false },
  { name: "Shafiul Islam", id: "2017300000221", batch: "62", dept: "CSE", gradYear: "2021", email: "shafiul.islam@example.com", phone: "01644-778899", job: "Backend Developer", company: "Pathao", location: "Chattogram, Bangladesh", linkedin: "linkedin.com/in/shafiulislam", bio: "Builds ride-hailing dispatch systems. Focused on his own projects right now, so not taking on mentees.", mentorship: false },
  { name: "Mahmuda Rahman", id: "2019200000678", batch: "64", dept: "BBA", gradYear: "2023", email: "mahmuda.rahman@example.com", phone: "+65 8123-4567", job: "Strategy Consultant", company: "Accenture", location: "Singapore", linkedin: "linkedin.com/in/mahmudarahman", bio: "Advises clients on market-entry strategy across Southeast Asia. Enjoys mentoring students interested in consulting.", mentorship: true }
];

function renderAlumni(list) {
  const grid = document.getElementById("alumni-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state">No alumni match your search.</div>';
    return;
  }

  grid.innerHTML = list.map(a => `
    <div class="alumni-card">
      <div class="alumni-top">
        <div class="alumni-avatar">${a.name.charAt(0)}</div>
        <div>
          <h4>${escapeHtml(a.name)}</h4>
          <div class="alumni-batch">Batch ${escapeHtml(a.batch)} · ${escapeHtml(a.dept)} · Class of ${escapeHtml(a.gradYear)}</div>
        </div>
        <span class="badge ${a.mentorship ? "badge-available" : "badge-rented"}" style="margin-left:auto;">
          ${a.mentorship ? "Open to mentor" : "Not mentoring"}
        </span>
      </div>
      <div class="alumni-rows">
        <div class="row">${icon("id")} Student ID: <strong>${escapeHtml(a.id)}</strong></div>
        <div class="row">${icon("briefcase")} <strong>${escapeHtml(a.job)}</strong>, ${escapeHtml(a.company)}</div>
        <div class="row">${icon("pin")} ${escapeHtml(a.location)}</div>
        <div class="row">${icon("phone")} ${escapeHtml(a.email)} · ${escapeHtml(a.phone)}</div>
        <div class="row">${icon("briefcase")} <a href="https://${escapeHtml(a.linkedin)}" target="_blank" rel="noopener">${escapeHtml(a.linkedin)}</a></div>
      </div>
      <p class="item-desc" style="margin-top:10px;">${escapeHtml(a.bio)}</p>
    </div>
  `).join("");
}

function initAlumni() {
  const search = document.getElementById("alumni-search");
  if (!search) return;

  renderAlumni(alumniData);

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    const filtered = !q ? alumniData : alumniData.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.batch.toLowerCase().includes(q) ||
      a.dept.toLowerCase().includes(q) ||
      a.gradYear.toLowerCase().includes(q) ||
      a.job.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q) ||
      a.linkedin.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q) ||
      (a.mentorship ? "mentor available mentorship" : "not mentoring").includes(q)
    );
    renderAlumni(filtered);
  });
}

/* =====================================================================
   Find a Home
   ===================================================================== */
let houseItems = [
  {
    id: 1, title: "2-bed flat, walk to campus", location: "Mirpur",
    details: "Quiet residential street, 8 minutes on foot from the north gate. Attached bath, balcony.",
    rent: "18,000", contact: "01715-778899", posted: "Today", status: "available",
    comments: [{ author: "Tasnim", text: "Is the room still available?" }]
  },
  {
    id: 2, title: "Single room, shared kitchen", location: "Dhanmondi",
    details: "Furnished single room in a shared apartment with two other students. Wifi included.",
    rent: "9,500", contact: "01822-114455", posted: "3 days ago", status: "available",
    comments: []
  },
  {
    id: 3, title: "3-bed family apartment", location: "Uttara",
    details: "Spacious apartment near Sector 10, good for a group of roommates. Generator backup.",
    rent: "28,000", contact: "01911-223300", posted: "1 week ago", status: "rented",
    comments: [{ author: "Rakib", text: "Can I visit tomorrow?" }]
  }
];
let homeNextId = 4;

function renderHomes(list) {
  const board = document.getElementById("home-board");
  if (!board) return;
  board.innerHTML = "";

  if (list.length === 0) {
    board.innerHTML = '<div class="empty-state">No listings match your search.</div>';
    return;
  }

  list.forEach(h => {
    const card = document.createElement("div");
    card.className = "item-card";
    const badgeClass = h.status === "rented" ? "badge-rented" : "badge-available";
    const badgeText = h.status === "rented" ? "Rented" : "Available";

    card.innerHTML = `
      <div class="item-head-row">
        <h4>${escapeHtml(h.title)}</h4>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="item-desc">${escapeHtml(h.details)}</p>
      <div class="item-rent">৳${escapeHtml(h.rent)} <small>/ month</small></div>
      <div class="item-meta">
        <span>${icon("pin")} ${escapeHtml(h.location)}</span>
        <span>${icon("phone")} ${escapeHtml(h.contact)}</span>
        <span>${icon("clock")} ${escapeHtml(h.posted)}</span>
      </div>
      <hr class="item-divider" />
      <div class="comments">
        ${h.comments.map(c => `<div class="comment"><b>${escapeHtml(c.author)}</b>${escapeHtml(c.text)}</div>`).join("")}
      </div>
      <form class="comment-form" data-id="${h.id}" data-kind="home">
        <input type="text" placeholder="${h.comments.length ? "Ask about electricity, visits..." : "Add a comment"}" required />
        <button type="submit">Post</button>
      </form>
    `;
    board.appendChild(card);
  });
}

function initFindHome() {
  const form = document.getElementById("home-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("hm-title").value.trim();
    const location = document.getElementById("hm-location").value.trim();
    const details = document.getElementById("hm-details").value.trim();
    const rent = document.getElementById("hm-rent").value.trim();
    const contact = document.getElementById("hm-contact").value.trim();
    if (!title || !location || !rent || !contact) return;

    const newHouse = {
      id: homeNextId++, title, location, details, rent, contact,
      posted: "Just now", status: "available", comments: []
    };

    // apiCreateHouse() will POST to /api/houses once the backend exists.
    await apiCreateHouse(newHouse);
    houseItems.unshift(newHouse);
    renderHomes(applyHomeSearch());
    form.reset();
  });

  document.getElementById("home-board").addEventListener("submit", handleCommentSubmit);
  document.getElementById("home-search").addEventListener("input", () => {
    renderHomes(applyHomeSearch());
  });

  renderHomes(houseItems);
}

function applyHomeSearch() {
  const q = (document.getElementById("home-search").value || "").toLowerCase().trim();
  if (!q) return houseItems;
  return houseItems.filter(h =>
    h.title.toLowerCase().includes(q) ||
    h.location.toLowerCase().includes(q) ||
    h.details.toLowerCase().includes(q) ||
    h.rent.toLowerCase().includes(q)
  );
}

/* =====================================================================
   Search & Filtering (shared comment handler)
   ===================================================================== */
async function handleCommentSubmit(e) {
  if (!e.target.classList.contains("comment-form")) return;
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector("input");
  const text = input.value.trim();
  if (!text) return;

  const id = Number(form.dataset.id);
  const kind = form.dataset.kind;
  const author = (Auth.getUser() && Auth.getUser().name) || "You";
  const comment = { author, text };

  if (kind === "lf") {
    const item = lostItems.find(i => i.id === id);
    item.comments.push(comment);
    await apiPostComment("lost-items", id, comment);
    renderLostFound(applyLostFoundSearch());
  } else {
    const item = houseItems.find(i => i.id === id);
    item.comments.push(comment);
    await apiPostComment("houses", id, comment);
    renderHomes(applyHomeSearch());
  }
}

/* =====================================================================
   API Functions
   (frontend-only for now — each resolves with local/sample data but is
   shaped so a Flask backend can be dropped in behind it later)
   ===================================================================== */
async function apiLogin(name, password) {
  // Future: return (await fetch("/api/login", { method: "POST", ... })).json();
  await sleep(300);
  return { success: true, user: { name, studentId: "2020200000768" } };
}

async function apiSignup({ studentId, name, password }) {
  // Future: return (await fetch("/api/signup", { method: "POST", ... })).json();
  await sleep(300);
  return { success: true, user: { name, studentId } };
}

async function apiLogout() {
  // Future: await fetch("/api/logout", { method: "POST" });
  return true;
}

async function apiFetchUser() {
  // Future: return (await fetch("/api/user")).json();
  return Auth.getUser();
}

async function apiCreateLostItem(item) {
  // Future: return (await fetch("/api/lost-items", { method: "POST", body: JSON.stringify(item) })).json();
  return item;
}

async function apiCreateHouse(house) {
  // Future: return (await fetch("/api/houses", { method: "POST", body: JSON.stringify(house) })).json();
  return house;
}

async function apiPostComment(resource, id, comment) {
  // Future: return (await fetch(`/api/${resource}/${id}/comments`, { method: "POST", body: JSON.stringify(comment) })).json();
  return comment;
}

async function apiFetchWeather(city) {
  // Future: return (await fetch(`/api/weather?city=${encodeURIComponent(city)}`)).json();
  return sampleWeather[city] || sampleWeather["Dhaka"];
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

/* =====================================================================
   Small shared helpers (icons, escaping)
   ===================================================================== */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function icon(name) {
  const paths = {
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.4.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.4 1 1 0 01-.25 1z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2" stroke-linecap="round"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10.5" r="1.6"/><path d="M20.5 15.5l-5-4.5-3.5 3-2.5-2-6 5.5"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2.2"/><circle cx="8.3" cy="11" r="1.9"/><path d="M5.6 16c.5-1.6 1.7-2.3 2.7-2.3s2.2.7 2.7 2.3" stroke-linecap="round"/><path d="M14 9.5h4M14 13h4" stroke-linecap="round"/>',
    briefcase: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8 7.5V6a2 2 0 012-2h4a2 2 0 012 2v1.5"/><path d="M3 12.5h18"/>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" stroke-width="1.6">${paths[name] || ""}</svg>`;
}

/* =====================================================================
   Boot
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initDashboardNav();
  initLostFound();
  initWeather();
  initAlumni();
  initFindHome();
});
