document.addEventListener('DOMContentLoaded', () => {

  // ==========================
  // COMMON FUNCTIONS
  // ==========================
  function getUser() {
    return JSON.parse(localStorage.getItem('userData')) || {};
  }

  function setUser(newData) {
    const existing = getUser();
    const updated = { ...existing, ...newData };
    localStorage.setItem('userData', JSON.stringify(updated));
  }

  // ==========================
  // SIGNUP
  // ==========================
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      setUser({
        fullName,
        email,
        password,
        roadmapProgress: {},
        bookmarkedIdeas: []
      });

      alert("Signup Success ✅");
      window.location.href = "login.html";
    });
  }

  // ==========================
  // LOGIN
  // ==========================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const user = getUser();

      if (!user.email) {
        alert("Please signup first ❌");
        return;
      }

      if (email === user.email && password === user.password) {
        alert("Login Success ✅");
      // Optional: Reset on logout
      localStorage.setItem("trainingCompleted", "false");
        window.location.href = "skills.html";
      } else {
        alert("Wrong email or password ❌");
      }
    });
  }

  // ==========================
  // SKILLS PAGE
  // ==========================
  const nextBtn = document.getElementById('nextBtn');
  const skillLevelSelect = document.getElementById('skillLevel');
  const progressBar = document.getElementById('progressBar');

  if (skillLevelSelect && progressBar) {
    skillLevelSelect.addEventListener('change', function () {
      if (this.value === "beginner") progressBar.style.width = "33%";
      else if (this.value === "intermediate") progressBar.style.width = "66%";
      else if (this.value === "advanced") progressBar.style.width = "100%";
      else progressBar.style.width = "0%";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {

      const selectedSkills = Array.from(document.querySelectorAll('input[name="skill"]:checked')).map(s => s.value);
      const selectedInterests = Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(i => i.value);
      const skillLevel = skillLevelSelect.value;

      if (selectedSkills.length === 0) return alert('Select at least one skill!');
      if (!skillLevel) return alert('Select skill level!');
      if (selectedInterests.length === 0) return alert('Select at least one interest!');

      setUser({
        skills: selectedSkills,
        skillLevel: skillLevel,
        interests: selectedInterests
      });

      window.location.href = 'business-ideas.html';
    });
  }

  // ==========================
  // BUSINESS IDEAS
  // ==========================
  const ideasGrid = document.getElementById('ideasGrid');

  if (ideasGrid) {

    const user = getUser();

    const allIdeas = [
      { name: "Tailoring Service", key: "tailoring", skills: ["tailoring"], interests: ["fashion"] },
      { name: "Handicrafts Store", key: "craft", skills: ["craft"], interests: ["art"] },
      { name: "Tiffin Service", key: "cooking", skills: ["cooking"], interests: ["cooking"] },
      { name: "Repair Shop", key: "repair", skills: ["repair"], interests: ["business"] },
      { name: "Digital Freelancing", key: "digital", skills: ["digital"], interests: ["technology"] },
      { name: "Graphic Design", key: "graphic", skills: ["graphic"], interests: ["digitalMarketing"] },
      { name: "Photography Studio", key: "photography", skills: ["photography"], interests: ["photography"] },
      { name: "Beauty & Makeup", key: "beauty", skills: ["beauty"], interests: ["fashion"] }
    ];

    const recommendedIdeas = allIdeas.filter(idea =>
      (user.skills || []).some(skill => idea.skills.includes(skill)) ||
      (user.interests || []).some(i => idea.interests.includes(i))
    );

    ideasGrid.innerHTML = '';

    recommendedIdeas.forEach(idea => {

      const card = document.createElement('div');
      card.classList.add('idea-card');

      card.innerHTML = `
        <h3>${idea.name}</h3>
        <button class="bookmarkBtn">⭐ Save</button>
      `;

      ideasGrid.appendChild(card);

      card.querySelector('.bookmarkBtn').addEventListener('click', () => {
        let user = getUser();
        let ideas = user.bookmarkedIdeas || [];

        if (!ideas.find(i => i.key === idea.key)) {
          ideas.push(idea);
          setUser({ bookmarkedIdeas: ideas });
          alert("Saved ✅");
        }
      });
    });

    const goDashboardBtn = document.getElementById('goDashboardBtn');
    if (goDashboardBtn) {
      goDashboardBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
      });
    }
  }

  
  // ==========================
// DASHBOARD
// ==========================
const dashboardProgress = document.getElementById('dashboardProgress');
const progressText = document.getElementById('progressText');
const userSkillsEl = document.getElementById('userSkills');
const userLevelEl = document.getElementById('userLevel');
const bookmarkedGrid = document.getElementById('bookmarkedGrid');

if (dashboardProgress && progressText) {

  const user = getUser();

  // ===== ROADMAP PROGRESS =====
  const totalSteps = 5;
  const completedSteps = Object.keys(user.roadmapProgress || {}).length;

  const percent = Math.floor((completedSteps / totalSteps) * 100);

  dashboardProgress.style.width = percent + "%";
  progressText.textContent = `${completedSteps} / ${totalSteps} steps completed`;

  // ===== TRAINING PROGRESS (✅ ADDED) =====
  const currentIdea = localStorage.getItem("currentIdea");

  if (currentIdea) {
    let completed = 0;
    const total = 5;

    const checklist = user.trainingChecklist || {};

    Object.keys(checklist).forEach(key => {
      if (key.startsWith(currentIdea)) {
        completed++;
      }
    });

    progressText.innerHTML += `
      <div class="training-progress-box">
        Training Checklist: ${completed} / ${total} completed
      </div>
    `;
  }

  // ===== USER DATA =====
  if (userSkillsEl) userSkillsEl.textContent = (user.skills || []).join(', ');
  if (userLevelEl) userLevelEl.textContent = user.skillLevel || "Not selected";

  // ===== BOOKMARKED IDEAS =====
  if (bookmarkedGrid) {

    const ideas = user.bookmarkedIdeas || [];
    bookmarkedGrid.innerHTML = '';

    if (ideas.length === 0) {
      bookmarkedGrid.innerHTML = "<p>No ideas saved</p>";
    }

    ideas.forEach(idea => {

      const card = document.createElement('div');
      card.classList.add('idea-card');

      card.innerHTML = `
        <span>${idea.name}</span>
        <button class="viewRoadmapBtn">View Roadmap</button>
        <button class="removeIdeaBtn">Remove</button>
      `;

      // VIEW ROADMAP
      card.querySelector('.viewRoadmapBtn').addEventListener('click', () => {
        localStorage.setItem("currentIdea", idea.key);
        window.location.href = "roadmap.html";
      });

      // REMOVE
      card.querySelector('.removeIdeaBtn').addEventListener('click', () => {
        let user = getUser();
        user.bookmarkedIdeas = (user.bookmarkedIdeas || []).filter(i => i.key !== idea.key);
        setUser({ bookmarkedIdeas: user.bookmarkedIdeas });
        card.remove();
      });

      bookmarkedGrid.appendChild(card);
    });
  }
}
// ==========================
// DASHBOARD BUTTONS (RESUME TRAINING & MENTOR)
// ==========================
const resumeBtn = document.getElementById("resumeTrainingBtn");
const mentorBtn = document.getElementById("mentorBtn");

// Resume Training
if(resumeBtn) {
  resumeBtn.addEventListener("click", () => {
    const currentIdea = localStorage.getItem("currentIdea");
    if(currentIdea) {
      window.location.href = "training.html";
    } else {
      alert("No training in progress. Start a roadmap first!");
    }
  });
}

// Mentor Button

if (mentorBtn) {
  mentorBtn.addEventListener("click", () => {
    window.location.href = "mentors.html";
  });
}

  // ==========================
  // ROADMAP PAGE
  // ==========================
  const roadmapContainer = document.querySelector('.roadmap-container');

  if (roadmapContainer) {

    const steps = document.querySelectorAll('.roadmap-step');
    const idea = localStorage.getItem("currentIdea");

    const nameEl = document.getElementById("businessName");
    if (nameEl && idea) nameEl.innerText = idea;

    steps.forEach((step, index) => {

      const btn = step.querySelector('.complete-btn');
      if (!btn) return;

      const stepKey = idea + "_step" + index;

      let user = getUser();
      user.roadmapProgress = user.roadmapProgress || {};

      if (user.roadmapProgress[stepKey]) {
        btn.textContent = 'Completed';
        btn.disabled = true;
      }

      btn.addEventListener('click', () => {

        let user = getUser();
        user.roadmapProgress = user.roadmapProgress || {};

        user.roadmapProgress[stepKey] = true;

        setUser({ roadmapProgress: user.roadmapProgress });

        btn.textContent = 'Completed';
        btn.disabled = true;
      });
    });
  }

});

// ==========================
// TRAINING BUTTON
// ==========================
function goToTraining() {
  location.href = "training.html";
}

//TRAINING PAGE//
// ==========================
// SET TITLE DIRECTLY
// ==========================
const title = document.getElementById("trainingTitle");
const idea = localStorage.getItem("currentIdea") || "tailoring";

if (title) {
  title.textContent = idea.toUpperCase() + " Training";
}

// ==========================
// SHOW SECTION
// ==========================
function showSection(type){

  const idea = localStorage.getItem("currentIdea") || "tailoring";
  const content = document.getElementById("contentArea");

  if (!content) return;

  const data = {

    tailoring: {
      video: [
        "https://www.youtube.com/watch?v=R4RDuLyWl8U",
        "https://www.youtube.com/watch?v=5C8A7H4Q2o8"
      ],
      article: [
        "https://www.wikihow.com/Sew"
      ],
      checklist: [
        "Learn stitching basics",
        "Take body measurements",
        "Practice simple clothes",
        "Take customer orders",
        "Start tailoring service"
      ]
    },

    cooking: {
      video: [
        "https://www.youtube.com/watch?v=1-SJGQ2HLp8",
        "https://www.youtube.com/watch?v=Ew-3-8itpjc"
      ],
      article: [
        "https://www.wikihow.com/Start-a-Food-Business"
      ],
      checklist: [
        "Plan daily menu",
        "Cook hygienic food",
        "Packaging setup",
        "Delivery planning",
        "Promote tiffin service"
      ]
    },

    craft: {
      video: [
        "https://www.youtube.com/watch?v=3Q5M2o8g1uE",
        "https://www.youtube.com/watch?v=7kVeCqQCxlk"
      ],
      article: [
        "https://www.wikihow.com/Make-Handicrafts"
      ],
      checklist: [
        "Learn craft techniques",
        "Collect raw materials",
        "Make sample products",
        "Set product pricing",
        "Sell online/offline"
      ]
    },

    repair: {
      video: [
        "https://www.youtube.com/watch?v=R6R1Qd8Gx5c",
        "https://www.youtube.com/watch?v=K6h3zJr9VxQ"
      ],
      article: [
        "https://www.wikihow.com/Fix-Electronics"
      ],
      checklist: [
        "Learn repair basics",
        "Buy tools",
        "Practice repairing devices",
        "Handle customers",
        "Start repair service"
      ]
    },

    digital: {
      video: [
        "https://www.youtube.com/watch?v=7X8II6J-6mU",
        "https://www.youtube.com/watch?v=3jZ5vnv-LZc"
      ],
      article: [
        "https://www.wikihow.com/Make-Money-Online"
      ],
      checklist: [
        "Select freelancing skill",
        "Create portfolio",
        "Join freelancing sites",
        "Get first client",
        "Scale income"
      ]
    },

    graphic: {
      video: [
        "https://www.youtube.com/watch?v=YqQx75OPRa0",
        "https://www.youtube.com/watch?v=Zz6eOVaaelI"
      ],
      article: [
        "https://www.wikihow.com/Become-a-Graphic-Designer"
      ],
      checklist: [
        "Learn design basics",
        "Practice tools (Canva/Photoshop)",
        "Create portfolio",
        "Start freelancing",
        "Find clients"
      ]
    },

    photography: {
      video: [
        "https://www.youtube.com/watch?v=7ZVyNjKSr0M",
        "https://www.youtube.com/watch?v=3jZ5vnv-LZc"
      ],
      article: [
        "https://www.wikihow.com/Take-Professional-Photos"
      ],
      checklist: [
        "Learn camera basics",
        "Practice photography",
        "Edit photos",
        "Build portfolio",
        "Start photography service"
      ]
    },

    beauty: {
      video: [
        "https://www.youtube.com/watch?v=FDEh4oJH7pE",
        "https://www.youtube.com/watch?v=2Vv-BfVoq4g"
      ],
      article: [
        "https://www.wikihow.com/Apply-Makeup"
      ],
      checklist: [
        "Learn makeup basics",
        "Practice on models",
        "Buy beauty products",
        "Handle clients",
        "Start beauty service"
      ]
    }
  };

  const current = data[idea];

  if (!current) {
    content.innerHTML = "<p>No training available</p>";
    return;
  }

// ==========================
// MARK TRAINING COMPLETE BUTTON
// ==========================

const completeBtn = document.getElementById("completeTrainingBtn");

if (completeBtn) {
  completeBtn.onclick = function () {

    const idea = localStorage.getItem("currentIdea") || "tailoring";
    let user = JSON.parse(localStorage.getItem("userData")) || {};
    user.trainingChecklist = user.trainingChecklist || {};

   for (let i=0; i <5; i++){
    const key= idea + "_check_" + i;
    delete user.trainingChecklist[key];
   }
    // ✅ ALL CHECK COMPLETE
    for (let i = 0; i < 5; i++) {
      const key = idea + "_check_" + i;
      user.trainingChecklist[key] = true;
    }

    // 🔓 unlock mentors
    localStorage.setItem("trainingCompleted", "true");

    // 💾 save
    localStorage.setItem("userData", JSON.stringify(user));
     location.reload();

     alert("🎉 Training Completed! Mentor page unlocked in Dashboard.");
    window.location.href = "dashboard.html";
  
  }
}
    //back dashbord btn//
const goDashBtn = document.getElementById("goDashboardBtn");

if (goDashBtn) {
  goDashBtn.onclick = function () {
    window.location.href = "dashboard.html";
  }
}
    
    
  // ================= VIDEO =================
  if (type === "video") {
    let html = `<div class="training-box"><h3>Videos</h3>`;
    current.video.forEach((link, i) => {
      html += `<p>Step ${i+1}: 
      <a href="${link}" target="_blank">▶ Watch Video</a></p>`;
    });
    html += `</div>`;
    content.innerHTML = html;
  }

  // ================= ARTICLE =================
  if (type === "article") {
    let html = `<div class="training-box"><h3>Articles</h3>`;
    current.article.forEach((link, i) => {
      html += `<p>Step ${i+1}: 
      <a href="${link}" target="_blank">📖 Read Article</a></p>`;
    });
    html += `</div>`;
    content.innerHTML = html;
  }

  // ================= CHECKLIST =================
  if (type === "checklist") {

    let user = JSON.parse(localStorage.getItem("userData")) || {};
    user.trainingChecklist = user.trainingChecklist || {};

    let html = `<div class="training-box"><h3>Checklist</h3>`;

    current.checklist.forEach((item, index) => {

      const key = idea + "_check_" + index;
      const checked = user.trainingChecklist[key] ? "checked" : "";

      html += `
        <label class="check-item">
  <input type="checkbox" ${checked}
  onchange="saveChecklist('${key}', this)">
  ${item}
</label>
      `;
    });

    html += `</div>`;
    content.innerHTML = html;
  }
}

// ==========================
// SAVE CHECKLIST (FIXED)
// ==========================
function saveChecklist(key, checkbox){

  let user = JSON.parse(localStorage.getItem("userData")) || {};
  user.trainingChecklist = user.trainingChecklist || {};

  if (checkbox.checked) {
    user.trainingChecklist[key] = true;
  } else {
    delete user.trainingChecklist[key];
  }

  localStorage.setItem("userData", JSON.stringify(user));
}

//===========================
//MENTORS PAGE
//===========================

// ==========================
// MENTORS PAGE FINAL
// ==========================
// ==========================
// MENTORS PAGE FINAL
// ==========================
document.addEventListener("DOMContentLoaded", function(){

  const mentorContainer = document.getElementById("mentorContainer");
  if (!mentorContainer) return;

  // 🔒 ALWAYS CHECK TRAINING STATUS
  const completed = localStorage.getItem("trainingCompleted");

  // clear UI
  mentorContainer.innerHTML = "";

  // ==========================
  // 🔒 LOCK CONDITION (FINAL FIX)
  // ==========================
  if (!completed || completed !== "true") {
    mentorContainer.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>🔒 Locked</h2>
        <p>Please complete training first 🚀</p>
      </div>
    `;
    return;
  }

  // ==========================
  // 📦 GET MENTORS FROM ADMIN
  // ==========================
  let mentors = JSON.parse(localStorage.getItem("mentorList")) || [];

  // 🔥 fallback (always 4 mentors)
  if (mentors.length === 0) {
    mentors = [
      { name: "Ramesh Patil", skill: "Tailoring", experience: "10 years", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Sneha Kulkarni", skill: "Cooking", experience: "8 years", image: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Ajay Deshmukh", skill: "Digital Marketing", experience: "5 years", image: "https://randomuser.me/api/portraits/men/56.jpg" },
      { name: "Priya Joshi", skill: "Craft", experience: "7 years", image: "https://randomuser.me/api/portraits/women/65.jpg" }
    ];
  }

  // ==========================
  // 🎯 SHOW MENTORS
  // ==========================
  mentors.forEach((mentor) => {

    const card = document.createElement("div");
    card.classList.add("mentor-card");

    card.innerHTML = `
      <img src="${mentor.image}" alt="${mentor.name}">
      <h3>${mentor.name}</h3>
      <p><strong>Skill:</strong> ${mentor.skill}</p>
      <p><strong>Experience:</strong> ${mentor.experience}</p>
      <button onclick="contactMentor('${mentor.name}')">Contact</button>
    `;

    mentorContainer.appendChild(card);
  });

});


// ==========================
// CONTACT FUNCTION
// ==========================
function contactMentor(name){
  alert("You contacted " + name + " ✅");
}