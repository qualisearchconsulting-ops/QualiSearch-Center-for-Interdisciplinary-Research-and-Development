/* ══════════════════════════════════════════
   QualiSearch Academic Press — JavaScript
   Includes: Supabase Auth (Sign In / Sign Up)
   Account Types: Admin | Peer Reviewer | Researcher
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════
     SUPABASE CLIENT INIT
  ════════════════════════════════════════ */
  let supabase = null;

  try {
    // supabaseJs is loaded via CDN as window.supabase
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    window.qsSupabaseClient = supabase;
  } catch (e) {
    console.warn('Supabase init failed — check supabase-config.js credentials.', e);
  }

  /* ── Role display helpers ────────────── */
  const ROLE_LABELS = {
    admin:         'Admin',
    editor:        'Editor',
    peer_reviewer: 'Peer Reviewer',
    researcher:    'Researcher',
  };

  const ROLE_CSS = {
    admin:         'role-admin',
    editor:        'role-admin',
    peer_reviewer: 'role-peer-reviewer',
    researcher:    'role-researcher',
  };

  /* ════════════════════════════════════════
     TOAST NOTIFICATION
  ════════════════════════════════════════ */
  let toastEl   = document.getElementById('qs-toast');
  let toastIcon = document.getElementById('qs-toast-icon');
  let toastMsg  = document.getElementById('qs-toast-msg');
  let toastTimer  = null;

  function ensureToast() {
    if (toastEl && toastIcon && toastMsg) return true;

    toastEl = document.createElement('div');
    toastEl.className = 'qs-toast';
    toastEl.id = 'qs-toast';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.hidden = true;

    toastIcon = document.createElement('span');
    toastIcon.className = 'qs-toast-icon';
    toastIcon.id = 'qs-toast-icon';

    toastMsg = document.createElement('span');
    toastMsg.className = 'qs-toast-msg';
    toastMsg.id = 'qs-toast-msg';

    toastEl.appendChild(toastIcon);
    toastEl.appendChild(toastMsg);
    document.body.appendChild(toastEl);
    return true;
  }

  function getToastType(message) {
    const text = String(message || '').toLowerCase();
    if (text.includes('error') || text.includes('failed') || text.includes('could not') || text.includes('please select') || text.includes('please fill')) return 'error';
    if (text.includes('success') || text.includes('submitted') || text.includes('saved') || text.includes('copied') || text.includes('updated') || text.includes('published')) return 'success';
    return 'info';
  }

  function showToast(message, type = 'info') {
    if (!ensureToast()) return;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toastEl.className = `qs-toast toast-${type}`;
    toastIcon.textContent = icons[type] || 'ℹ';
    toastMsg.textContent  = message;
    toastEl.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add('closing');
      setTimeout(() => {
        toastEl.hidden = true;
        toastEl.classList.remove('closing');
      }, 320);
    }, 4000);
  }

  window.qsShowToast = showToast;
  window.alert = (message) => showToast(message, getToastType(message));

  /* ════════════════════════════════════════
     NAVBAR STATE — Login btn / User avatar
  ════════════════════════════════════════ */
  const navLoginBtn   = document.getElementById('nav-login-btn');
  const navUser       = document.getElementById('nav-user');
  const navUserBtn    = document.getElementById('nav-user-btn');
  const navAvatar     = document.getElementById('nav-avatar');
  const navUserName   = document.getElementById('nav-user-name');
  const navFullname   = document.getElementById('nav-user-fullname');
  const navRoleBadge  = document.getElementById('nav-role-badge');
  const navDropdown   = document.getElementById('nav-user-dropdown');
  const navSignoutBtn = document.getElementById('nav-signout-btn');

  async function getUserRole(user) {
    if (!supabase) return 'researcher';
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle();
    if (data && data.role) return data.role;
    return user.user_metadata?.account_type || 'researcher';
  }

  async function setNavLoggedIn(user) {
    if (!navUser || !navAvatar || !navUserName || !navFullname || !navRoleBadge) return;
    const meta      = user.user_metadata || {};
    const fullName  = meta.full_name  || user.email || 'Account';
    let role        = await getUserRole(user);

    const initials  = fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    navAvatar.textContent    = initials;
    navUserName.textContent  = fullName.split(' ')[0];   // first name only
    navFullname.textContent  = fullName;

    navRoleBadge.textContent = ROLE_LABELS[role] || role;
    navRoleBadge.className   = `nav-role-badge ${ROLE_CSS[role] || ''}`;

    if (navLoginBtn) navLoginBtn.hidden = true;
    navUser.hidden     = false;

    // Update main navigation to only show Dashboard when logged in
    const mainNavUl = document.querySelector('.main-nav ul');
    if (mainNavUl) {
      if (!window.qsOriginalNav) {
        window.qsOriginalNav = mainNavUl.innerHTML;
      }
      
      let dashboardUrl = 'dashboard_researcher.html';
      if (role === 'admin' || role === 'editor') dashboardUrl = 'dashboard_admin.html';
      else if (role === 'peer_reviewer') dashboardUrl = 'dashboard_reviewer.html';
      
      const currentPath = window.location.pathname.split('/').pop();
      const isActive = currentPath === dashboardUrl ? 'active' : '';

      mainNavUl.innerHTML = `<li><a href="../index.html" class="nav-link" style="color: var(--gold-light); font-weight: 600;">&larr; QCIRD Home</a></li><li><a href="${dashboardUrl}" class="nav-link ${isActive}">Dashboard</a></li>`;
    }
  }

  function setNavLoggedOut() {
    if (navLoginBtn) navLoginBtn.hidden = false;
    if (navUser) navUser.hidden     = true;
    if (navDropdown) navDropdown.classList.remove('open');
    if (navUserBtn) navUserBtn.setAttribute('aria-expanded', 'false');

    // Restore original main navigation when logged out
    const mainNavUl = document.querySelector('.main-nav ul');
    if (mainNavUl && window.qsOriginalNav) {
      mainNavUl.innerHTML = window.qsOriginalNav;
      
      // Re-apply active class for the current page
      const navLinks = mainNavUl.querySelectorAll('.nav-link');
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  }

  /* ── User dropdown toggle ─────────────── */
  if (navUserBtn && navDropdown) {
    navUserBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      navUserBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('click', (e) => {
    if (navUser && navDropdown && navUserBtn && !navUser.contains(e.target)) {
      navDropdown.classList.remove('open');
      navUserBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Sign Out ─────────────────────────── */
  if (navSignoutBtn) {
    navSignoutBtn.addEventListener('click', async () => {
      if (!supabase) return;
      if (navDropdown) navDropdown.classList.remove('open');
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast('Sign out failed. Please try again.', 'error');
      } else {
        setNavLoggedOut();
        showToast('You have been signed out. Redirecting...', 'info');
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
      }
    });
  }

  /* ════════════════════════════════════════
     AUTH MODAL
  ════════════════════════════════════════ */
  const authBackdrop  = document.getElementById('auth-backdrop');
  const authModal     = document.getElementById('auth-modal');
  const authCloseBtn  = document.getElementById('auth-close-btn');

  // Tabs
  const tabSignin   = document.getElementById('tab-signin');
  const tabRegister = document.getElementById('tab-register');
  const panelSignin = document.getElementById('panel-signin');
  const panelReg    = document.getElementById('panel-register');

  // Switch links
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToSignin   = document.getElementById('switch-to-signin');

  function openAuthModal(tab = 'signin') {
    authBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    switchTab(tab);
    // Focus first input after animation
    setTimeout(() => {
      const firstInput = authModal.querySelector('input:not([hidden])');
      if (firstInput) firstInput.focus();
    }, 320);
  }

  function closeAuthModal() {
    authBackdrop.hidden = true;
    document.body.style.overflow = '';
    // Reset forms
    document.getElementById('signin-form').reset();
    document.getElementById('register-form').reset();
    showError('signin-error', '');
    showError('register-error', '');
    // Reset password strength
    const bar = document.getElementById('reg-strength-bar');
    bar.className = 'auth-strength-bar';
    bar.style.width = '0%';
  }

  function switchTab(tab) {
    const isSignin = (tab === 'signin');
    tabSignin.classList.toggle('active', isSignin);
    tabRegister.classList.toggle('active', !isSignin);
    tabSignin.setAttribute('aria-selected', String(isSignin));
    tabRegister.setAttribute('aria-selected', String(!isSignin));
    panelSignin.hidden = !isSignin;
    panelReg.hidden    = isSignin;
  }

    // Open modal via any login button
    const loginBtns = document.querySelectorAll('.nav-login-btn');
    loginBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('signin');
      });
    });

  // Tabs
  if (tabSignin) tabSignin.addEventListener('click', () => switchTab('signin'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

  // Switch links
  if (switchToRegister) switchToRegister.addEventListener('click', () => switchTab('register'));
  if (switchToSignin) switchToSignin.addEventListener('click',   () => switchTab('signin'));

  // Close
  if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
  if (authBackdrop) {
    authBackdrop.addEventListener('click', (e) => {
      if (e.target === authBackdrop) closeAuthModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authBackdrop && !authBackdrop.hidden) closeAuthModal();
  });

  /* ── Error display ────────────────────── */
  function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
  }

  /* ── Loading state for submit btns ────── */
  function setLoading(btnId, loading) {
    const btn    = document.getElementById(btnId);
    const label  = btn.querySelector('.auth-btn-label');
    const spinner = btn.querySelector('.auth-spinner');
    btn.disabled         = loading;
    label.hidden         = loading;
    spinner.hidden       = !loading;
  }

  /* ════════════════════════════════════════
     SIGN IN
  ════════════════════════════════════════ */
  const signinForm = document.getElementById('signin-form');

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('signin-error', '');

    if (!supabase) {
      showError('signin-error', 'Supabase is not configured. Please update supabase-config.js with your project credentials.');
      return;
    }

    const email    = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
      showError('signin-error', 'Please fill in all fields.');
      return;
    }

    setLoading('signin-submit', true);

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error && error.message.includes('Invalid login')) {
      // Just-In-Time Creation for invited reviewers
      const { data: revData } = await supabase.from('reviewers')
        .select('*')
        .eq('email', email)
        .eq('temp_password', password)
        .maybeSingle();

      if (revData) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: revData.full_name,
              account_type: 'peer_reviewer'
            }
          }
        });
        
        if (!signUpError && signUpData.user) {
          data = signUpData;
          error = null;
          // Clear temp_password so it can't be used again
          await supabase.from('reviewers').update({ temp_password: null }).eq('id', revData.id);
        }
      }
    }

    setLoading('signin-submit', false);

    if (error) {
      const msg = error.message.includes('Invalid login')
        ? 'Incorrect email or password. Please try again.'
        : error.message;
      showError('signin-error', msg);
      return;
    }

    closeAuthModal();
    setNavLoggedIn(data.user);
    showToast(`Welcome back, ${data.user.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}!`, 'success');
    
    // Redirect based on role
    let role = await getUserRole(data.user);

    if (role === 'researcher') {
      setTimeout(() => { window.location.href = 'dashboard_researcher.html'; }, 800);
    } else if (role === 'admin' || role === 'editor') {
      setTimeout(() => { window.location.href = 'dashboard_admin.html'; }, 800);
    } else if (role === 'peer_reviewer') {
      setTimeout(() => { window.location.href = 'dashboard_reviewer.html'; }, 800);
    }
    });
  }

  /* ════════════════════════════════════════
     FORGOT PASSWORD
  ════════════════════════════════════════ */
  const forgotLink = document.getElementById('forgot-password-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!supabase) return;

    const email = document.getElementById('signin-email').value.trim();
    if (!email) {
      showError('signin-error', 'Enter your email address above, then click "Forgot password?".');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });

    if (error) {
      showError('signin-error', error.message);
    } else {
      closeAuthModal();
      showToast('Password reset email sent. Check your inbox.', 'success');
    }
    });
  }

  /* ════════════════════════════════════════
     REGISTER (Create Account)
  ════════════════════════════════════════ */
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('register-error', '');

    if (!supabase) {
      showError('register-error', 'Supabase is not configured. Please update supabase-config.js with your project credentials.');
      return;
    }

    const fullName   = document.getElementById('reg-fullname').value.trim();
    const email      = document.getElementById('reg-email').value.trim();
    const password   = document.getElementById('reg-password').value;
    const confirm    = document.getElementById('reg-confirm').value;
    const accountType = registerForm.querySelector('input[name="account_type"]:checked')?.value || 'researcher';

    // Validation
    if (!fullName || !email || !password || !confirm) {
      showError('register-error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      showError('register-error', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      showError('register-error', 'Passwords do not match.');
      return;
    }

    setLoading('register-submit', true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:    fullName,
          account_type: accountType,
        },
      },
    });

    setLoading('register-submit', false);

    if (error) {
      showError('register-error', error.message);
      return;
    }

    closeAuthModal();

    // Supabase may require email confirmation
    if (data.user && !data.session) {
      showToast('Account created! Please check your email to confirm your address.', 'success');
    } else if (data.session) {
      setNavLoggedIn(data.user);
      showToast(`Welcome to QualiSearch, ${fullName.split(' ')[0]}!`, 'success');
      
      // Redirect if researcher
      let role = await getUserRole(data.user);
      if (role === 'researcher') {
        setTimeout(() => {
          window.location.href = 'dashboard_researcher.html';
        }, 800);
      }
    }
    });
  }

  /* ════════════════════════════════════════
     PASSWORD STRENGTH METER
  ════════════════════════════════════════ */
  const regPasswordInput = document.getElementById('reg-password');
  const strengthBar      = document.getElementById('reg-strength-bar');

  if (regPasswordInput && strengthBar) {
    regPasswordInput.addEventListener('input', () => {
    const pw = regPasswordInput.value;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    strengthBar.className = 'auth-strength-bar';
    if (pw.length === 0) return;
    if      (score <= 1) strengthBar.classList.add('strength-weak');
    else if (score === 2) strengthBar.classList.add('strength-fair');
    else if (score === 3) strengthBar.classList.add('strength-good');
    else                  strengthBar.classList.add('strength-strong');
    });
  }

  /* ════════════════════════════════════════
     SHOW / HIDE PASSWORD TOGGLES
  ════════════════════════════════════════ */
  function setupEyeToggle(eyeBtnId, inputId) {
    const btn   = document.getElementById(eyeBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.querySelector('.eye-open').style.display  = isText ? '' : 'none';
      btn.querySelector('.eye-closed').style.display = isText ? 'none' : '';
    });
  }

  setupEyeToggle('signin-eye', 'signin-password');
  setupEyeToggle('reg-eye',    'reg-password');

  /* ════════════════════════════════════════
     AUTH STATE LISTENER (Supabase)
  ════════════════════════════════════════ */
  const publicPages = ['index.html', 'about.html', 'journals.html', 'publish.html', 'policies.html', 'contact.html', ''];
  const privatePages = ['dashboard_admin.html', 'dashboard_researcher.html', 'dashboard_reviewer.html'];

  async function handlePageAccess(user) {
    const currentPath = window.location.pathname.split('/').pop();
    
    if (user) {
      // If logged in and on a public page, redirect to dashboard
      if (publicPages.includes(currentPath)) {
        let role = await getUserRole(user);
        
        let dashboardUrl = 'dashboard_researcher.html';
        if (role === 'admin' || role === 'editor') dashboardUrl = 'dashboard_admin.html';
        else if (role === 'peer_reviewer') dashboardUrl = 'dashboard_reviewer.html';
        
        window.location.replace(dashboardUrl);
      }
    } else {
      // If logged out and on a private page, redirect to home
      if (privatePages.includes(currentPath)) {
        window.location.replace('index.html');
      }
    }
  }

  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setNavLoggedIn(session.user);
        handlePageAccess(session.user);
      } else {
        setNavLoggedOut();
        handlePageAccess(null);
      }
    });

    // Check existing session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setNavLoggedIn(session.user);
        handlePageAccess(session.user);
      } else {
        setNavLoggedOut();
        handlePageAccess(null);
      }
    });
  }

  /* ════════════════════════════════════════
     NAVBAR SCROLL EFFECT
  ════════════════════════════════════════ */
  const topBar = document.getElementById('top-bar');
  window.addEventListener('scroll', () => {
    if (!topBar) return;
    topBar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Active nav link on load ──────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger menu toggle ───────────── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mainNav.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close nav on link click (mobile)
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── Scroll reveal animation ─────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  const revealTargets = [
    '.about-title', '.about-lead', '.about-body',
    '.journals-heading', '.journal-card',
    '.publish-card', '.policy-item',
    '.contact-info', '.contact-form'
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    });
  });

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) revealObserver.observe(el);
  });

  /* ── Contact form submit handler ──────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-contact-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.textContent = '✓ Message Sent';
        btn.style.background = '#2a6e3a';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '';
          btn.style.background = '';
          btn.style.color = '';
          form.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ── Hero scroll hint ─────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const hint = document.createElement('div');
    hint.className = 'hero-scroll';
    hint.innerHTML = '<span>▼</span>';
    hint.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
    hero.appendChild(hint);
  }

  /* ── Smooth parallax on hero ──────────── */
  const heroBgImg = document.querySelector('.hero-bg-img');
  window.addEventListener('scroll', () => {
    if (heroBgImg && window.scrollY < window.innerHeight) {
      heroBgImg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.15}px)`;
    }
  });

});
