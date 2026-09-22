/**
 * Supabase Configuration & Data Layer
 * Bizumuremyi Augustin Portfolio
 */

const SUPABASE_URL = "https://ftexodwszedfkivebsgd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZXhvZHdzemVkZmtpdmVic2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NzUyMzMsImV4cCI6MjEwNDQ1MTIzM30.IdJRgNk3u4Xh2zXg5qXHuOTUnw4LkAMYcay3r-fCCZI";
const TABLE_NAME = "augustin_portfolio_data";
const STORAGE_KEY = "augustin_portfolio_local_cache";

// Initialize Supabase client if library is available
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized successfully.");
  } catch (err) {
    console.warn("Could not initialize Supabase client:", err);
  }
}

/**
 * Default Seed Data adhering strictly to PROJECT_SPEC.md
 */
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    fullName: "Bizumuremyi Augustin",
    heroGreeting: "Hello, I'm",
    role: "Videographer, Photographer, Media Specialist, & Humanities Student",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    phone: "0792721384",
    email: "augustinbizumuremyi24@gmail.com",
    location: "Gisagara District, Rwanda",
    school: "Liquidnet Family High School @ Agahozo Shalom Youth Village",
    level: "Senior Four (S4)",
    graduationYear: "2028",
    combination: "History, Geography, Literature, and Psychology",
    heroHeadline: "Crafting Cinematic Stories & Capturing Powerful Moments",
    heroSubheadline: "Media creator, visual storyteller, and humanities student dedicated to community impact, creative leadership, and documentary visuals.",
    careerObjective: "Motivated Senior Four student with a strong interest in humanities, communication, and media-related activities. Seeking opportunities to grow academically and socially while developing leadership and communication abilities in preparation for future professional and community involvement."
  },
  leadership: [
    {
      id: "lead-1",
      role: "Minister of Communication",
      organization: "Share Blessing Initiative",
      description: "Leading communication strategies, public announcements, and organizing outreach activities to uplift vulnerable community members.",
      icon: "megaphone"
    }
  ],
  memberships: [
    {
      id: "mem-1",
      title: "Media Club",
      role: "Active Member & Creator",
      description: "Responsible for event photography, video recording, documentary coverage, and sound management across school ceremonies.",
      icon: "camera"
    },
    {
      id: "mem-2",
      title: "Share Blessing Initiative",
      role: "Executive Member",
      description: "Community support, outreach programs, and student-driven humanitarian initiatives.",
      icon: "heart"
    },
    {
      id: "mem-3",
      title: "HeForShe Gender Equality Initiative",
      role: "Advocate & Member",
      description: "Championing gender equality, mutual respect, and social justice within the student community.",
      icon: "users"
    }
  ],
  passions: [
    {
      id: "pas-1",
      title: "Media (Photography & Videography)",
      tag: "Visual Arts",
      description: "Directing cinematic short cuts, capturing authentic portraits, camera staging, lighting setups, and color post-processing.",
      icon: "video"
    },
    {
      id: "pas-2",
      title: "Mechanic Design",
      tag: "Engineering",
      description: "Hands-on mechanical modeling, technical drafting, structural curiosity, and machine systems maintenance.",
      icon: "settings"
    },
    {
      id: "pas-3",
      title: "Electronics & Circuitry",
      tag: "Technology",
      description: "Exploring electronic components, circuit testing, sound hardware diagnostics, and cabling setups.",
      icon: "zap"
    },
    {
      id: "pas-4",
      title: "Volleyball",
      tag: "Athletics",
      description: "Passionate volleyball player emphasizing team coordination, agility, high-energy defense, and sportsmanship.",
      icon: "activity"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "First Place: Inspiring Others in Media, Photography & Video",
      issuer: "Liquidnet Family High School / ASYV",
      year: "2025",
      description: "Honored with 1st place recognition for excellence in visual storytelling, peer mentorship in media production, and inspiring fellow students through photography and videography.",
      icon: "award"
    }
  ],
  skills: [
    {
      name: "Basic Computer Skills",
      level: "Proficient",
      detail: "Google Docs, document typing, formatting, presentations, and cloud file management",
      category: "Digital"
    },
    {
      name: "Audio & Sound System Handling",
      level: "Advanced",
      detail: "Live PA system setups, microphone balancing, mixer handling, and cable management",
      category: "Media & Sound"
    },
    {
      name: "Music Selection & Mixing (Basic DJ Skills)",
      level: "Skilled",
      detail: "Track sequencing, beat matching, crowd energy curation, and community event audio",
      category: "Media & Sound"
    },
    {
      name: "Photography & Videography",
      level: "Specialist",
      detail: "Framing, lighting, camera operation, b-roll shooting, and video editing",
      category: "Visual Arts"
    },
    {
      name: "Communication & Teamwork",
      level: "Core Leadership",
      detail: "Public speaking, active listening, team collaboration, and cross-cultural empathy",
      category: "Humanities & Leadership"
    }
  ],
  languages: [
    {
      language: "Kinyarwanda",
      proficiency: "Native / Excellent",
      levelPercent: 100
    },
    {
      language: "English",
      proficiency: "Good (Working Proficiency)",
      levelPercent: 80
    },
    {
      language: "French",
      proficiency: "Basic",
      levelPercent: 45
    }
  ],
  mediaItems: [
    {
      id: "media-1",
      title: "Youth Voices & ASYV Campus Life",
      category: "videography",
      type: "youtube",
      url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
      description: "Cinematic showcase exploring school community energy, cultural celebration, and visual storytelling.",
      featured: true
    },
    {
      id: "media-2",
      title: "Gisagara Landscape & Golden Hour Portraits",
      category: "photography",
      type: "image",
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      description: "High-contrast portrait capture focusing on authentic facial expressions, natural light, and storytelling depth.",
      featured: true
    },
    {
      id: "media-3",
      title: "Agahozo Shalom Cultural Night Documentary",
      category: "videography",
      type: "vimeo",
      url: "https://vimeo.com/76979871",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
      description: "Behind-the-lens documentary short covering student performances, traditional dance, and vibrant celebrations.",
      featured: true
    },
    {
      id: "media-4",
      title: "Sound System Engineering & DJ Session",
      category: "audio",
      type: "image",
      url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
      description: "Live sound mixing setup, acoustic balancing, and electronic hardware staging for student initiatives.",
      featured: false
    },
    {
      id: "media-5",
      title: "Volleyball Tournament Finals Coverage",
      category: "photography",
      type: "image",
      url: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1400&q=80",
      thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
      description: "Dynamic high-shutter sports photography freezing split-second spikes and spirited team celebrations.",
      featured: false
    },
    {
      id: "media-6",
      title: "Share Blessing Community Outreach",
      category: "videography",
      type: "youtube",
      url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
      description: "Documentation of compassionate student engagement, food distribution, and community support in Gisagara.",
      featured: true
    }
  ]
};

/**
 * Service API to interact with Supabase & Local Cache
 */
const PortfolioService = {
  /**
   * Fetch portfolio data from Supabase or fallback to cache/defaults
   */
  async getPortfolioData() {
    // 1. Try fetching live from Supabase
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(TABLE_NAME)
          .select("*")
          .eq("section_key", "main_portfolio")
          .maybeSingle();

        if (!error && data && data.content) {
          console.log("Loaded portfolio data from Supabase:", data);
          // Update local cache
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
          return data.content;
        } else if (error) {
          console.warn("Supabase query note (using fallback):", error.message || error);
        }
      } catch (e) {
        console.warn("Supabase network error, switching to cache/defaults:", e);
      }
    }

    // 2. Try loading from localStorage cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.profile) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Local cache read error:", e);
    }

    // 3. Fallback to hardcoded default
    return DEFAULT_PORTFOLIO_DATA;
  },

  /**
   * Save portfolio data to Supabase and update local cache
   */
  async savePortfolioData(newData) {
    // Update local cache immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

    if (!supabaseClient) {
      console.warn("Supabase client not initialized; saved to local cache only.");
      return { success: true, localOnly: true };
    }

    try {
      const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .upsert({
          section_key: "main_portfolio",
          content: newData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });

      if (error) {
        console.error("Supabase upsert error:", error);
        return { success: false, error: error.message || error, localOnly: true };
      }

      console.log("Successfully saved portfolio data to Supabase:", data);
      return { success: true, localOnly: false };
    } catch (err) {
      console.error("Failed to save to Supabase:", err);
      return { success: false, error: err.toString(), localOnly: true };
    }
  },

  /**
   * Reset data to default
   */
  async resetDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    return await this.savePortfolioData(DEFAULT_PORTFOLIO_DATA);
  },

  /**
   * Helper to parse YouTube / Vimeo embed links
   */
  parseVideoUrl(url) {
    if (!url) return null;
    url = url.trim();

    // YouTube standard or short
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return {
        platform: 'youtube',
        id: ytMatch[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=FF6B00`,
        thumbnailUrl: null
      };
    }

    // Direct MP4 / WebM video link
    if (url.match(/\.(mp4|webm|ogg)($|\?)/i)) {
      return {
        platform: 'direct',
        embedUrl: url,
        thumbnailUrl: null
      };
    }

    return null;
  }
};

// Make accessible globally
window.PortfolioService = PortfolioService;
window.DEFAULT_PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
