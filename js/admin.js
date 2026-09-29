/**
 * Protected Admin Dashboard Engine
 * Bizumuremyi Augustin Portfolio
 * Powers both the Index Login Modal & the Standalone Admin CMS Dashboard
 */

const ADMIN_PIN = "augustin01";
const AUTH_SESSION_KEY = "augustin_admin_authed";

document.addEventListener('DOMContentLoaded', async () => {
  const isDashboardPage = window.location.pathname.includes('admin.html') || document.body.classList.contains('admin-body');

  if (isDashboardPage) {
    // We are on admin.html standalone dashboard
    await initStandaloneAdminDashboard();
  } else {
    // We are on index.html, initialize modal login
    initLoginModal();
  }
});

/**
 * -------------------------------------------------------------
 * 1. LOGIN MODAL LOGIC (INDEX.HTML)
 * -------------------------------------------------------------
 */
function initLoginModal() {
  const openBtn = document.getElementById('openAdminBtn');
  const footerBtn = document.getElementById('footerAdminBtn');
  const modal = document.getElementById('adminModal');
  const closeBtn = document.getElementById('closeAdminBtn');
  const loginForm = document.getElementById('adminLoginForm');
  const pinInput = document.getElementById('adminPinInput');

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 150);
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (footerBtn) footerBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pinInput.value.trim();

      if (entered === ADMIN_PIN) {
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
        window.showToast?.("Admin credentials verified! Redirecting to CMS Dashboard...");
        setTimeout(() => {
          window.location.href = "admin.html";
        }, 400);
      } else {
        const errorAlert = document.getElementById('loginErrorMessage');
        if (errorAlert) {
          errorAlert.style.display = 'block';
        }
        if (window.showToast) {
          window.showToast("Incorrect Admin PIN. Access denied.", "error");
        }
        pinInput.value = '';
      }
    });
  }
}

/**
 * -------------------------------------------------------------
 * 2. STANDALONE ADMIN CMS DASHBOARD (ADMIN.HTML)
 * -------------------------------------------------------------
 */
let adminPortfolioData = null;

async function initStandaloneAdminDashboard() {
  // Check auth session
  const isAuthed = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
  if (!isAuthed) {
    alert("Admin authentication required. Redirecting to home login...");
    window.location.href = "index.html";
    return;
  }

  // Load latest data from Supabase / cache
  try {
    adminPortfolioData = await window.PortfolioService.getPortfolioData();
  } catch (e) {
    console.warn("Could not load from service, using defaults:", e);
    adminPortfolioData = JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
  }

  // Populate form fields
  populateAdminDashboard(adminPortfolioData);

  // Setup Image Dropzone (Hero Profile Image)
  setupHeroImageUploader();

  // Setup Media & Video Uploader (Showcase Gallery)
  setupMediaUploader();

  // Setup Skills CRUD
  setupSkillsManager();

  // Setup Save All Button
  const saveAllBtn = document.getElementById('saveAllBtn');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', saveAllDashboardChanges);
  }

  // Setup Logout Button
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      window.location.href = "index.html";
    });
  }

  // Setup Reset Defaults Button
  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (confirm("Warning: This will reset all portfolio data back to default specifications. Continue?")) {
        await window.PortfolioService.resetDefaults();
        adminPortfolioData = JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
        populateAdminDashboard(adminPortfolioData);
        showAdminToast("Portfolio reset to defaults.");
      }
    });
  }

  // Setup Sidebar Active Link Scrolling
  setupSidebarNavigation();
}

/**
 * Populate all inputs from data object
 */
function populateAdminDashboard(data) {
  if (!data) return;

  // Profile / Hero
  if (data.profile) {
    const p = data.profile;
    setVal('inputHeroGreeting', p.heroGreeting || "Hello, I'm");
    setVal('inputHeroName', p.fullName || "Bizumuremyi Augustin");
    setVal('inputHeroRole', p.role || "");
    setVal('inputHeroHeadline', p.heroHeadline || "");
    setVal('inputHeroBio', p.heroSubheadline || "");
    setVal('inputHeroImagePath', p.heroImage || "");

    const preview = document.getElementById('heroImagePreview');
    const heroLoader = document.getElementById('adminHeroImageLoader');
    const heroFallback = document.getElementById('adminAvatarFallback');

    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarLoader = document.getElementById('sidebarAvatarLoader');
    const sidebarFallback = document.getElementById('sidebarAvatarFallback');

    if (p.heroImage && p.heroImage.trim() !== '') {
      const testImg = new Image();
      testImg.src = p.heroImage;
      testImg.onload = () => {
        if (heroLoader) heroLoader.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'none';
        if (preview) { preview.src = p.heroImage; preview.style.display = 'block'; }

        if (sidebarLoader) sidebarLoader.style.display = 'none';
        if (sidebarFallback) sidebarFallback.style.display = 'none';
        if (sidebarAvatar) { sidebarAvatar.src = p.heroImage; sidebarAvatar.style.display = 'block'; }
      };
      testImg.onerror = () => {
        if (heroLoader) heroLoader.style.display = 'none';
        if (preview) preview.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'flex';

        if (sidebarLoader) sidebarLoader.style.display = 'none';
        if (sidebarAvatar) sidebarAvatar.style.display = 'none';
        if (sidebarFallback) sidebarFallback.style.display = 'flex';
      };
    } else {
      if (heroLoader) heroLoader.style.display = 'none';
      if (preview) preview.style.display = 'none';
      if (heroFallback) heroFallback.style.display = 'flex';

      if (sidebarLoader) sidebarLoader.style.display = 'none';
      if (sidebarAvatar) sidebarAvatar.style.display = 'none';
      if (sidebarFallback) sidebarFallback.style.display = 'flex';
    }

    const sidebarName = document.getElementById('sidebarUserName');
    if (sidebarName && p.fullName) {
      sidebarName.textContent = p.fullName;
    }

    // About & Academics
    setVal('inputSchool', p.school || "");
    setVal('inputLevel', p.level || "");
    setVal('inputCombo', p.combination || "");
    setVal('inputGrad', p.graduationYear || "");
    setVal('inputAboutBio', p.aboutBio || "");
    setVal('inputCareerObjective', p.careerObjective || "");

    // Contact
    setVal('inputPhone', p.phone || "");
    setVal('inputEmail', p.email || "augustinbizumuremyi24@gmail.com");
    setVal('inputLocation', p.location || "");
  }

  // Media Showcase
  renderAdminMediaGrid(data.mediaItems || []);

  // Skills
  renderAdminSkillsList(data.skills || []);

  // Leadership
  renderAdminLeadership(data.leadership || [], data.memberships || []);

  // Achievements
  if (data.achievements && data.achievements.length > 0) {
    const ach = data.achievements[0];
    setVal('inputAwardTitle', ach.title);
    setVal('inputAwardIssuer', ach.issuer);
    setVal('inputAwardYear', ach.year);
    setVal('inputAwardDesc', ach.description);
  }
}

/**
 * Hero Profile Picture Uploader
 */
function setupHeroImageUploader() {
  const fileInput = document.getElementById('heroImageFileInput');
  const pathInput = document.getElementById('inputHeroImagePath');
  const preview = document.getElementById('heroImagePreview');
  const sidebarAvatar = document.getElementById('sidebarAvatar');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const heroLoader = document.getElementById('adminHeroImageLoader');
          const heroFallback = document.getElementById('adminAvatarFallback');
          const sidebarLoader = document.getElementById('sidebarAvatarLoader');
          const sidebarFallback = document.getElementById('sidebarAvatarFallback');

          if (heroLoader) heroLoader.style.display = 'none';
          if (heroFallback) heroFallback.style.display = 'none';
          if (sidebarLoader) sidebarLoader.style.display = 'none';
          if (sidebarFallback) sidebarFallback.style.display = 'none';

          if (preview) { preview.src = dataUrl; preview.style.display = 'block'; }
          if (sidebarAvatar) { sidebarAvatar.src = dataUrl; sidebarAvatar.style.display = 'block'; }
          if (pathInput) pathInput.value = dataUrl;
          if (adminPortfolioData && adminPortfolioData.profile) {
            adminPortfolioData.profile.heroImage = dataUrl;
          }
          showAdminToast("Profile picture uploaded! Click 'Save All Changes' to apply.");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (pathInput) {
    pathInput.addEventListener('input', () => {
      const val = pathInput.value.trim();
      const heroLoader = document.getElementById('adminHeroImageLoader');
      const heroFallback = document.getElementById('adminAvatarFallback');
      const sidebarLoader = document.getElementById('sidebarAvatarLoader');
      const sidebarFallback = document.getElementById('sidebarAvatarFallback');

      if (val) {
        if (heroLoader) heroLoader.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'none';
        if (sidebarLoader) sidebarLoader.style.display = 'none';
        if (sidebarFallback) sidebarFallback.style.display = 'none';
        if (preview) { preview.src = val; preview.style.display = 'block'; }
        if (sidebarAvatar) { sidebarAvatar.src = val; sidebarAvatar.style.display = 'block'; }
        if (adminPortfolioData && adminPortfolioData.profile) {
          adminPortfolioData.profile.heroImage = val;
        }
      } else {
        if (preview) preview.style.display = 'none';
        if (sidebarAvatar) sidebarAvatar.style.display = 'none';
        if (heroFallback) heroFallback.style.display = 'flex';
        if (sidebarFallback) sidebarFallback.style.display = 'flex';
      }
    });
  }
}

/**
 * Media Showcase Uploader (Pictures & Videos)
 */
function setupMediaUploader() {
  const mediaFileInput = document.getElementById('mediaFileInput');
  const urlInput = document.getElementById('newMediaUrl');
  const typeSelect = document.getElementById('newMediaType');
  const titleInput = document.getElementById('newMediaTitle');
  const addBtn = document.getElementById('addNewMediaBtn');

  // File Upload Handler (Pictures or Videos)
  if (mediaFileInput) {
    mediaFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (urlInput) urlInput.value = dataUrl;
        if (typeSelect) {
          typeSelect.value = isVideo ? 'video' : 'image';
        }
        if (titleInput && !titleInput.value) {
          titleInput.value = file.name.replace(/\.[^/.]+$/, "");
        }
        showAdminToast(`Loaded ${isVideo ? 'Video' : 'Picture'} file! Complete details and click 'Add to Showcase Gallery'.`);
      };
      reader.readAsDataURL(file);
    });
  }

  // Add Item to Showcase Button
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = getVal('newMediaTitle');
      const category = getVal('newMediaCategory');
      const type = getVal('newMediaType');
      const url = getVal('newMediaUrl');
      let thumb = getVal('newMediaThumb');
      const desc = getVal('newMediaDesc');

      if (!title || !url) {
        alert("Please provide at least a project title and media URL or uploaded file.");
        return;
      }

      // Auto detect thumbnail if not provided
      if (!thumb) {
        const parsed = window.PortfolioService.parseVideoUrl(url);
        if (parsed && parsed.thumbnailUrl) {
          thumb = parsed.thumbnailUrl;
        } else if (type === 'image') {
          thumb = url;
        } else {
          thumb = "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80";
        }
      }

      const newItem = {
        id: "media-" + Date.now(),
        title,
        category,
        type,
        url,
        thumbnail: thumb,
        description: desc,
        featured: false
      };

      if (!adminPortfolioData.mediaItems) adminPortfolioData.mediaItems = [];
      adminPortfolioData.mediaItems.unshift(newItem);

      renderAdminMediaGrid(adminPortfolioData.mediaItems);

      // Reset input fields
      setVal('newMediaTitle', '');
      setVal('newMediaUrl', '');
      setVal('newMediaThumb', '');
      setVal('newMediaDesc', '');
      if (mediaFileInput) mediaFileInput.value = '';

      showAdminToast("Media item added to gallery! Remember to click 'Save All Changes'.");
    });
  }
}

function renderAdminMediaGrid(items) {
  const container = document.getElementById('adminMediaGrid');
  const countEl = document.getElementById('adminMediaCount');
  if (countEl) countEl.textContent = items.length;
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; color: var(--admin-text-muted);">No media items in showcase yet.</p>`;
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    const isVideo = item.type === 'youtube' || item.type === 'vimeo' || item.type === 'video';
    const thumb = item.thumbnail || (item.type === 'image' ? item.url : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80");

    return `
      <div class="admin-media-card">
        <div class="admin-media-thumb">
          <img src="${thumb}" alt="" loading="lazy">
          <span class="admin-media-badge">${escapeHtml(item.type)}</span>
        </div>
        <div class="admin-media-info">
          <h4 class="admin-media-title">${escapeHtml(item.title)}</h4>
          <span style="font-size: 0.72rem; color: var(--admin-blue); text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(item.category)}</span>
          <p class="admin-media-desc">${escapeHtml(item.description || "No description provided.")}</p>
          <div class="admin-media-actions">
            <button type="button" class="btn-icon-danger" onclick="deleteAdminMediaItem('${item.id}')" title="Delete Item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.deleteAdminMediaItem = function(id) {
  if (!adminPortfolioData || !adminPortfolioData.mediaItems) return;
  if (confirm("Are you sure you want to remove this media item from your showcase?")) {
    adminPortfolioData.mediaItems = adminPortfolioData.mediaItems.filter(i => i.id !== id);
    renderAdminMediaGrid(adminPortfolioData.mediaItems);
    showAdminToast("Media item removed. Click 'Save All Changes' to sync.");
  }
};

/**
 * Skills Manager
 */
function setupSkillsManager() {
  const addBtn = document.getElementById('addNewSkillBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = getVal('newSkillName');
      const level = getVal('newSkillLevel');
      const detail = getVal('newSkillDetail');

      if (!name) {
        alert("Please provide at least a skill name.");
        return;
      }

      const newSkill = { name, level: level || "Proficient", detail: detail || "", category: "General" };
      if (!adminPortfolioData.skills) adminPortfolioData.skills = [];
      adminPortfolioData.skills.push(newSkill);

      renderAdminSkillsList(adminPortfolioData.skills);
      setVal('newSkillName', '');
      setVal('newSkillLevel', '');
      setVal('newSkillDetail', '');
      showAdminToast("Skill added!");
    });
  }
}

function renderAdminSkillsList(skills) {
  const container = document.getElementById('adminSkillsList');
  if (!container) return;

  container.innerHTML = skills.map((s, idx) => `
    <div class="dynamic-item-row">
      <div>
        <strong>${escapeHtml(s.name)}</strong>
        <span style="font-size: 0.8rem; color: var(--admin-blue); margin-left: 0.5rem;">(${escapeHtml(s.level)})</span>
        <p style="font-size: 0.82rem; color: var(--admin-text-muted); margin-top: 0.2rem;">${escapeHtml(s.detail || "")}</p>
      </div>
      <button type="button" class="btn-icon-danger" onclick="deleteAdminSkillItem(${idx})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

window.deleteAdminSkillItem = function(index) {
  if (!adminPortfolioData || !adminPortfolioData.skills) return;
  adminPortfolioData.skills.splice(index, 1);
  renderAdminSkillsList(adminPortfolioData.skills);
  showAdminToast("Skill removed.");
};

function renderAdminLeadership(leadership, memberships) {
  const container = document.getElementById('adminLeadershipList');
  if (!container) return;

  const allItems = [...leadership, ...memberships];
  container.innerHTML = allItems.map(item => `
    <div class="dynamic-item-row">
      <div>
        <strong>${escapeHtml(item.title || item.organization)}</strong>
        <span style="font-size: 0.85rem; color: var(--admin-blue); margin-left: 0.5rem;">— ${escapeHtml(item.role)}</span>
        <p style="font-size: 0.82rem; color: var(--admin-text-muted); margin-top: 0.2rem;">${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Save All Changes to Supabase and LocalStorage
 */
async function saveAllDashboardChanges() {
  if (!adminPortfolioData) return;

  const saveBtn = document.getElementById('saveAllBtn');
  const indicator = document.getElementById('supabaseStatusIndicator');

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Saving...</span>`;
  }

  // Update profile from form inputs
  adminPortfolioData.profile = {
    ...adminPortfolioData.profile,
    fullName: getVal('inputHeroName'),
    heroGreeting: getVal('inputHeroGreeting'),
    role: getVal('inputHeroRole'),
    heroHeadline: getVal('inputHeroHeadline'),
    heroSubheadline: getVal('inputHeroBio'),
    heroImage: getVal('inputHeroImagePath') || adminPortfolioData.profile.heroImage,
    school: getVal('inputSchool'),
    level: getVal('inputLevel'),
    combination: getVal('inputCombo'),
    graduationYear: getVal('inputGrad'),
    aboutBio: getVal('inputAboutBio'),
    careerObjective: getVal('inputCareerObjective'),
    phone: getVal('inputPhone'),
    email: getVal('inputEmail'),
    location: getVal('inputLocation')
  };

  // Update achievement
  if (adminPortfolioData.achievements && adminPortfolioData.achievements.length > 0) {
    adminPortfolioData.achievements[0].title = getVal('inputAwardTitle');
    adminPortfolioData.achievements[0].issuer = getVal('inputAwardIssuer');
    adminPortfolioData.achievements[0].year = getVal('inputAwardYear');
    adminPortfolioData.achievements[0].description = getVal('inputAwardDesc');
  }

  // Save via PortfolioService
  const result = await window.PortfolioService.savePortfolioData(adminPortfolioData);

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>Save All Changes</span>`;
  }

  if (result.success) {
    if (indicator) {
      indicator.className = "status-indicator synced";
      indicator.innerHTML = `<i class="fa-solid fa-cloud"></i> <span>Synced to Supabase</span>`;
    }
    showAdminToast(result.localOnly 
      ? "Saved to local cache (Supabase offline)" 
      : "All changes saved live to Supabase successfully!"
    );
  } else {
    showAdminToast("Error saving to Supabase: " + result.error, "error");
  }
}

/**
 * Sidebar Navigation Scroll Spy
 */
function setupSidebarNavigation() {
  const menuLinks = document.querySelectorAll('.sidebar-menu .menu-item');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/**
 * Toast helper for admin
 */
function showAdminToast(msg, type = 'success') {
  let container = document.getElementById('toastNotification');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastNotification';
    container.className = 'toast-notification';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #131E33;
    border: 1px solid ${type === 'error' ? '#EF4444' : 'var(--admin-blue, #00D2FF)'};
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    color: #F8FAFC;
    padding: 0.9rem 1.4rem;
    border-radius: 12px;
    font-size: 0.88rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: toastIn 0.3s ease;
  `;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" style="color: ${type === 'error' ? '#EF4444' : '#00D2FF'}; font-size: 1.1rem;"></i>
    <span>${escapeHtml(msg)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Helpers
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
