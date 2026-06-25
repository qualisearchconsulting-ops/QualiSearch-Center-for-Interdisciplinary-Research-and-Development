import os

head = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QualiSearch Academic Press</title>
  <meta name="description" content="QualiSearch Academic Press is an independent open-access scholarly publishing platform committed to promoting rigorous, innovative, and socially responsive research." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <!-- Supabase JS SDK (CDN) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
</head>
<body>

  <!-- TOP BAR -->
  <div class="top-bar" id="top-bar">
    <div class="top-bar-inner">
      <div class="top-bar-brand">
        <a href="index.html" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          <img src="qs_logo.png" alt="QualiSearch Logo" class="top-bar-logo" />
          <span class="top-bar-name">QualiSearch Academic Press</span>
        </a>
      </div>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="about.html" class="nav-link">About</a></li>
          <li><a href="journals.html" class="nav-link">Journals</a></li>
          <li><a href="publish.html" class="nav-link">Call for Papers</a></li>
          <li><a href="policies.html" class="nav-link">Standards & Ethics</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Auth Controls -->
      <div class="nav-auth-controls" id="nav-auth-controls">
        <button class="nav-login-btn" id="nav-login-btn" aria-label="Sign in to your account">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sign In
        </button>

        <div class="nav-user" id="nav-user" hidden>
          <button class="nav-user-btn" id="nav-user-btn" aria-label="Account menu" aria-expanded="false">
            <span class="nav-avatar" id="nav-avatar">?</span>
            <span class="nav-user-name" id="nav-user-name">Account</span>
            <svg class="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="nav-user-dropdown" id="nav-user-dropdown">
            <div class="nav-user-info">
              <span class="nav-user-fullname" id="nav-user-fullname">—</span>
              <span class="nav-role-badge" id="nav-role-badge">—</span>
            </div>
            <div class="nav-dropdown-divider"></div>
            <button class="nav-signout-btn" id="nav-signout-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
"""

footer = """
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="qs_logo.png" alt="QualiSearch Logo" class="footer-logo" />
        <div class="footer-brand-text">
          <span class="footer-name">QualiSearch</span>
          <span class="footer-sub">ACADEMIC PRESS</span>
          <span class="footer-tag">Advancing Interdisciplinary Scholarship</span>
        </div>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h5>Navigation</h5>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="journals.html">Journals</a></li>
            <li><a href="publish.html">Call for Papers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Resources</h5>
          <ul>
            <li><a href="policies.html">Standards & Ethics</a></li>
            <li><a href="#">Author Guidelines</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Journals</h5>
          <ul>
            <li><a href="#">QJERP</a></li>
            <li><a href="#" style="opacity: 0.5;">QJHS</a></li>
            <li><a href="#" style="opacity: 0.5;">QJBG</a></li>
            <li><a href="#" style="opacity: 0.5;">QJTI</a></li>
            <li><a href="#" style="opacity: 0.5;">QJPLC</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 QualiSearch Academic Press · QualiSearch Center for Interdisciplinary Research and Development · All Rights Reserved</p>
      <p class="footer-cc">Published under Creative Commons Attribution License</p>
    </div>
  </footer>

  <!-- AUTH MODAL -->
  <div class="auth-backdrop" id="auth-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" hidden>
    <div class="auth-modal" id="auth-modal">
      <div class="auth-modal-header">
        <div class="auth-modal-logo">
          <img src="qs_logo.png" alt="QualiSearch" />
        </div>
        <div class="auth-modal-brand">
          <span class="auth-brand-name">QualiSearch</span>
          <span class="auth-brand-sub">ACADEMIC PRESS</span>
        </div>
        <button class="auth-close-btn" id="auth-close-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" id="tab-signin" role="tab" aria-selected="true" aria-controls="panel-signin">Sign In</button>
        <button class="auth-tab" id="tab-register" role="tab" aria-selected="false" aria-controls="panel-register">Create Account</button>
      </div>

      <div class="auth-panel" id="panel-signin" role="tabpanel" aria-labelledby="tab-signin">
        <h2 class="auth-panel-title" id="auth-modal-title">Welcome Back</h2>
        <p class="auth-panel-sub">Sign in to your QualiSearch account</p>
        <form class="auth-form" id="signin-form" novalidate>
          <div class="auth-field">
            <label for="signin-email">Email Address</label>
            <input type="email" id="signin-email" name="email" placeholder="researcher@institution.edu" autocomplete="email" required />
          </div>
          <div class="auth-field">
            <label for="signin-password">
              Password
              <a href="#" class="auth-forgot-link" id="forgot-password-link">Forgot password?</a>
            </label>
            <div class="auth-input-wrap">
              <input type="password" id="signin-password" name="password" placeholder="Enter your password" autocomplete="current-password" required />
              <button type="button" class="auth-eye-btn" id="signin-eye" aria-label="Toggle password visibility">
                <svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="auth-error" id="signin-error" hidden></div>
          <button type="submit" class="auth-submit-btn" id="signin-submit">
            <span class="auth-btn-label">Sign In</span>
            <span class="auth-spinner" hidden></span>
          </button>
        </form>
        <p class="auth-switch-text">Don't have an account? <button class="auth-switch-btn" id="switch-to-register">Create one</button></p>
      </div>

      <div class="auth-panel" id="panel-register" role="tabpanel" aria-labelledby="tab-register" hidden>
        <h2 class="auth-panel-title">Join QualiSearch</h2>
        <p class="auth-panel-sub">Create your scholarly account</p>
        <form class="auth-form" id="register-form" novalidate>
          <div class="auth-field">
            <label for="reg-fullname">Full Name</label>
            <input type="text" id="reg-fullname" name="fullname" placeholder="Dr. Jane Smith" autocomplete="name" required />
          </div>
          <div class="auth-field">
            <label for="reg-email">Email Address</label>
            <input type="email" id="reg-email" name="email" placeholder="researcher@institution.edu" autocomplete="email" required />
          </div>

          <div class="auth-field">
            <label for="reg-password">Password</label>
            <div class="auth-input-wrap">
              <input type="password" id="reg-password" name="password" placeholder="Min. 8 characters" autocomplete="new-password" required />
              <button type="button" class="auth-eye-btn" id="reg-eye" aria-label="Toggle password visibility">
                <svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <div class="auth-strength" id="reg-strength"><div class="auth-strength-bar" id="reg-strength-bar"></div></div>
          </div>
          <div class="auth-field">
            <label for="reg-confirm">Confirm Password</label>
            <input type="password" id="reg-confirm" name="confirm" placeholder="Re-enter your password" autocomplete="new-password" required />
          </div>
          <div class="auth-error" id="register-error" hidden></div>
          <button type="submit" class="auth-submit-btn" id="register-submit"><span class="auth-btn-label">Create Account</span><span class="auth-spinner" hidden></span></button>
        </form>
        <p class="auth-switch-text">Already have an account? <button class="auth-switch-btn" id="switch-to-signin">Sign in</button></p>
      </div>
    </div>
  </div>

  <div class="qs-toast" id="qs-toast" role="alert" aria-live="polite" hidden>
    <span class="qs-toast-icon" id="qs-toast-icon"></span>
    <span class="qs-toast-msg" id="qs-toast-msg"></span>
  </div>

  <script src="script.js"></script>
</body>
</html>
"""

index_content = """
  <section class="hero" id="home">
    <div class="hero-bg">
      <img src="qs_hero_bg.png" alt="Hero Background" class="hero-bg-img" />
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-content">
      <div class="hero-emblem">
        <img src="qs_logo.png" alt="QualiSearch Emblem" class="hero-emblem-img" />
      </div>
      <h1 class="hero-title">QualiSearch</h1>
      <p class="hero-subtitle">ACADEMIC PRESS</p>
      <p class="hero-tagline">Advancing Interdisciplinary Scholarship</p>
    </div>
  </section>

  <section class="about-section" style="padding: 100px 32px; background: var(--navy-darkest);">
    <div style="max-width: 800px; margin: 0 auto; text-align: center;">
      <h2 class="about-title reveal">Advancing Interdisciplinary Scholarship</h2>
      <div class="about-divider" style="margin: 0 auto 32px;"></div>
      <p class="about-body reveal reveal-delay-1" style="font-size: 16px; margin-bottom: 40px;">
        QualiSearch Academic Press is an independent open-access scholarly publishing platform dedicated to advancing rigorous, ethical, and interdisciplinary research across diverse fields of inquiry.
      </p>
      <div class="reveal reveal-delay-2" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        <a href="about.html" class="nav-login-btn" style="padding: 12px 24px; font-size: 13px; text-decoration:none;">Learn More About Us</a>
        <a href="journals.html" class="browse-btn">Browse Journals</a>
      </div>
    </div>
  </section>
"""

about_content = """
  <div style="padding-top: 60px; background: var(--charcoal);">
    <section class="about-section" id="about">
      <div class="about-grid">
        <div class="about-images">
          <div class="image-card image-card--top">
            <img src="qs_library.png" alt="Academic Library" />
            <div class="image-card-overlay">
              <div class="overlay-logo">
                <img src="qs_logo.png" alt="QualiSearch Logo" />
                <div class="overlay-logo-text">
                  <span class="overlay-name">QualiSearch</span>
                  <span class="overlay-sub">ACADEMIC PRESS</span>
                  <span class="overlay-tag">Advancing Interdisciplinary Scholarship</span>
                </div>
              </div>
            </div>
          </div>
          <div class="image-card image-card--bottom">
            <img src="qs_research.png" alt="Research" />
          </div>
        </div>
        <div class="about-content">
          <div class="section-label">About the Publisher</div>
          <h2 class="about-title">QUALISEARCH ACADEMIC PRESS</h2>
          <div class="about-divider"></div>
          
          <p class="about-body">QualiSearch Academic Press is an independent open-access scholarly publishing platform dedicated to advancing rigorous, ethical, and interdisciplinary research across diverse fields of inquiry. Established under the auspices of QualiSearch Center for Interdisciplinary Research and Development, the publisher is committed to fostering accessible and impactful scholarly communication that contributes to educational advancement, scientific innovation, cultural preservation, institutional development, and evidence-based practice.</p>
          <p class="about-body">The publisher was founded with the vision of creating a sustainable and inclusive academic publishing ecosystem that supports researchers, educators, graduate students, professionals, and institutions in disseminating high-quality scholarly work. Recognizing the evolving landscape of global research and the growing demand for accessible publication platforms, QualiSearch Academic Press promotes open-access dissemination while upholding internationally recognized standards of peer review, publication ethics, and editorial integrity.</p>
          <p class="about-body">QualiSearch Academic Press currently serves as the home of several emerging peer-reviewed journals representing multiple disciplines, including education, health sciences, business and governance, technology and innovation, and Philippine languages and culture. Each journal is designed to address the unique scholarly needs of its respective field while maintaining a shared commitment to methodological rigor, ethical research practices, and socially responsive knowledge production.</p>
          <p class="about-body">The publisher supports a broad range of scholarly contributions, including original research articles, review papers, theoretical and conceptual studies, methodological papers, interdisciplinary research, and practice-based scholarship. Through its journals and scholarly initiatives, QualiSearch Academic Press seeks to encourage research that is locally grounded, globally relevant, and responsive to contemporary societal challenges.</p>
          <p class="about-body">As an open-access publisher, QualiSearch Academic Press believes that scholarly knowledge should remain accessible to researchers, practitioners, educators, policymakers, and communities without unnecessary barriers. The publisher therefore advocates for responsible and transparent scholarly dissemination that promotes collaboration, innovation, and informed decision-making across disciplines and sectors.</p>
          <p class="about-body">QualiSearch Academic Press adheres to established ethical publishing standards through double-blind peer review, plagiarism screening, conflict-of-interest management, editorial independence, and research integrity protocols. The publisher also supports responsible AI-assisted scholarly practices through policies on transparency and disclosure in research and academic writing.</p>
          <p class="about-body">The publishing platform operates in affiliation with QualiSearch Center for Interdisciplinary Research and Development, a Philippine-based institution committed to advancing interdisciplinary research, academic development, scholarly collaboration, and knowledge dissemination.</p>
        </div>
      </div>
    </section>

    <section class="mv-section" id="mission">
      <div class="mv-grid">
        <div class="mv-card reveal">
          <div class="mv-icon">🎯</div>
          <h3>OUR MISSION</h3>
          <p>To advance accessible, ethical, and interdisciplinary scholarly publishing that promotes academic excellence, innovation, cultural preservation, and evidence-based practice across diverse fields of inquiry.</p>
        </div>
        <div class="mv-card reveal reveal-delay-1">
          <div class="mv-icon">👁️</div>
          <h3>OUR VISION</h3>
          <p>To become a credible and globally recognized scholarly publishing platform that empowers researchers, institutions, and communities through high-quality, inclusive, and socially responsive knowledge dissemination.</p>
        </div>
      </div>
    </section>

    <section class="values-section" id="values">
      <div class="values-inner">
        <div class="section-label">Guiding Principles</div>
        <h2 class="about-title">CORE VALUES</h2>
        <div class="about-divider"></div>
        <div class="values-grid">
          <div class="value-card reveal">
            <h4>Academic Integrity</h4>
            <p>Upholding honesty, transparency, and ethical responsibility in scholarly publishing and research dissemination.</p>
          </div>
          <div class="value-card reveal reveal-delay-1">
            <h4>Scholarly Excellence</h4>
            <p>Promoting rigorous, relevant, and high-quality research across disciplines.</p>
          </div>
          <div class="value-card reveal reveal-delay-2">
            <h4>Accessibility</h4>
            <p>Supporting open and inclusive access to scholarly knowledge and academic resources.</p>
          </div>
          <div class="value-card reveal reveal-delay-3">
            <h4>Interdisciplinary Collaboration</h4>
            <p>Encouraging cross-disciplinary dialogue, innovation, and knowledge integration.</p>
          </div>
          <div class="value-card reveal">
            <h4>Social Responsibility</h4>
            <p>Advancing research that contributes meaningfully to communities, institutions, and society.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
"""

journals_content = """
  <div style="padding-top: 60px;">
    <section class="journals-section" id="journals" style="border-top: none; min-height: calc(100vh - 350px);">
      <div class="journals-inner">
        <div class="section-label light">Publications</div>
        <h2 class="about-title" style="color: var(--text-primary);">OUR JOURNALS</h2>
        <div class="about-divider"></div>

        <div class="journal-category reveal">
          <h4 class="category-label">ACTIVE JOURNAL</h4>
          <div class="journal-card" id="journal-qjerp">
            <div class="journal-card-inner">
              <div class="journal-acronym">QJERP</div>
              <div class="journal-info">
                <p class="journal-full-name">QualiSearch Journal of Educational Research and Practice</p>
                <p class="journal-description">An international peer-reviewed open-access journal focusing on educational research, pedagogy, leadership, curriculum studies, inclusive education, educational technology, teacher education, and applied educational practices.</p>
                <div class="journal-meta">
                  <div class="journal-meta-row"><span class="meta-label">Status:</span><span class="meta-value">Active</span></div>
                  <div class="journal-meta-row"><span class="meta-label">DOI Registration:</span><span class="meta-value">Crossref</span></div>
                  <div class="journal-meta-row"><span class="meta-label">Publication Frequency:</span><span class="meta-value">Monthly</span></div>
                </div>
                <a href="#" class="browse-btn" id="btn-browse-qjerp">Browse Journal</a>
              </div>
            </div>
          </div>
        </div>

        <div class="journal-category reveal reveal-delay-1" style="margin-top: 48px;">
          <h4 class="category-label" style="color: var(--text-muted); border-color: rgba(255,255,255,0.05);">FORTHCOMING JOURNALS</h4>
          
          <div class="journal-card forthcoming" style="opacity: 0.8; border-style: dashed; margin-bottom: 12px;">
            <div class="journal-card-inner" style="padding: 16px 22px;">
              <div class="journal-acronym" style="color: var(--text-muted);">QJHS</div>
              <div class="journal-info">
                <p class="journal-full-name" style="margin-bottom: 4px; font-size: 13.5px; font-weight: 600; color: var(--text-primary);">QualiSearch Journal of Health Sciences</p>
                <p class="journal-description" style="margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">A peer-reviewed journal dedicated to health sciences, nursing, allied health, public health, healthcare systems, and medical education.</p>
                <span class="nav-role-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Status: Launching Soon</span>
              </div>
            </div>
          </div>

          <div class="journal-card forthcoming" style="opacity: 0.8; border-style: dashed; margin-bottom: 12px;">
            <div class="journal-card-inner" style="padding: 16px 22px;">
              <div class="journal-acronym" style="color: var(--text-muted);">QJBG</div>
              <div class="journal-info">
                <p class="journal-full-name" style="margin-bottom: 4px; font-size: 13.5px; font-weight: 600; color: var(--text-primary);">QualiSearch Journal of Business and Governance</p>
                <p class="journal-description" style="margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">A multidisciplinary journal focusing on business, management, leadership, governance, entrepreneurship, organizational studies, and public administration.</p>
                <span class="nav-role-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Status: Launching Soon</span>
              </div>
            </div>
          </div>

          <div class="journal-card forthcoming" style="opacity: 0.8; border-style: dashed; margin-bottom: 12px;">
            <div class="journal-card-inner" style="padding: 16px 22px;">
              <div class="journal-acronym" style="color: var(--text-muted);">QJTI</div>
              <div class="journal-info">
                <p class="journal-full-name" style="margin-bottom: 4px; font-size: 13.5px; font-weight: 600; color: var(--text-primary);">QualiSearch Journal of Technology and Innovation</p>
                <p class="journal-description" style="margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">A scholarly journal dedicated to technology-driven research, digital transformation, artificial intelligence, innovation systems, and emerging technological practices.</p>
                <span class="nav-role-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Status: Launching Soon</span>
              </div>
            </div>
          </div>

          <div class="journal-card forthcoming" style="opacity: 0.8; border-style: dashed;">
            <div class="journal-card-inner" style="padding: 16px 22px;">
              <div class="journal-acronym" style="color: var(--text-muted);">QJPLC</div>
              <div class="journal-info">
                <p class="journal-full-name" style="margin-bottom: 4px; font-size: 13.5px; font-weight: 600; color: var(--text-primary);">QualiSearch Journal of Philippine Languages and Culture</p>
                <p class="journal-description" style="margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">A multilingual peer-reviewed journal supporting research in Filipino and Philippine languages, local cultures, indigenous knowledge systems, translation studies, and Philippine-centered scholarship.</p>
                <span class="nav-role-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Status: Launching Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
"""

publish_content = """
  <div style="padding-top: 60px;">
    <section class="publish-section" id="publish" style="min-height: calc(100vh - 350px);">
      <div class="publish-inner">
        <div class="section-label light">For Authors</div>
        <h2 class="publish-title">CALL FOR PAPERS</h2>
        <div class="publish-divider"></div>
        <p class="publish-body reveal" style="margin-bottom: 24px;">
          QualiSearch Academic Press welcomes original research articles, review papers, theoretical papers, methodological studies, and interdisciplinary scholarly works aligned with the aims and scope of its journals.
        </p>
        <p class="publish-body reveal reveal-delay-1" style="margin-bottom: 48px;">
          Researchers, graduate students, educators, professionals, and institutional scholars are invited to contribute to the advancement of accessible and impactful knowledge production.
        </p>
        <div class="reveal reveal-delay-2" style="text-align: center; margin-bottom: 16px;">
          <a href="#" class="nav-login-btn" style="padding: 14px 32px; font-size: 14px; text-decoration: none; border-radius: 8px;">Submit a Manuscript</a>
        </div>
      </div>
    </section>
  </div>
"""

policies_content = """
  <div style="padding-top: 60px;">
    <section class="policies-section" id="policies" style="min-height: calc(100vh - 350px);">
      <div class="policies-inner">
        <div class="section-label">Governance</div>
        <h2 class="policies-title">EDITORIAL POLICIES</h2>
        <div class="policies-divider"></div>
        
        <div class="reveal" style="margin-bottom: 48px;">
          <p class="about-body">QualiSearch Academic Press is committed to maintaining high standards of scholarly publishing through transparent editorial practices, ethical research dissemination, and rigorous peer review. All journals under the publisher operate in accordance with principles of academic integrity, editorial independence, fairness, and responsible scholarly communication.</p>
          <p class="about-body">The publisher upholds policies designed to ensure the credibility, quality, accessibility, and long-term preservation of published scholarly works.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">PEER REVIEW POLICY</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">All manuscripts submitted to journals under QualiSearch Academic Press undergo a double-blind peer review process. Authors and reviewers remain anonymous throughout the review procedure to promote impartiality, fairness, and objective scholarly evaluation.</p>
          <p class="about-body">Each submission is initially screened by the editorial office to determine alignment with the journal’s aims and scope, formatting requirements, and ethical standards. Manuscripts that pass preliminary evaluation are forwarded to at least two independent reviewers with expertise relevant to the manuscript’s subject area.</p>
          <p class="about-body">Reviewers evaluate submissions based on:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Originality and scholarly contribution</li>
            <li>Methodological rigor</li>
            <li>Clarity and organization</li>
            <li>Relevance to the journal’s scope</li>
            <li>Ethical compliance</li>
            <li>Overall academic quality</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">Editorial decisions may include:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Acceptance</li>
            <li>Acceptance with minor revisions</li>
            <li>Major revisions</li>
            <li>Resubmission for review</li>
            <li>Rejection</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">Final editorial decisions are based solely on scholarly merit, reviewer recommendations, editorial evaluation, and compliance with publication standards.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">PUBLICATION ETHICS</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">QualiSearch Academic Press adheres to recognized standards of publication ethics and research integrity. Authors, reviewers, editors, and editorial staff are expected to uphold ethical scholarly practices throughout the publication process.</p>
          <p class="about-body">The publisher does not tolerate:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Plagiarism</li>
            <li>Fabricated or falsified data</li>
            <li>Duplicate submission</li>
            <li>Redundant publication</li>
            <li>Unethical research practices</li>
            <li>Citation manipulation</li>
            <li>Undisclosed conflicts of interest</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">All manuscripts may undergo plagiarism screening prior to peer review and publication.</p>
          <p class="about-body">Authors are responsible for ensuring:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>The originality of submitted work</li>
            <li>Proper citation and attribution</li>
            <li>Accuracy of data and findings</li>
            <li>Ethical treatment of research participants</li>
            <li>Compliance with institutional and legal research requirements</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">The publisher reserves the right to reject, retract, or correct published works when ethical violations are identified.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">COPYRIGHT & LICENSING</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">Authors retain copyright of their published works unless otherwise specified by journal policy.</p>
          <p class="about-body">By submitting and publishing with QualiSearch Academic Press, authors grant the publisher the non-exclusive right to publish, archive, distribute, and preserve the scholarly work in digital formats.</p>
          <p class="about-body">Published articles are made openly accessible to promote wider dissemination of scholarly knowledge. Licensing arrangements and reuse permissions may vary depending on the journal and publication agreement.</p>
          <p class="about-body">Authors are responsible for securing permission to use copyrighted materials, including images, tables, figures, and extensive quoted content.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">ARCHIVING & PRESERVATION POLICY</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">QualiSearch Academic Press recognizes the importance of preserving scholarly content for long-term accessibility and academic continuity.</p>
          <p class="about-body">Published articles are maintained within the publisher’s digital archive infrastructure to ensure persistent accessibility and citation stability. The publisher supports responsible digital preservation practices through:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>DOI registration</li>
            <li>Stable article landing pages</li>
            <li>Structured issue archiving</li>
            <li>Metadata preservation</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">The publisher continuously works toward strengthening long-term digital preservation systems and archival accessibility.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">USE OF ARTIFICIAL INTELLIGENCE</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">QualiSearch Academic Press acknowledges the increasing role of artificial intelligence (AI) technologies in research and scholarly writing. The publisher permits responsible and transparent use of AI-assisted tools within clearly defined ethical boundaries.</p>
          <p class="about-body">Authors must disclose the use of AI tools when such technologies significantly contribute to:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Manuscript drafting</li>
            <li>Language editing</li>
            <li>Data processing</li>
            <li>Image generation</li>
            <li>Analytical assistance</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">AI tools cannot be credited as authors because they cannot assume responsibility for the integrity, originality, accuracy, or ethical accountability of scholarly work.</p>
          <p class="about-body">Authors remain fully responsible for:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Factual accuracy</li>
            <li>Originality</li>
            <li>Citation integrity</li>
            <li>Ethical compliance</li>
            <li>Final manuscript content</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">The publisher reserves the right to request clarification regarding AI-assisted content when necessary.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">FEES AND BUSINESS MODEL</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">QualiSearch Academic Press operates as an open-access scholarly publisher.</p>
          <p class="about-body">Some journals may require an Article Processing Charge (APC) to support:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Peer review management</li>
            <li>Editorial processing</li>
            <li>Digital publication</li>
            <li>DOI registration</li>
            <li>Publication maintenance</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">APC policies are disclosed transparently within each journal’s publication guidelines.</p>
          <p class="about-body">Payment of APCs does not guarantee manuscript acceptance and does not influence editorial decisions. Editorial evaluation and peer review remain independent of financial considerations.</p>
          <p class="about-body">There are no submission fees unless otherwise specified by individual journal policies.</p>
        </div>

        <h3 class="policies-title reveal" style="font-size: 20px; margin-top: 48px;">COMPLAINTS AND APPEALS</h3>
        <div class="policies-divider" style="width: 30px; margin-bottom: 24px;"></div>
        <div class="reveal">
          <p class="about-body">QualiSearch Academic Press provides authors, reviewers, and readers with mechanisms for raising concerns regarding editorial decisions, publication ethics, or procedural matters.</p>
          <p class="about-body">Authors may submit appeals regarding editorial decisions when substantial evidence or clarification is available. Appeals are evaluated objectively by the editorial office and, when appropriate, by additional editorial or reviewer consultation.</p>
          <p class="about-body">Complaints related to:</p>
          <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 24px; margin-bottom: 16px; font-size: 15px;">
            <li>Ethical concerns</li>
            <li>Conflicts of interest</li>
            <li>Plagiarism</li>
            <li>Editorial conduct</li>
            <li>Publication integrity</li>
          </ul>
          <p class="about-body" style="margin-top: 16px;">will be handled confidentially, fairly, and in accordance with established ethical procedures.</p>
          <p class="about-body">The publisher reserves the right to conduct investigations and implement appropriate corrective actions when necessary.</p>
        </div>

        <div class="reveal" style="margin-top: 64px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05);">
          <p class="about-body" style="margin-bottom: 8px;">For policy-related concerns or inquiries, please contact:</p>
          <p class="about-body">
            <strong style="color: var(--text-primary);">QualiSearch Academic Press</strong><br>
            <span style="font-size: 14px;">Published by QualiSearch Center for Interdisciplinary Research and Development</span><br>
            <span style="margin-top: 8px; display: inline-block;">Email: qualisearchconsulting@gmail.com</span><br>
            Website: www.qualisearchjournal.org
          </p>
        </div>
      </div>
    </section>
  </div>
"""

contact_content = """
  <div style="padding-top: 60px;">
    <section class="contact-section" id="contact" style="min-height: calc(100vh - 350px);">
      <div class="contact-inner">
        <div class="section-label light">Get in Touch</div>
        <h2 class="contact-title">CONTACT US</h2>
        <div class="contact-divider"></div>
        
        <div class="reveal" style="margin-bottom: 48px;">
          <p class="about-body" style="font-size: 15px;">QualiSearch Academic Press welcomes inquiries from researchers, authors, reviewers, editors, institutions, and academic partners regarding manuscript submissions, publication policies, editorial collaborations, conference partnerships, and other scholarly publishing concerns.</p>
          <p class="about-body" style="font-size: 15px;">The publisher is committed to maintaining professional, transparent, and responsive communication in support of ethical and accessible scholarly dissemination.</p>
        </div>

        <div class="contact-grid" style="grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: start;">
          <div class="contact-info-blocks">
            
            <div class="reveal" style="margin-bottom: 32px;">
              <h3 style="font-size: 16px; color: var(--gold); margin-bottom: 12px; font-family: 'Cinzel', serif;">GENERAL INQUIRIES</h3>
              <p class="about-body" style="font-size: 14.5px;">For questions regarding journals, publication processes, editorial policies, manuscript submissions, peer review, and academic collaborations, please contact:</p>
              <p class="about-body" style="font-size: 14.5px; margin-top: 8px;"><strong>Email:</strong> qualisearchconsulting@gmail.com<br><strong>Website:</strong> www.qualisearchjournal.org</p>
            </div>

            <div class="reveal" style="margin-bottom: 32px;">
              <h3 style="font-size: 16px; color: var(--gold); margin-bottom: 12px; font-family: 'Cinzel', serif;">MANUSCRIPT SUBMISSIONS</h3>
              <p class="about-body" style="font-size: 14.5px;">Authors interested in submitting manuscripts to journals under QualiSearch Academic Press are encouraged to review the respective journal’s aims and scope, author guidelines, and editorial policies prior to submission.</p>
              <p class="about-body" style="font-size: 14.5px;">Current journals and forthcoming journal platforms may be accessed through the publisher website.</p>
            </div>

            <div class="reveal" style="margin-bottom: 32px;">
              <h3 style="font-size: 16px; color: var(--gold); margin-bottom: 12px; font-family: 'Cinzel', serif;">EDITORIAL AND REVIEWER COLLABORATION</h3>
              <p class="about-body" style="font-size: 14.5px;">QualiSearch Academic Press welcomes qualified researchers, educators, and professionals who are interested in serving as:</p>
              <ul style="color: var(--text-secondary); margin-left: 20px; font-size: 14.5px; line-height: 1.6; margin-top: 8px; margin-bottom: 8px;">
                <li>Peer reviewers</li>
                <li>Editorial board members</li>
                <li>Section editors</li>
                <li>Guest editors</li>
                <li>Academic collaborators</li>
              </ul>
              <p class="about-body" style="font-size: 14.5px;">Interested individuals may contact the publisher through the official email address with their curriculum vitae and areas of specialization.</p>
            </div>

            <div class="reveal" style="margin-bottom: 32px;">
              <h3 style="font-size: 16px; color: var(--gold); margin-bottom: 12px; font-family: 'Cinzel', serif;">INSTITUTIONAL PARTNERSHIPS</h3>
              <p class="about-body" style="font-size: 14.5px;">The publisher also accommodates inquiries regarding:</p>
              <ul style="color: var(--text-secondary); margin-left: 20px; font-size: 14.5px; line-height: 1.6; margin-top: 8px; margin-bottom: 8px;">
                <li>Institutional publication partnerships</li>
                <li>Conference proceedings</li>
                <li>Journal collaborations</li>
                <li>Research dissemination initiatives</li>
                <li>Scholarly engagement programs</li>
              </ul>
              <p class="about-body" style="font-size: 14.5px;">Academic institutions and organizations interested in collaborative initiatives may communicate directly with the publisher through official contact channels.</p>
            </div>

            <div class="reveal">
              <h3 style="font-size: 16px; color: var(--gold); margin-bottom: 12px; font-family: 'Cinzel', serif;">RESPONSE TIME</h3>
              <p class="about-body" style="font-size: 14.5px;">The editorial office strives to respond to inquiries within a reasonable timeframe. Response times may vary depending on submission volume, editorial schedules, and the nature of the inquiry.</p>
            </div>
            
          </div>

          <div class="contact-sidebar">
            <div class="contact-info reveal" style="padding: 32px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 32px;">
              <p class="contact-lead" style="margin-bottom: 24px; text-align: left;">
                <strong style="color: var(--text-primary); font-family: 'Cinzel', serif; letter-spacing: 0.05em; font-size: 18px;">PUBLISHER INFORMATION</strong><br>
                <strong style="color: var(--text-primary); font-size: 15px; margin-top: 12px; display: block;">QualiSearch Academic Press</strong>
                <span style="font-size: 13.5px; color: var(--text-secondary); font-family: 'Inter', sans-serif; display: block; margin-top: 4px; line-height: 1.5;">Published by QualiSearch Center for Interdisciplinary Research and Development</span>
                <span style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
                  <span class="nav-role-badge" style="background: rgba(184,149,58,0.1); color: var(--gold); border: 1px solid var(--border);">Crossref Member</span>
                  <span class="nav-role-badge" style="background: rgba(99,136,214,0.1); color: #a3bffa; border: 1px solid rgba(99,136,214,0.3);">Open Access</span>
                </span>
              </p>
              <div class="contact-details" style="gap: 20px;">
                <div class="contact-item" style="align-items: flex-start;">
                  <span class="contact-icon" style="margin-top: 2px;">📍</span>
                  <div>
                    <span class="contact-label">Office Address</span>
                    <span class="contact-value" style="font-size: 13.5px; line-height: 1.5;">QualiSearch Academic Press<br>QualiSearch Center for Interdisciplinary Research and Development<br>B12 L55 Oregano Street<br>Tagaytay Heights Subdivision<br>Tagaytay City, Cavite 4120<br>Philippines</span>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">✉</span>
                  <div>
                    <span class="contact-label">Email</span>
                    <span class="contact-value">qualisearchconsulting@gmail.com</span>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">🌐</span>
                  <div>
                    <span class="contact-label">Website</span>
                    <span class="contact-value">www.qualisearchjournal.org</span>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <div>
                    <span class="contact-label">Mobile</span>
                    <span class="contact-value">+639173039530</span>
                  </div>
                </div>
              </div>
            </div>

            <form class="contact-form reveal reveal-delay-1" id="contact-form">
              <h3 style="font-size: 16px; color: var(--text-primary); margin-bottom: 20px; font-family: 'Cinzel', serif;">Send a Message</h3>
              <div class="form-group"><label for="form-name">Full Name</label><input type="text" id="form-name" placeholder="Dr. Jane Smith" /></div>
              <div class="form-group"><label for="form-email">Email Address</label><input type="email" id="form-email" placeholder="researcher@institution.edu" /></div>
              <div class="form-group">
                <label for="form-subject">Subject</label>
                <select id="form-subject">
                  <option value="">Select a topic</option>
                  <option value="submission">Manuscript Submission</option>
                  <option value="review">Review Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group"><label for="form-message">Message</label><textarea id="form-message" rows="4" placeholder="Your message..."></textarea></div>
              <button type="submit" class="submit-btn" id="btn-contact-submit">Send Message</button>
            </form>

          </div>
        </div>
      </div>
    </section>
  </div>
"""

article_content = """
  <div id="article-content" style="display:none; min-height: 60vh; padding-top: 100px; padding-bottom: 60px;">
    <header class="article-header" style="text-align: center; padding: 40px 20px; background: linear-gradient(to bottom, var(--navy-dark), var(--navy-darkest));">
      <h1 class="article-title" id="art-title" style="font-family: 'EB Garamond', serif; font-size: 2.5rem; color: var(--gold); margin-bottom: 15px;">Loading...</h1>
      <div class="article-meta" style="font-family: 'Inter', sans-serif; font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px;">
        Published in <span id="art-journal" style="color: var(--gold-pale); font-weight: 500;"></span> &nbsp;|&nbsp; 
        Date: <span id="art-date" style="color: var(--gold-pale); font-weight: 500;"></span>
      </div>
    </header>
    <main class="article-container" style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
      <h2 class="article-abstract-title" style="font-family: 'Cinzel', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 5px;">Abstract</h2>
      <div class="article-abstract" id="art-abstract" style="font-family: 'Inter', sans-serif; line-height: 1.8; color: var(--text-primary); font-size: 1.1rem; margin-bottom: 40px; white-space: pre-wrap;"></div>
      
      <div class="article-actions" style="text-align: center; margin-top: 40px;">
        <button id="art-download-btn" class="btn-action" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: var(--gold); color: var(--navy-darkest); padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600; font-family: 'Inter', sans-serif; font-size: 1rem; cursor: pointer; border: none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Full Article PDF
        </button>
      </div>
    </main>
  </div>
  <div id="article-loading" style="min-height: 60vh; padding-top: 100px; display:flex; align-items:center; justify-content:center; color: var(--gold); font-family: 'Cinzel', serif; font-size: 1.5rem;">
    Loading Article...
  </div>
  <div id="article-error" style="display:none; min-height: 60vh; padding-top: 100px; align-items:center; justify-content:center; flex-direction: column; color: #ff6b6b; font-family: 'Inter', sans-serif; text-align: center;">
    <h2 style="font-size: 2rem; margin-bottom: 10px;">Article Not Found</h2>
    <p>The research article you are looking for does not exist or has not been published yet.</p>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      // Ensure supabase is loaded
      if (typeof supabase === 'undefined') {
        const { createClient } = window.supabase;
        window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const articleId = urlParams.get('id');
      
      if (!articleId) {
        document.getElementById('article-loading').style.display = 'none';
        document.getElementById('article-error').style.display = 'flex';
        return;
      }
      
      const { data, error } = await window.supabase
        .from('submissions')
        .select('*')
        .eq('id', articleId)
        .single();
        
      document.getElementById('article-loading').style.display = 'none';
        
      if (error || !data || data.status !== 'Published') {
        document.getElementById('article-error').style.display = 'flex';
        return;
      }
      
      document.getElementById('article-content').style.display = 'block';
      document.getElementById('art-title').textContent = data.title;
      document.getElementById('art-journal').textContent = data.journal;
      document.getElementById('art-abstract').textContent = data.abstract;
      document.getElementById('art-date').textContent = new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      document.getElementById('art-download-btn').addEventListener('click', async () => {
        const path = data.file_path;
        if (!path) {
            alert('File not available.');
            return;
        }
        
        const btn = document.getElementById('art-download-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Downloading...';
        btn.disabled = true;

        const { data: fileData, error: fileError } = await window.supabase.storage.from('manuscripts').download(path);
        
        btn.innerHTML = originalText;
        btn.disabled = false;

        if (fileError) {
          alert('Error downloading file: ' + fileError.message);
          return;
        }
        const url = URL.createObjectURL(fileData);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.title + '.pdf';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    });
  </script>
"""

pages = {
    'index.html': index_content,
    'about.html': about_content,
    'journals.html': journals_content,
    'publish.html': publish_content,
    'policies.html': policies_content,
    'contact.html': contact_content,
    'article.html': article_content,
}

base_path = r'c:\Users\QualiSearch\Desktop\qualisearch'

for filename, content in pages.items():
    filepath = os.path.join(base_path, filename)
    full_html = head + nav + content + footer
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_html)
    print(f"Created {filename}")
