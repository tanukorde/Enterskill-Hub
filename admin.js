// ==========================
// ADMIN LOGIN
// ==========================
function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;

  if (email === "admin@example.com" && pass === "admin123") {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Invalid credentials ❌");
  }
}

// ==========================
// PROTECT ADMIN PAGE
// ==========================
document.addEventListener("DOMContentLoaded", function () {

  const isAdmin = localStorage.getItem("isAdmin");

  // 🔒 block direct access
  if (window.location.pathname.includes("admin.html")) {
    if (isAdmin !== "true") {
      alert("Access Denied ❌");
      window.location.href = "adminLogin.html";
      return;
    }

    // load data only if admin
    loadUsers();
    displayMentors();
    loadStats();
  }

});

// ==========================
// SECTION SWITCH
// ==========================
function showSection(section) {
  document.querySelectorAll(".admin-section").forEach(div => {
    div.style.display = "none";
  });

  document.getElementById(section).style.display = "block";
}

// ==========================
// USERS
// ==========================
function loadUsers() {
  const select = document.getElementById("selectUser");
  if (!select) return;

  select.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("userData"));

  if (user && user.email) {
    const opt = document.createElement("option");
    opt.value = user.email;
    opt.textContent = user.fullName;
    select.appendChild(opt);
  } else {
    select.innerHTML = "<option>No users found</option>";
  }
}

// ==========================
// USER PROGRESS
// ==========================
function showUserProgress() {
  const progressDiv = document.getElementById("userTrainingContent");
  const user = JSON.parse(localStorage.getItem("userData")) || {};

  progressDiv.innerHTML = "";

  if (!user.email) {
    progressDiv.innerHTML = "<p>No user data</p>";
    return;
  }

  // ROADMAP
  const roadmap = user.roadmapProgress || {};
  const roadmapCount = Object.keys(roadmap).length;

  // TRAINING
  const checklist = user.trainingChecklist || {};
  const trainingCount = Object.keys(checklist).length;

  progressDiv.innerHTML = `
    <p><strong>Name:</strong> ${user.fullName}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Roadmap Steps Completed:</strong> ${roadmapCount}</p>
    <p><strong>Training Checklist Completed:</strong> ${trainingCount}</p>
  `;
}

// ==========================
// MENTORS (ADD)
// ==========================
function addMentor() {
  const name = document.getElementById("mentorName").value;
  const skill = document.getElementById("mentorSkill").value;
  const exp = document.getElementById("mentorExp").value;
  const image = document.getElementById("mentorImage").value;

  if (!name || !skill || !exp || !image) {
    alert("Fill all fields ❌");
    return;
  }

  let mentorList = JSON.parse(localStorage.getItem("mentorList")) || [];

  mentorList.push({
    name,
    skill,
    experience: exp,
    image
  });

  localStorage.setItem("mentorList", JSON.stringify(mentorList));

  alert("Mentor Added ✅");

  displayMentors();
  clearMentorForm();
}

// ==========================
// SHOW MENTORS
// ==========================
function displayMentors() {
  const container = document.getElementById("adminMentorList");
  if (!container) return;

  container.innerHTML = "";

  const mentorList = JSON.parse(localStorage.getItem("mentorList")) || [];

  mentorList.forEach((m, i) => {
    const div = document.createElement("div");
    div.classList.add("mentor-card");

    div.innerHTML = `
      <img src="${m.image}" width="60">
      <h3>${m.name}</h3>
      <p>${m.skill}</p>
      <p>${m.experience}</p>
      <button onclick="deleteMentor(${i})">Delete</button>
    `;

    container.appendChild(div);
  });
}

// ==========================
// DELETE MENTOR
// ==========================
function deleteMentor(index) {
  let mentorList = JSON.parse(localStorage.getItem("mentorList")) || [];

  mentorList.splice(index, 1);
  localStorage.setItem("mentorList", JSON.stringify(mentorList));

  displayMentors();
}

// ==========================
// CLEAR FORM
// ==========================
function clearMentorForm() {
  document.getElementById("mentorName").value = "";
  document.getElementById("mentorSkill").value = "";
  document.getElementById("mentorExp").value = "";
  document.getElementById("mentorImage").value = "";
}

// ==========================
// STATS
// ==========================
function loadStats() {
  const user = JSON.parse(localStorage.getItem("userData"));
  const mentors = JSON.parse(localStorage.getItem("mentorList")) || [];

  const totalUsers = user && user.email ? 1 : 0;

  document.getElementById("totalUsers").innerText = "Users: " + totalUsers;
  document.getElementById("totalMentors").innerText = "Mentors: " + mentors.length;
}

// ==========================
// LOGOUT
// ==========================
function logoutAdmin() {
  localStorage.removeItem("isAdmin");
  window.location.href = "adminLogin.html";
}