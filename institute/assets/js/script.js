const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const programDetails = {
  qualitative: {
    title: 'Certified Qualitative Research Data Analytics Specialist',
    items: [
      'Qualitative data preparation, transcription, and organization',
      'Manual and software-assisted coding using NVivo, MAXQDA, ATLAS.ti, or comparable tools',
      'Codebook development, categories, themes, analytic memos, and visual mapping',
      'Specializations in phenomenology, grounded theory, case study, reflexive thematic analysis, narrative inquiry, ethnography, discourse analysis, and content analysis',
      'Capstone: coded dataset, codebook, analytical memo, visual map, and findings narrative'
    ]
  },
  quantitative: {
    title: 'Certified Quantitative Research Data Analytics Specialist',
    items: [
      'Data encoding, cleaning, descriptive statistics, visualization, and assumptions testing',
      'Inferential statistics, effect sizes, confidence intervals, and interpretation',
      'Regression, mediation, moderation, experimental analysis, factor analysis, SEM, PLS-SEM, multilevel modeling, and machine learning for research',
      'Software applications may include Excel, SPSS, Jamovi, JASP, R, Python, AMOS, SmartPLS, and Stata',
      'Capstone: cleaned dataset, analysis plan, software outputs, diagnostic tests, and publication-ready results'
    ]
  },
  adviser: {
    title: 'Certified Graduate Research Adviser',
    items: [
      'Philosophy and ethics of graduate research supervision',
      'Research problem, framework, and methodological alignment review',
      'Qualitative, quantitative, mixed methods, action research, and professional research supervision',
      'Developmental feedback, adviser-advisee relationships, defense preparation, and publication mentoring',
      'Capstone: advising plan, methodological review, feedback samples, monitoring framework, and publication mentoring plan'
    ]
  },
  leadership: {
    title: 'Certified Research Administration and Leadership Professional',
    items: [
      'Research office governance, policy development, agenda setting, and program management',
      'Research ethics, funding, grants, partnerships, monitoring systems, IP, innovation, and dissemination',
      'Application modules for higher education, basic education, healthcare, public sector, industry, and international grants',
      'Capstone: comprehensive research office development plan with systems, indicators, and implementation roadmap'
    ]
  },
  qa: {
    title: 'Certified Research Quality Assurance Auditor',
    items: [
      'Research quality-management systems, audit planning, evidence development, and documentary review',
      'Research ethics compliance, data traceability, findings classification, root-cause analysis, and follow-up',
      'Application modules for research office audit, graduate research audit, ethics audit, publication quality audit, and accreditation readiness',
      'Capstone: simulated or supervised audit with audit plan, evidence matrix, findings, recommendations, and follow-up plan'
    ]
  },
  publishing: {
    title: 'Certified Scholarly Publishing and Editorial Management Specialist',
    items: [
      'Scholarly communication, journal governance, editorial policy, screening, peer review, and editorial decisions',
      'Publication ethics, academic editing, production, DOI and metadata, copyright, licensing, preservation, and indexing',
      'Functional modules for managing editors, editors-in-chief, copyediting, journal production, open access, and publication ethics case management',
      'Capstone: journal development and editorial management portfolio with policies, workflows, standards, templates, and indexing-readiness plan'
    ]
  }
};

const detailPanel = document.getElementById('program-detail');

document.querySelectorAll('.program-card button').forEach(button => {
  button.addEventListener('click', () => {
    const detail = programDetails[button.dataset.target];
    if (!detail || !detailPanel) return;

    detailPanel.innerHTML = `
      <h3>${detail.title}</h3>
      <ul>${detail.items.map(item => `<li>${item}</li>`).join('')}</ul>
    `;
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    trigger.classList.toggle('is-open');
  });
});
