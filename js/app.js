/**
 * Main Application Engine
 * Bizumuremyi Augustin Portfolio
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Theme System
  initTheme();

  // Initialize Mobile Navigation
  initMobileNav();

  // Initialize Scroll Observers & Navbar Effects
  initScrollEffects();

  // Load and Render Portfolio Data (from Supabase or Cache/Fallback)
  await loadAndRenderPortfolio();

  // Initialize Contact Form
  initContactForm();

  // Initialize Lightbox Modal
  initLightbox();

  // Listen for data updates from Admin Panel
  window.addEventListener('portfolioDataUpdated', (e) => {
    console.log("Portfolio data update detected, refreshing views...");
    renderPortfolio(e.detail || window.currentPortfolioData);
  });
});

// State Store
window.currentPortfolioData = null;
let activeFilter = 'all';

/**
 * Load data using PortfolioService
 */
async function loadAndRenderPortfolio() {
  try {
    const data = await window.PortfolioService.getPortfolioData();
    window.currentPortfolioData = data;
    renderPortfolio(data);
  } catch (error) {
    console.error("Failed to load portfolio data, using defaults:", error);
    window.currentPortfolioData = window.DEFAULT_PORTFOLIO_DATA;
    renderPortfolio(window.DEFAULT_PORTFOLIO_DATA);
  }
}

/**
 * Render all views with portfolio data
 */
function renderPortfolio(data) {
  if (!data) return;

  // 1. Profile & Hero Elements
  if (data.profile) {
    const p = data.profile;
    setSafeText('heroGreeting', p.heroGreeting || "Hello, I'm");
    setSafeText('heroHeadline', p.heroHeadline || "Crafting Cinematic Stories & Capturing Moments");
    setSafeText('heroSubheadline', p.heroSubheadline || "");
    setSafeText('heroPhone', p.phone || "0792721384");
    setSafeText('heroLocation', p.location || "Gisagara District, Rwanda");
    setSafeText('heroLevel', `${p.level || "Senior Four (S4)"} • Class of ${p.graduationYear || "2028"}`);

    // Hero Profile Picture with revolving bright blue ring
    const heroProfileImg = document.getElementById('heroProfileImg');
    if (heroProfileImg && p.heroImage) {
      heroProfileImg.src = p.heroImage;
      heroProfileImg.alt = p.fullName || "Bizumuremyi Augustin";
    }

    setSafeText('aboutBio', p.aboutBio || `Bizumuremyi Augustin is a dedicated ${p.level || "Senior Four"} student currently pursuing his secondary education at ${p.school || "Liquidnet Family High School @ ASYV"}. Balancing deep academic curiosity with high-energy visual production, Augustin captures the pulse of student initiatives, cultural storytelling, and community service across Rwanda.`);
    setSafeText('profileSchool', p.school || "Liquidnet Family High School @ ASYV");
    setSafeText('profileLevel', p.level || "Senior Four (S4)");
    setSafeText('profileCombo', p.combination || "History, Geography, Literature, and Psychology");
    setSafeText('profileGrad', p.graduationYear || "2028");
    setSafeText('careerObjective', `"${p.careerObjective || ""}"`);

    // Contacts
    const contactPhoneEl = document.getElementById('contactPhone');
    if (contactPhoneEl) {
      contactPhoneEl.textContent = p.phone || "0792721384";
      contactPhoneEl.href = `tel:${p.phone || "0792721384"}`;
    }

    const contactEmailEl = document.getElementById('contactEmail');
    if (contactEmailEl) {
      contactEmailEl.textContent = p.email || "augustinbizumuremyi24@gmail.com";
      contactEmailEl.href = `mailto:${p.email || "augustinbizumuremyi24@gmail.com"}`;
    }

    setSafeText('contactLocation', p.location || "Gisagara District, Southern Province, Rwanda");
  }

  // 2. Media Showcase Gallery
  renderMediaGallery(data.mediaItems || []);

  // Set Featured Reel in Hero
  const featuredMedia = (data.mediaItems || []).find(item => item.featured) || (data.mediaItems || [])[0];
  if (featuredMedia) {
    const heroReelTitle = document.getElementById('heroReelTitle');
    if (heroReelTitle) heroReelTitle.textContent = featuredMedia.title;

    const heroReelImage = document.getElementById('heroReelImage');
    if (heroReelImage && featuredMedia.thumbnail) {
      heroReelImage.src = featuredMedia.thumbnail;
      heroReelImage.alt = featuredMedia.title;
    }

    const heroPlayBtn = document.getElementById('heroPlayBtn');
    if (heroPlayBtn) {
      heroPlayBtn.onclick = () => openLightbox(featuredMedia);
    }
  }

  // 3. Extracurricular Passions
  renderPassions(data.passions || []);

  // 4. Achievement Spotlight
  if (data.achievements && data.achievements.length > 0) {
    const ach = data.achievements[0];
    setSafeText('awardTitle', ach.title);
    setSafeText('awardDesc', ach.description);
  }

  // 5. Skills List
  renderSkills(data.skills || []);

  // 6. Languages List
  renderLanguages(data.languages || []);
}

/**
 * Render Media Gallery items with filtering
 */
function renderMediaGallery(items) {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  const filtered = activeFilter === 'all' 
    ? items 
    : items.filter(i => i.category && i.category.toLowerCase() === activeFilter.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-text-secondary);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No media items found in this category.</p>
        <button class="btn btn-secondary" onclick="setFilter('all')">View All Works</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    // Determine thumbnail
    let thumb = item.thumbnail;
    const parsed = window.PortfolioService.parseVideoUrl(item.url);
    if (!thumb && parsed && parsed.thumbnailUrl) {
      thumb = parsed.thumbnailUrl;
    }
    if (!thumb) {
      thumb = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80";
    }

    const isVideo = item.type === 'youtube' || item.type === 'vimeo' || item.type === 'video';
    const typeLabel = item.type === 'youtube' ? 'YouTube' : (item.type === 'vimeo' ? 'Vimeo' : (isVideo ? 'Video' : 'Photo'));

    return `
      <div class="media-card reveal-on-scroll" data-id="${item.id}" onclick="handleMediaClick('${item.id}')">
        <div class="media-thumb-container">
          <img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="media-type-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              ${isVideo 
                ? '<polygon points="5 3 19 12 5 21 5 3"></polygon>' 
                : '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline>'}
            </svg>
            ${typeLabel}
          </span>
          <div class="card-play-overlay">
            <div class="play-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
        <div class="media-body">
          <span class="media-category-tag">${escapeHtml(item.category || "Media")}</span>
          <h3 class="media-card-title">${escapeHtml(item.title)}</h3>
          <p class="media-card-desc">${escapeHtml(item.description || "")}</p>
          <div class="media-card-footer">
            <span>${isVideo ? 'Interactive Player' : 'High Resolution'}</span>
            <span class="view-action-text">
              View Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-observe newly inserted items for scroll animation
  observeRevealElements(container);
}

// Global handler for media cards
window.handleMediaClick = function(id) {
  if (!window.currentPortfolioData || !window.currentPortfolioData.mediaItems) return;
  const item = window.currentPortfolioData.mediaItems.find(i => i.id === id);
  if (item) {
    openLightbox(item);
  }
};

window.setFilter = function(category) {
  activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
  });
  if (window.currentPortfolioData) {
    renderMediaGallery(window.currentPortfolioData.mediaItems || []);
  }
};

// Setup filter button events
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    window.setFilter(filter);
  });
});

/**
 * Render Passions
 */
function renderPassions(passions) {
  const container = document.getElementById('passionsGrid');
  if (!container) return;

  container.innerHTML = passions.map(p => `
    <div class="passion-card reveal-on-scroll">
      <div class="passion-header">
        <span class="passion-tag">${escapeHtml(p.tag || "Field")}</span>
        <span class="passion-icon">
          ${getPassionIcon(p.icon)}
        </span>
      </div>
      <h3 class="passion-title">${escapeHtml(p.title)}</h3>
      <p class="passion-desc">${escapeHtml(p.description)}</p>
    </div>
  `).join('');

  observeRevealElements(container);
}

function getPassionIcon(iconName) {
  switch (iconName) {
    case 'video':
      return `<i class="fa-solid fa-video"></i>`;
    case 'settings':
      return `<i class="fa-solid fa-gears"></i>`;
    case 'zap':
      return `<i class="fa-solid fa-bolt"></i>`;
    case 'activity':
      return `<i class="fa-solid fa-volleyball"></i>`;
    default:
      return `<i class="fa-solid fa-star"></i>`;
  }
}

/**
 * Render Skills
 */
function renderSkills(skills) {
  const container = document.getElementById('skillsList');
  if (!container) return;

  container.innerHTML = skills.map(s => `
    <div class="skill-row reveal-on-scroll">
      <div class="skill-header">
        <span class="skill-name">${escapeHtml(s.name)}</span>
        <span class="skill-level-badge">${escapeHtml(s.level || "Proficient")}</span>
      </div>
      <p class="skill-detail">${escapeHtml(s.detail || "")}</p>
    </div>
  `).join('');

  observeRevealElements(container);
}

/**
 * Render Languages
 */
function renderLanguages(languages) {
  const container = document.getElementById('languagesList');
  if (!container) return;

  container.innerHTML = languages.map(lang => `
    <div class="language-card reveal-on-scroll">
      <div class="language-meta">
        <span class="lang-name">${escapeHtml(lang.language)}</span>
        <span class="lang-prof">${escapeHtml(lang.proficiency)}</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${lang.levelPercent || 80}%;"></div>
      </div>
    </div>
  `).join('');

  observeRevealElements(container);
}

/**
 * Lightbox Modal Logic
 */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('closeLightboxBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openLightbox(item) {
  const modal = document.getElementById('lightboxModal');
  const playerBox = document.getElementById('lightboxPlayer');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const catEl = document.getElementById('lightboxCategory');

  if (!modal || !playerBox) return;

  titleEl.textContent = item.title;
  descEl.textContent = item.description || "";
  catEl.textContent = item.category ? item.category.toUpperCase() : "MEDIA";

  // Parse video URL or image
  const parsed = window.PortfolioService.parseVideoUrl(item.url);

  if (parsed && (parsed.platform === 'youtube' || parsed.platform === 'vimeo')) {
    playerBox.innerHTML = `
      <iframe 
        src="${parsed.embedUrl}" 
        title="${escapeHtml(item.title)}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
  } else if (item.type === 'video' || (parsed && parsed.platform === 'direct')) {
    playerBox.innerHTML = `
      <video src="${escapeHtml(item.url)}" controls autoplay playsinline style="width: 100%; height: 100%; object-fit: contain;">
        Your browser does not support HTML5 video.
      </video>
    `;
  } else {
    // High-resolution image
    playerBox.innerHTML = `
      <img src="${escapeHtml(item.url || item.thumbnail)}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: contain;">
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  const playerBox = document.getElementById('lightboxPlayer');
  if (modal) {
    modal.classList.remove('active');
  }
  if (playerBox) {
    // Clear innerHTML to stop any video playback
    playerBox.innerHTML = '';
  }
  document.body.style.overflow = '';
}

/**
 * Dark / Light Theme Toggle
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Read saved theme or system preference
  const savedTheme = localStorage.getItem('augustin_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark per spec

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('augustin_theme', theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/**
 * Scroll effects and intersection observer
 */
let scrollObserver = null;

function initScrollEffects() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  observeRevealElements(document);
}

function observeRevealElements(scope) {
  if (!scrollObserver) return;
  const elements = scope.querySelectorAll('.reveal-on-scroll:not(.is-visible), .scale-reveal:not(.is-visible)');
  elements.forEach(el => scrollObserver.observe(el));
}

/**
 * Contact Form submission
 * Sends directly to Augustin's email: augustinbizumuremyi24@gmail.com
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    const recipient = "augustinbizumuremyi24@gmail.com";
    const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
    const mailtoBody = encodeURIComponent(
      `Hello Augustin,\n\nSender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}\n\n---\nSent via your portfolio contact form.`
    );

    // Open user's email client addressed directly to Augustin
    window.location.href = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

    showToast(`Thank you, ${name}! Your email to Augustin (${recipient}) has been prepared.`);
    form.reset();
  });
}

/**
 * Toast Notification Utility
 */
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Safe text helper
function setSafeText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Escape HTML utility
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
