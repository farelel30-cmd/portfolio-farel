/**
 * Portfolio Script - Farel El Jalaluddin Rumi
 * Handles Starfield, Lightning, Mascot Nav, Typewriter, Spotlight, Guestbook, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntroLoader();
  initStarfield();
  initLightning();
  initNavbarAndMascot();
  initTypewriter();
  initAvatarToggle();
  initPortfolioTabs();
  initCounters();
  initModals();
  initGuestbook();
  initContactForm();
});

/* ==========================================================================
   1. INTRO LOADER
   ========================================================================== */
function initIntroLoader() {
  const loader = document.getElementById('intro-loader');
  const percentText = document.getElementById('load-percent');
  const progressBar = document.getElementById('load-progress');
  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    const step = Math.floor(Math.random() * 8) + 3;
    progress = Math.min(100, progress + step);
    
    if (percentText) percentText.textContent = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (progress > 30 && progress < 80 && Math.random() < 0.25) {
      triggerLightningFlash();
    }

    if (progress >= 100) {
      clearInterval(interval);
      triggerLightningFlash();
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(updateMascotPosition, 300);
      }, 400);
    }
  }, 45);
}

/* ==========================================================================
   2. STARFIELD CANVAS
   ========================================================================== */
let starfieldCanvas, starfieldCtx;
let stars = [];
let shootingStars = [];

function initStarfield() {
  starfieldCanvas = document.getElementById('starfield-canvas');
  if (!starfieldCanvas) return;
  starfieldCtx = starfieldCanvas.getContext('2d');

  function resize() {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    createStars();
  }
  window.addEventListener('resize', resize);
  resize();

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function createStars() {
    stars = [];
    const isMobile = window.innerWidth < 768;
    const numStars = isMobile ? 120 : 260;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * starfieldCanvas.width,
        y: Math.random() * starfieldCanvas.height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        depth: Math.random() * 0.8 + 0.2
      });
    }
  }

  setInterval(() => {
    if (Math.random() < 0.6) {
      createShootingStar();
    }
  }, 3500);

  function createShootingStar() {
    const startX = Math.random() * starfieldCanvas.width * 0.8;
    const startY = Math.random() * (starfieldCanvas.height * 0.4);
    const length = Math.random() * 80 + 60;
    const speed = Math.random() * 12 + 10;
    const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1);

    shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 1.0,
      decay: Math.random() * 0.03 + 0.015
    });
  }

  function renderStars() {
    starfieldCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

    const offsetX = (mouseX - window.innerWidth / 2) * 0.015;
    const offsetY = (mouseY - window.innerHeight / 2) * 0.015;

    for (let s of stars) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) {
        s.alpha = 1;
        s.twinkleDir = -1;
      } else if (s.alpha <= 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      const px = s.x + offsetX * s.depth;
      const py = s.y + offsetY * s.depth;

      starfieldCtx.beginPath();
      starfieldCtx.arc(px, py, s.size, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      starfieldCtx.shadowBlur = s.size > 1.2 ? 6 : 0;
      starfieldCtx.shadowColor = '#38bdf8';
      starfieldCtx.fill();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life -= ss.decay;

      if (ss.life <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - (ss.dx / ss.speed) * ss.length;
      const tailY = ss.y - (ss.dy / ss.speed) * ss.length;

      const gradient = starfieldCtx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
      gradient.addColorStop(0.3, `rgba(56, 189, 248, ${ss.life * 0.7})`);
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

      starfieldCtx.beginPath();
      starfieldCtx.moveTo(ss.x, ss.y);
      starfieldCtx.lineTo(tailX, tailY);
      starfieldCtx.strokeStyle = gradient;
      starfieldCtx.lineWidth = 2;
      starfieldCtx.stroke();
    }

    requestAnimationFrame(renderStars);
  }

  requestAnimationFrame(renderStars);
}

/* ==========================================================================
   3. ELECTRIC LIGHTNING CANVAS
   ========================================================================== */
let lightningCanvas, lightningCtx;

function initLightning() {
  lightningCanvas = document.getElementById('lightning-canvas');
  if (!lightningCanvas) return;
  lightningCtx = lightningCanvas.getContext('2d');

  function resize() {
    lightningCanvas.width = window.innerWidth;
    lightningCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  setInterval(() => {
    if (Math.random() < 0.5) {
      triggerLightningFlash();
    }
  }, 18000);
}

function triggerLightningFlash() {
  if (!lightningCanvas || !lightningCtx) return;

  const w = lightningCanvas.width;
  const h = lightningCanvas.height;

  const flashOverlay = document.createElement('div');
  flashOverlay.style.position = 'fixed';
  flashOverlay.style.inset = '0';
  flashOverlay.style.background = 'rgba(56, 189, 248, 0.12)';
  flashOverlay.style.pointerEvents = 'none';
  flashOverlay.style.zIndex = '2';
  flashOverlay.style.transition = 'opacity 0.25s ease-out';
  document.body.appendChild(flashOverlay);

  setTimeout(() => {
    flashOverlay.style.opacity = '0';
    setTimeout(() => flashOverlay.remove(), 250);
  }, 80);

  const startX = w * (0.35 + Math.random() * 0.3);
  const startY = 0;
  const endX = startX + (Math.random() - 0.5) * (w * 0.3);
  const endY = h * (0.65 + Math.random() * 0.35);

  drawLightningBolt(startX, startY, endX, endY, 6, 1.0);

  setTimeout(() => {
    lightningCtx.clearRect(0, 0, w, h);
  }, 160);
}

function drawLightningBolt(x1, y1, x2, y2, displace, alpha) {
  if (displace < 4) {
    lightningCtx.beginPath();
    lightningCtx.moveTo(x1, y1);
    lightningCtx.lineTo(x2, y2);
    lightningCtx.strokeStyle = `rgba(224, 242, 254, ${alpha})`;
    lightningCtx.lineWidth = Math.max(1.5, displace * 0.5);
    lightningCtx.shadowBlur = 16;
    lightningCtx.shadowColor = '#38bdf8';
    lightningCtx.stroke();
    return;
  }

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const normalX = -(y2 - y1);
  const normalY = x2 - x1;
  const len = Math.sqrt(normalX * normalX + normalY * normalY);
  const offset = (Math.random() - 0.5) * displace * 12;

  const nx = midX + (normalX / (len || 1)) * offset;
  const ny = midY + (normalY / (len || 1)) * offset;

  drawLightningBolt(x1, y1, nx, ny, displace / 1.6, alpha);
  drawLightningBolt(nx, ny, x2, y2, displace / 1.6, alpha);

  if (Math.random() < 0.28 && displace > 8) {
    const branchX = nx + (Math.random() - 0.5) * 80;
    const branchY = ny + Math.random() * 120;
    drawLightningBolt(nx, ny, branchX, branchY, displace / 2, alpha * 0.6);
  }
}

/* ==========================================================================
   4. FLOATING NAVBAR & PEAKING MASCOT
   ========================================================================== */
function initNavbarAndMascot() {
  const navItems = document.querySelectorAll('.nav-item');
  const mascot = document.querySelector('.mascot-container');
  if (!mascot || navItems.length === 0) return;

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      hopMascotTo(item);

      if (targetSection) {
        const offset = 80;
        const targetPos = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeNav = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeNav && !activeNav.classList.contains('active')) {
          navItems.forEach(n => n.classList.remove('active'));
          activeNav.classList.add('active');
          hopMascotTo(activeNav);
        }
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(s => observer.observe(s));
  window.addEventListener('resize', updateMascotPosition);
}

function hopMascotTo(targetItem) {
  const mascot = document.querySelector('.mascot-container');
  const navPill = document.querySelector('.navbar-pill');
  if (!mascot || !targetItem || !navPill) return;

  const itemRect = targetItem.getBoundingClientRect();
  const navRect = navPill.getBoundingClientRect();
  const targetX = (itemRect.left - navRect.left) + (itemRect.width / 2) - (mascot.offsetWidth / 2);

  mascot.classList.remove('mascot-hop');
  void mascot.offsetWidth;
  mascot.classList.add('mascot-hop');

  mascot.style.transform = `translateX(${targetX}px)`;
}

function updateMascotPosition() {
  const activeItem = document.querySelector('.nav-item.active') || document.querySelector('.nav-item');
  if (activeItem) {
    const mascot = document.querySelector('.mascot-container');
    const navPill = document.querySelector('.navbar-pill');
    if (!mascot || !navPill) return;

    const itemRect = activeItem.getBoundingClientRect();
    const navRect = navPill.getBoundingClientRect();
    const targetX = (itemRect.left - navRect.left) + (itemRect.width / 2) - (mascot.offsetWidth / 2);
    mascot.style.transform = `translateX(${targetX}px)`;
  }
}

/* ==========================================================================
   5. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    "Frontend Developer",
    "Fullstack Web Dev",
    "Game Developer (Godot)",
    "3D Artist (Blender)",
    "UI/UX Designer",
    "Fotografer & Visual Arts",
    "Siswa PPLG SMKN 11 Semarang"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      charIdx--;
      el.textContent = currentPhrase.substring(0, charIdx);
    } else {
      charIdx++;
      el.textContent = currentPhrase.substring(0, charIdx);
    }

    let delay = isDeleting ? 40 : 90;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   6. AVATAR INTERACTIVE TOGGLE (Student / Cyber Mode)
   ========================================================================== */
function initAvatarToggle() {
  const avatarFrame = document.getElementById('avatar-frame');
  const modeBadge = document.getElementById('avatar-mode-badge');
  if (!avatarFrame) return;

  let isCyber = false;

  function toggleMode() {
    isCyber = !isCyber;
    if (isCyber) {
      avatarFrame.classList.add('hero-mode');
      if (modeBadge) modeBadge.innerHTML = `<span>⚡ Cyber Developer Mode</span>`;
      triggerLightningFlash();
      showToast('Mode Cyber Diaktifkan! ⚡💻');
    } else {
      avatarFrame.classList.remove('hero-mode');
      if (modeBadge) modeBadge.innerHTML = `<span>🎓 PPLG Student Mode</span>`;
      showToast('Mode Siswa PPLG SMKN 11 Semarang 🎓');
    }
  }

  avatarFrame.addEventListener('click', toggleMode);
  if (modeBadge) modeBadge.addEventListener('click', toggleMode);
}

/* ==========================================================================
   7. PORTFOLIO SUB-TABS
   ========================================================================== */
function initPortfolioTabs() {
  const tabs = document.querySelectorAll('.port-sub-tab');
  const panels = document.querySelectorAll('.port-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(target);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. METRIC COUNTER ANIMATIONS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.metric-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(c => {
          const target = parseInt(c.getAttribute('data-count'), 10) || 0;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 15));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              c.textContent = target + '+';
              clearInterval(interval);
            } else {
              c.textContent = current;
            }
          }, 50);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.metrics-row');
  if (metricsSection) observer.observe(metricsSection);
}

/* ==========================================================================
   9. MODALS (Project Details, Resume)
   ========================================================================== */
const projectData = {
  savings: {
    title: "Savings Journal",
    badge: "Fullstack & Realtime PostgreSQL",
    image: "assets/images/proj_savings.jpg",
    tags: ["HTML", "CSS", "JavaScript", "Supabase Auth", "PostgreSQL", "RLS", "Supabase Realtime", "GitHub Pages"],
    desc: "Mengembangkan website pencatatan tabungan bersama yang memungkinkan dua pengguna mengelola setoran mingguan, memantau progres target keuangan, melihat riwayat transaksi, serta melakukan pencatatan penarikan dan catatan bersama secara realtime.",
    features: [
      "Sinkronisasi data langsung (Real-time synchronization) antar 2 pengguna bersamaan.",
      "Autentikasi terenkripsi dengan Supabase Authentication & Row Level Security (RLS) menjaga privasi data.",
      "Visualisasi progres target keuangan bulanan & mingguan dengan persentase capaian.",
      "Audit trail pencatatan riwayat transaksi dan catatan bersama yang transparan."
    ],
    demoUrl: "https://fareljrr.github.io/savings-journal",
    githubUrl: "https://github.com/fareljrr"
  },
  chat: {
    title: "Real-time Chat Application",
    badge: "Web Realtime Messenger",
    image: "assets/images/proj_chat.jpg",
    tags: ["HTML", "CSS", "JavaScript", "Firebase Auth", "Cloud Firestore", "GitHub Pages"],
    desc: "Mengembangkan aplikasi chat pribadi berbasis web yang memungkinkan dua pengguna saling bertukar pesan secara realtime, dilengkapi dengan fitur status pesan telah dibaca (read receipts) dan sistem login untuk menjaga privasi pengguna.",
    features: [
      "Pengiriman pesan secepat kilat menggunakan listener Cloud Firestore.",
      "Status tanda pesan telah dibaca (read receipts / double check).",
      "Sistem login & otentikasi privat dengan Firebase Authentication.",
      "Tampilan chat modern bernuansa pastel yang sangat nyaman diakses dari smartphone maupun PC."
    ],
    demoUrl: "https://fareljrr.github.io/realtime-chat",
    githubUrl: "https://github.com/fareljrr"
  },
  uks_game: {
    title: "Gim Simulasi Edukasi UKS 2D",
    badge: "Godot Engine 4 Game",
    image: "assets/images/proj_uks_game.jpg",
    tags: ["Godot Engine 4", "GDScript", "Control UI Nodes", "Interactive Drag-and-Drop", "Audio Manager", "SVG / 2D Assets"],
    desc: "Mengembangkan gim simulasi edukasi interaktif berbasis 2D yang memungkinkan pemain berperan sebagai petugas UKS untuk menangani berbagai kasus kesehatan remaja sekolah, melakukan pemeriksaan menggunakan mekanisme interaktif peralatan medis (seperti termometer dan panduan gizi), memberikan edukasi pola hidup sehat, serta dilengkapi dengan sistem mini-game patroli kebersihan lingkungan sekolah dan achievement badges.",
    features: [
      "Pemeriksaan kesehatan interaktif menggunakan termometer, stetoskop, dan panduan gizi.",
      "Mekanisme drag-and-drop peralatan medis dari rak ke badan siswa yang intuitif.",
      "Mini-game patroli kebersihan lingkungan sekolah untuk intervensi kesehatan pencegahan.",
      "Sistem lencana pencapaian (achievement badges) dan edukasi pola hidup sehat remaja."
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/fareljrr"
  },
  blender_3d: {
    title: "3D Asset Modeling & Scene",
    badge: "Blender 3D & CGI",
    image: "assets/images/proj_blender_3d.jpg",
    tags: ["Blender 3D", "3D Modeling", "Cycles", "EEVEE", "PBR Materials", "Studio Lighting", "Asset Creation"],
    desc: "Koleksi aset dan lingkungan 3D interaktif yang dibuat menggunakan Blender, berfokus pada pemodelan ruang tamu modern (sofa, meja bundar, jam dinding dekoratif), pencahayaan sinematik (studio lighting), pembuatan material PBR, serta rendering aset fotorealistik.",
    features: [
      "Pemodelan furnitur dan dekorasi interior modern dengan topologi bersih.",
      "Pencahayaan studio lembut (soft ambient & directional light) dan rendering fotorealistik.",
      "Pembuatan tekstur dan material prosedural PBR (Roughness, Metallic, Normal)."
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/fareljrr"
  },
  uiux_figma: {
    title: "UI/UX Design - Petualangan Nusantara",
    badge: "Figma & Game UI System",
    image: "assets/images/proj_uiux_figma.jpg",
    tags: ["Figma", "Canva", "UI/UX Design", "Game UI Screen", "Design System", "Interactive Prototype"],
    desc: "Merancang antarmuka visual bertema Petualangan Nusantara yang kaya akan ornamen budaya, tombol interaktif bergaya kayu alami berdaun, altar batu candi dengan kristal bercahaya, serta perpaduan warna tropis yang memanjakan mata.",
    features: [
      "Perancangan judul, tipografi 3D bertema candi Nusantara, dan tombol navigasi interaktif.",
      "Desain ikonik ornamen lokal dengan tata letak visual game beresolusi tinggi.",
      "Penerapan hierarki visual yang jelas antara tombol Play, Credit, dan latar belakang pemandangan."
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/fareljrr"
  },
  photography: {
    title: "Visual Arts & Fotografi",
    badge: "Shot on iPhone",
    image: "assets/images/proj_photography.jpg",
    tags: ["Fotografi", "Shot on iPhone", "Mountain Ridge", "Natural Lighting", "Visual Storytelling"],
    desc: "Mengeksplorasi estetika visual lewat lensa kamera iPhone—menekankan pada pencahayaan alami golden hour, panorama perbukitan, komposisi geometris, dan cerita di balik setiap bidikan. Membuka galeri lengkap 27 foto.",
    features: [
      "Panorama perbukitan dan siluet golden hour yang memukau.",
      "Pendekatan komposisi framing dan sudut pandang visual bercerita.",
      "Koleksi 27 foto asli dari iPhone tersaji dalam galeri fullscreen responsif."
    ],
    demoUrl: "photography.html",
    githubUrl: "https://instagram.com/fareljrr_"
  }
};

function initModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-content-body');
  const modalClose = document.getElementById('modal-close-btn');

  function openProjectModal(key) {
    if (key === 'photography') {
      window.open('photography.html', '_blank');
      return;
    }
    const data = projectData[key];
    if (!data || !modalBody) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="tag-badge" style="margin-bottom: 8px; display: inline-block;">${data.badge}</span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 8px;">${data.title}</h2>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;">
          ${data.tags.map(t => `<span class="tag-badge" style="background: rgba(255,255,255,0.08); color: #e2e8f0; border-color: rgba(255,255,255,0.15);">${t}</span>`).join('')}
        </div>
      </div>
      <div style="border-radius: 14px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); max-height: 380px;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <p style="color: #94a3b8; font-size: 1rem; line-height: 1.7; margin-bottom: 20px;">${data.desc}</p>
      <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 10px; font-weight: 700;">Fitur Utama:</h3>
      <ul style="color: #cbd5e1; font-size: 0.92rem; padding-left: 20px; margin-bottom: 26px; line-height: 1.8;">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <a href="https://wa.me/6285113937232?text=Halo%20Farel,%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(data.title)}" class="btn-primary" target="_blank" rel="noopener">Tanya Proyek Ini 💬</a>
        <a href="mailto:fareleljr@gmail.com" class="btn-ghost" target="_blank" rel="noopener">Kirim Email ✉️</a>
      </div>
    `;

    modalOverlay.classList.add('open');
  }

  document.querySelectorAll('.btn-project-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-project');
      openProjectModal(pKey);
    });
  });

  // Resume Modal
  const resumeBtn = document.getElementById('btn-view-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff;">Curriculum Vitae</h2>
          <p style="color: #38bdf8; font-size: 0.95rem;">Farel El Jalaluddin Rumi - Siswa PPLG SMKN 11 Semarang</p>
        </div>
        <div style="background: rgba(8,12,22,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; margin-bottom: 24px; color: #e2e8f0; font-size: 0.95rem; line-height: 1.8;">
          <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px;">Profil Ringkas</h3>
          <p style="color: #94a3b8; margin-bottom: 16px;">Siswa SMK Negeri 11 Semarang jurusan Pengembangan Perangkat Lunak dan Gim (PPLG). Memiliki kemampuan dalam membuat website sederhana maupun kompleks, merancang antarmuka UI/UX, membuat aset 2D (Canva & Figma), memodelkan aset 3D (Blender), serta membuat gim edukasi 2D interaktif dengan Godot Engine.</p>
          
          <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px;">Pendidikan</h3>
          <p><strong>SMK Negeri 11 Semarang</strong> — Pengembangan Perangkat Lunak dan Gim (PPLG)</p>
          <p><strong>SMP Negeri 21 Semarang</strong></p>
          <p style="color: #94a3b8; margin-bottom: 16px;"><strong>SDIT Assalamah Ungaran</strong></p>

          <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px;">Bidang Keahlian Utama</h3>
          <p>• <strong>Web & Programming:</strong> HTML, CSS, JavaScript, Responsive Web, Supabase, Firebase, PostgreSQL, Realtime Synchronization</p>
          <p>• <strong>Game Development:</strong> Godot Engine 4, GDScript, 2D Game Mechanics, UI Nodes</p>
          <p>• <strong>Digital Art & 3D:</strong> Blender 3D, Material & Lighting, Figma UI/UX, Canva</p>
          <p>• <strong>Visual Arts & Fotografi:</strong> Framing, Lighting Composition, Storytelling, Pencahayaan Alami</p>

          <h3 style="color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 12px; margin-top: 16px;">Kontak</h3>
          <p>Email: <a href="mailto:fareleljr@gmail.com" style="color: #38bdf8;">fareleljr@gmail.com</a> | WhatsApp: <a href="https://wa.me/6285113937232" style="color: #38bdf8;">0851-1393-7232</a> | IG: <a href="https://instagram.com/fareljrr_" style="color: #38bdf8;">@fareljrr_</a></p>
        </div>
        <div style="display: flex; justify-content: center; gap: 14px;">
          <button class="btn-primary" onclick="window.print()">Cetak / Simpan PDF 🖨️</button>
        </div>
      `;
      modalOverlay.classList.add('open');
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay) modalOverlay.classList.remove('open');
  });
}

/* ==========================================================================
   10. GUESTBOOK WITH LOCALSTORAGE PERSISTENCE
   ========================================================================== */
const defaultComments = [
  { name: "Teman Sekelas PPLG", text: "Semangat belajarnya di PPLG SMKN 11 Semarang, Rel! Portonya keren parah!", time: "2h ago", avatar: "P" },
  { name: "Rekan Pengembang", text: "Game simulasi UKS di Godot interaksinya halus bgt, mantap!", time: "5h ago", avatar: "R" },
  { name: "Dev Community", text: "Fitur realtime Supabase di Savings Journal clean bgt implementasinya.", time: "1d ago", avatar: "D" },
  { name: "Visitor", text: "Desain 3D Blendernya rapi, sukses terus Farel!", time: "2d ago", avatar: "V" }
];

function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const feed = document.getElementById('comments-feed');
  const nameInput = document.getElementById('gb-name');
  const textInput = document.getElementById('gb-comment');
  const avatarUpload = document.getElementById('gb-avatar-upload');
  const avatarPreview = document.getElementById('gb-avatar-preview');

  let currentAvatarData = null;

  let stored = localStorage.getItem('farel_guestbook_comments');
  let comments = stored ? JSON.parse(stored) : defaultComments;

  function renderComments() {
    if (!feed) return;
    feed.innerHTML = comments.map(c => `
      <div class="comment-bubble">
        <div class="comment-avatar">
          ${c.avatarImg ? `<img src="${c.avatarImg}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : c.avatar}
        </div>
        <div class="comment-content">
          <div class="comment-top">
            <span class="comment-author">${escapeHtml(c.name)}</span>
            <span class="comment-time">${escapeHtml(c.time)}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>
      </div>
    `).join('');
  }

  renderComments();

  if (avatarUpload) {
    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 5MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        currentAvatarData = event.target.result;
        if (avatarPreview) {
          avatarPreview.innerHTML = `<img src="${currentAvatarData}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text) {
        showToast('Mohon isi nama dan komentar Anda!');
        return;
      }

      const initial = name.charAt(0).toUpperCase();
      const newComment = {
        name: name,
        text: text,
        time: "Baru saja",
        avatar: initial,
        avatarImg: currentAvatarData
      };

      comments.unshift(newComment);
      localStorage.setItem('farel_guestbook_comments', JSON.stringify(comments));
      renderComments();

      nameInput.value = '';
      textInput.value = '';
      currentAvatarData = null;
      if (avatarPreview) avatarPreview.textContent = '👤';
      if (avatarUpload) avatarUpload.value = '';

      showToast('Komentar kamu berhasil diposting! 💬');
    });
  }
}

/* ==========================================================================
   11. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btnWa = document.getElementById('btn-submit-wa');
  const btnEmail = document.getElementById('btn-submit-email');
  if (!form) return;

  function validateInputs() {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      showToast('Silakan isi Nama Anda terlebih dahulu.');
      if (nameInput) nameInput.focus();
      return null;
    }
    if (!email) {
      showToast('Silakan isi Email Anda.');
      if (emailInput) emailInput.focus();
      return null;
    }
    if (!message) {
      showToast('Silakan tuliskan Pesan Anda.');
      if (messageInput) messageInput.focus();
      return null;
    }
    return { name, email, message };
  }

  // Handle WhatsApp button
  if (btnWa) {
    btnWa.addEventListener('click', (e) => {
      e.preventDefault();
      const data = validateInputs();
      if (!data) return;

      const origHtml = btnWa.innerHTML;
      btnWa.disabled = true;
      btnWa.innerHTML = `<span>Membuka WhatsApp... 🚀</span>`;

      const waText = encodeURIComponent(`Halo Farel, saya ${data.name} (${data.email}).\n\n${data.message}`);
      const waUrl = `https://wa.me/6285113937232?text=${waText}`;

      setTimeout(() => {
        btnWa.disabled = false;
        btnWa.innerHTML = origHtml;
        window.open(waUrl, '_blank');
        form.reset();
        showToast('Membuka WhatsApp Farel... 💬');
      }, 500);
    });
  }

  // Handle Email button
  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const data = validateInputs();
      if (!data) return;

      const origHtml = btnEmail.innerHTML;
      btnEmail.disabled = true;
      btnEmail.innerHTML = `<span>Menyiapkan Email... ✉️</span>`;

      const subject = encodeURIComponent(`Pesan Portofolio dari ${data.name}`);
      const body = encodeURIComponent(`Halo Farel,\n\nNama: ${data.name}\nEmail: ${data.email}\n\nPesan:\n${data.message}\n\n---\nDikirim via Website Portofolio Farel`);
      const mailUrl = `mailto:fareleljr@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        btnEmail.disabled = false;
        btnEmail.innerHTML = origHtml;
        window.location.href = mailUrl;
        form.reset();
        showToast('Membuka aplikasi Email Anda... ✉️');
      }, 500);
    });
  }
}

/* ==========================================================================
   12. TOAST HELPER
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<span>✨</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
