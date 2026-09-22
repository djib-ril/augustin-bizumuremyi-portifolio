# AGENT DIRECTIVE: BIZUMUREMYI AUGUSTIN E-PORTFOLIO (VANILLA STACK)

## 1. PROJECT SPECIFICATION & OWNER DETAILS

### Owner Profile
- **Full Name:** Bizumuremyi Augustin
- **Role / Vibe:** Videographer, Photographer, Media Specialist, & Humanities Student
- **Phone:** 0792721384
- **Email:** augustinbizumuremyi24@gmail.com
- **Location:** Gisagara District, Rwanda
- **School:** Liquidnet Family High School @ Agahozo Shalom Youth Village
- **Level:** Senior Four (S4) | Expected Graduation: 2028
- **Combination:** History, Geography, Literature, and Psychology

### Career Objective
Motivated Senior Four student with a strong interest in humanities, communication, and media-related activities. Seeking opportunities to grow academically and socially while developing leadership and communication abilities in preparation for future professional and community involvement.

### Content & Sections
1. **Hero Section:** High-impact media aesthetic, dynamic headline, quick contact links, and interactive media showcase highlight.
2. **About & Background:** Biography, humanities focus, leadership, and community involvement.
3. **Leadership & Responsibilities:** 
   - Minister of Communication (Share Blessing Initiative)
4. **Memberships & Organizations:**
   - Media Club (Photography, video coverage, media activities)
   - Share Blessing Initiative (Community support & organizational activities)
   - HeForShe Gender Equality Initiative
5. **Extracurricular & Technical Passions:**
   - Media (Photography & Videography)
   - Mechanic Design
   - Electronics
   - Sports: Volleyball Player
6. **Achievements & Awards:**
   - Awarded First Place for Inspiring Others in Media, Photography, and Video Activities
7. **Skills & Capabilities:**
   - Basic Computer Skills (Google Docs, document typing, and editing)
   - Audio & Sound System Handling
   - Music Selection & Mixing (Basic DJ Skills)
   - Communication & Teamwork
8. **Languages:**
   - Kinyarwanda (Native/Excellent)
   - English (Good)
   - French (Basic)
9. **Media & Video Showcase Gallery (Core Section):**
   - Video player showcase supporting embedded YouTube/Vimeo URLs and direct HTML5 video upload URLs.
   - Interactive photo/video modal popups for high-resolution viewing.
10. **Admin Dashboard (Protected Page/Modal):**
    - Live content editing panel allowing full CRUD (Create, Read, Update, Delete) operations over all portfolio text, skills, media items, and embedded video links.

---

## 2. STRATEGIC ARCHITECTURE & TECHNICAL CONSTRAINTS

### Core Technology Stack
- **Frontend:** Pure Vanilla JavaScript (ES6+), Semantic HTML5, CSS3 (Modular or CSS Custom Properties).
- **Styling & Aesthetics:** Modern Dark/Light theme toggle using CSS variables.
  - **Primary Palette (Dark Mode):** Deep Slate/Obsidian Base (`#0B0F17`), Rich Gold (`#D4AF37`), Electric Orange accent (`#FF6B00`), Off-White Text (`#F3F4F6`).
  - **Primary Palette (Light Mode):** Clean Studio Canvas (`#FAFAFA`), Deep Charcoal Text (`#111827`), Warm Gold (`#B8860B`), Vibrant Sunset Orange (`#E65100`).
- **Database & Backend:** Supabase (JS Client via CDN or Module).

### UI/UX, Animations & Cursor Effects
- **Interactive Custom Cursor:** Implement a smooth custom trailing target cursor inspired by ReactBits (e.g., Target Cursor / Splash Follower).
  - Smooth target tracking over interactive elements (`a`, `button`, `.media-card`).
  - Smooth transition effects on hover.
  - Disable custom cursor automatically on mobile/touch devices for accessibility.
- **Scroll Animations:** Lightweight Intersection Observer API transitions (fade-up, scale-in, dynamic video card reveals).

### Dynamic Media Uploads & Embed System
- Support direct embed URLs for YouTube/Vimeo.
- Support uploading/pasting image asset URLs and video links.
- Include video preview overlays with custom play buttons and full-screen video modals.

---

## 3. SUPABASE DATABASE SCHEMA & CONFIGURATION

### Target Table: `augustin_portfolio_data`
Implement a single-row document structure or structured relational tables storing all portfolio dynamic content in JSONB or relational rows.

```sql
-- SQL Schema for Supabase Setup
CREATE TABLE IF NOT EXISTS portfolio_data (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  section_key VARCHAR UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS)
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access" ON portfolio_data 
  FOR SELECT USING (true);

-- Allow authenticated/admin write access
CREATE POLICY "Admin Write Access" ON portfolio_data 
  FOR ALL USING (true); -- Replace with auth.uid() check when Supabase Auth is enabled

// SUPABASE CONFIGURATION PLACEHOLDER
const SUPABASE_URL = "https://ftexodwszedfkivebsgd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZXhvZHdzemVkZmtpdmVic2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NzUyMzMsImV4cCI6MjEwNDQ1MTIzM30.IdJRgNk3u4Xh2zXg5qXHuOTUnw4LkAMYcay3r-fCCZI";