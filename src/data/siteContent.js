// Gene - Nov, 23, 2026: Single source of truth for Harmony IT Consultancy copy, metadata, and display toggles

export const SITE_META = {
  brandName: 'Harmony IT Consultancy',
  brandShort: 'HARMONY',
  brandSubtitle: 'IT CONSULTANCY',
  domain: 'https://harmonyitc.dev',
  // Gene - Nov, 24, 2026: Updated official public contact email to harmonyitco@gmail.com
  // email: 'inquiries@harmonyitc.com',
  email: 'harmonyitco@gmail.com',
  ogImage: 'https://harmonyitc.dev/harmony-logo.png',
  copyrightYear: 2026
};

export const DISPLAY_CONFIG = {
  // Single toggle controlling whether verbose/redundant descriptive paragraphs render
  showExtendedCopy: false,
  // Keeps top navbar minimal without the "Let's Start" button
  showHeaderCta: false,
  // Keeps the Home outcomes strip hidden while preserving structured data
  showHomeMetrics: false
};

export const NAV_ITEMS = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'about', label: 'About Us', to: '/about' },
  { key: 'projects', label: 'Projects', to: '/projects' },
  { key: 'contact', label: 'Contact Us', to: '/contact' }
];

// Gene - Nov, 24, 2026: Added harmonic motion profiles per pillar and kinetic typography ribbon sets for HarmonyMotionStage
export const HARMONY_MOTION_RIBBONS = {
  top: ['CLARITY', 'SYSTEMS', 'WORKFLOW', 'HARMONY', 'SCALE', 'PRECISION'],
  bottom: ['DESIGN', 'STRATEGY', 'OPERATIONS', 'HARMONY', 'GROWTH', 'RELIABILITY']
};

export const HERO_PILLARS = [
  {
    id: 'problem',
    num: '01',
    buttonLabel: 'Solve a Problem',
    hubTitle: 'Solving Real Problems',
    hubStatus: 'Root-Cause Systems',
    hubNodeLabel: 'Problem Solving',
    focusPrefix: '01 / Solving Real Problems:',
    focusText:
      'We look at where your team loses time, misses inquiries, or gets stuck in manual steps, then build straightforward tools that fix the root issue.',
    motion: {
      tempo: 1.0,
      amplitude: 11,
      glowRgba: 'rgba(180, 208, 233, 0.22)',
      phrase: 'Problems & systems in sync'
    },
    preview: {
      projectId: 'switchfiber-admin',
      imageKey: 'switchfiber-admin',
      width: 1024,
      height: 640,
      thumbModifier: 'preview-shot--admin',
      badge: 'Operations Console',
      title: 'SwitchFiber Admin',
      metricVal: '4 Core Modules',
      metricSub: 'Subscribers · Plans · Jobs · Fiber'
    }
  },
  {
    id: 'promo',
    num: '02',
    buttonLabel: 'Online Presence',
    hubTitle: 'Clear Online Presence',
    hubStatus: 'Brand & Visibility',
    hubNodeLabel: 'Online Presence',
    focusPrefix: '02 / Clear Online Presence:',
    focusText:
      'A fast, trustworthy website that explains what you do clearly, shows up well in search, and gives potential clients confidence to reach out.',
    motion: {
      tempo: 0.85,
      amplitude: 13,
      glowRgba: 'rgba(216, 238, 255, 0.24)',
      phrase: 'Clarity & presence in sync'
    },
    preview: {
      projectId: 'switchfiber-subscriber',
      imageKey: 'switchfiber-subscriber',
      width: 1024,
      height: 640,
      thumbModifier: 'preview-shot--web',
      badge: 'Public & Subscriber Web',
      title: 'SwitchFiber Portal',
      metricVal: '9 Municipalities',
      metricSub: 'Rizal Serviceability & Plan Grid'
    }
  },
  {
    id: 'operations',
    num: '03',
    buttonLabel: 'Daily Operations',
    hubTitle: 'Support Daily Ops',
    hubStatus: 'Unified Workflows',
    hubNodeLabel: 'Daily Ops',
    focusPrefix: '03 / Smoother Daily Work:',
    focusText:
      'Replace scattered spreadsheets and long message threads with practical booking tools, client portals, job tracking, and organized dashboards.',
    motion: {
      tempo: 1.15,
      amplitude: 10,
      glowRgba: 'rgba(126, 178, 224, 0.24)',
      phrase: 'Teams & workflows in sync'
    },
    preview: {
      projectId: 'switchfiber-mobile',
      imageKey: 'switchfiber-mobile',
      width: 380,
      height: 787,
      thumbModifier: 'preview-shot--mobile',
      badge: 'Mobile Field App',
      title: 'Field Technician Terminal',
      metricVal: 'Direct Sync',
      metricSub: 'Assigned Work Orders On-Site'
    }
  },
  {
    id: 'income',
    num: '04',
    buttonLabel: 'Grow Revenue',
    hubTitle: 'Sustainable Growth',
    hubStatus: 'Revenue Pathways',
    hubNodeLabel: 'Steady Growth',
    focusPrefix: '04 / Sustainable Growth:',
    focusText:
      'Clear customer paths, inquiry forms, service estimators, and online payment options that turn visitors into paying clients.',
    motion: {
      tempo: 1.05,
      amplitude: 12,
      glowRgba: 'rgba(255, 152, 92, 0.22)',
      phrase: 'Strategy & growth in sync'
    },
    preview: {
      projectId: 'switchfiber-subscriber',
      imageKey: 'switchfiber-subscriber',
      width: 1024,
      height: 640,
      thumbModifier: 'preview-shot--web',
      badge: 'Online Signup & Billing',
      title: 'SwitchFiber Digital Pay',
      metricVal: 'From ₱699/mo',
      metricSub: 'Online Apply & Bill Payment'
    }
  }
];

// Gene - Nov, 24, 2026: Editorial studio copy, concrete capabilities, streamlined founders, SwitchFiber showcase metadata, and Contact scopes
/*
export const HOME_DATA = {
  eyebrow: 'Practical Web & Business Systems',
  headline: {
    light: 'Scale your',
    accent: 'Business',
    dark: 'Smarter.'
  },
  sublead:
    'We design and build custom websites that work as hard as your team does, helping you clear everyday bottlenecks, present your work clearly online, organize daily operations, and grow steady revenue.',
  pitchSwitcherLabel: 'Choose what matters most to your business right now:',
  metrics: [
    {
      value: '4 Core Areas',
      title: 'One Connected Setup',
      desc: 'Problem-solving, online visibility, day-to-day workflows, and revenue support working together.'
    },
    {
      value: '24/7',
      title: 'Always Accessible',
      desc: 'Your business stays easy to find, read, and contact at any hour on desktop or phone.'
    },
    {
      value: 'Clearer',
      title: 'Daily Workflows',
      desc: 'Cut down repetitive back-and-forth across scheduling, customer updates, invoicing, and job tracking.'
    },
    {
      value: '100%',
      title: 'Custom-Built',
      desc: 'Designed around how your team actually works rather than forcing you into generic templates.'
    }
  ],
*/
  // Gene - Nov, 24, 2026: Commented out pillarsSection and comparisonSection data after removing both sections from HomeView pending replacement
  /*
  pillarsSection: {
    eyebrow: 'How Our Work Helps',
    headingLead: 'Four ways we build for',
    headingAccent: 'your business.',
    intro:
      'Every project starts with what your company actually needs, turning your website into a practical tool your team and customers rely on every day.',
    items: [
      {
        id: 'problem',
        areaLabel: 'Area 01',
        shape: 'core',
        icon: 'alert',
        title: 'Solving Everyday Bottlenecks',
        desc: 'Good software should never add extra steps. We sit down with you to spot where inquiries slip through, schedules clash, or records get messy, then build clean tools that take that weight off your team.',
        tags: ['Process Review', 'Workflow Tools', 'Less Manual Work']
      },
      {
        id: 'promo',
        areaLabel: 'Area 02',
        shape: 'sphere',
        icon: 'star',
        title: 'A Trustworthy Presence Online',
        desc: 'Your website is often the first place people meet your company. We make sure it reads clearly, loads quickly on any phone, shows up well in search, and reflects the care you put into your work.',
        tags: ['Clear Messaging', 'Search Friendly', 'Mobile Ready']
      },
      {
        id: 'operations',
        areaLabel: 'Area 03',
        shape: 'torus',
        icon: 'monitor',
        title: 'Support for Daily Operations',
        desc: 'Instead of stopping at static pages, we connect your website to the tasks your staff handles every morning, from booking requests and job orders to client portals and team dashboards.',
        tags: ['Client Portals', 'Scheduling & Dispatch', 'Team Dashboards']
      },
      {
        id: 'income',
        areaLabel: 'Area 04',
        shape: 'arrow',
        icon: 'dollar',
        title: 'A Reliable Path to Revenue',
        desc: 'A well-built site helps pay its own way. We shape clear inquiry flows, service estimators, and online payment options that make it easy for customers to say yes and follow through.',
        tags: ['Clear Inquiry Paths', 'Online Payments', 'Repeat Business']
      }
    ]
  },
  comparisonSection: {
    eyebrow: 'A Practical Comparison',
    headingLead: 'Why basic template sites fall short,',
    headingAccent: 'and what we build instead.',
    intro:
      'See the difference between a static brochure site and a custom web system built around your team.',
    passive: {
      tag: 'Standard Brochure Site',
      title: 'Sits on the Sidelines',
      items: [
        "Gives visitors general info, but doesn't help your team get real work done.",
        'Leaves staff copying messages, tracking requests, and updating spreadsheets by hand.',
        'Stays disconnected from your bookings, billing, inventory, or field operations.',
        'Ends up as a recurring cost that rarely pulls its own weight.'
      ]
    },
    engine: {
      tag: 'The HarmonyITC Approach',
      title: 'Works Alongside Your Team',
      items: [
        {
          lead: 'Problem Solving:',
          body: 'Shaped around the exact workflow gaps slowing your team down.'
        },
        {
          lead: 'Always Visible:',
          body: 'Presents your services clearly, builds trust, and makes reaching you simple.'
        },
        {
          lead: 'Daily Operations:',
          body: 'Handles inquiries, reservations, job orders, and updates in one organized place.'
        },
        {
          lead: 'Built for Growth:',
          body: 'Guides interested visitors smoothly from first question to completed sale.'
        }
      ]
    }
  },
  */
  // Gene - Nov, 24, 2026: Replaced legacy "THE WAIT" kineticSection with UnifiedCtaStrip closingCta config
  /*
  kineticSection: {
    srHeading: 'The wait: we promise it will be worth the wait.',
    lines: [
      { text: 'THE WAIT', y: 135, size: 196, targetW: 1320 },
      { text: 'WE PROMISE', y: 405, size: 138, targetW: 1320 },
      { text: 'IT WILL BE', y: 650, size: 178, targetW: 1320 },
      { text: 'WORTH', y: 895, size: 185, targetW: 1200 }
    ],
    ctaEyebrow: 'Start a Conversation',
    ctaHeadingLead: 'Ready for a website that',
    ctaHeadingAccent: 'helps run the work?',
    ctaDesc:
      'Put together a quick project brief or talk through your current bottlenecks directly with our founders. No sales pressure, just a practical conversation about what makes sense for your team.'
  }
  */
/*
  closingCta: {
    eyebrow: 'Start a Conversation',
    headingLead: 'Ready for a website that',
    headingAccent: 'helps run the work?',
    desc: 'Put together a quick project brief or talk through your current bottlenecks directly with our founders. No sales pressure, just a practical conversation about what makes sense for your team.',
    primaryLabel: 'Talk With Us',
    primaryTo: '/contact',
    secondaryLabel: 'Meet the Team',
    secondaryTo: '/about'
  }
};
*/
export const HOME_DATA = {
  eyebrow: 'Web & Systems Studio',
  headlineLines: ['Systems built', 'for how you', 'actually work.'],
  lead: 'Custom websites, operations tools, and mobile apps engineered directly by our founding team.',
  primaryCta: { label: 'Start a Project', to: '/contact' },
  secondaryCta: { label: 'Selected Work', to: '/projects' },
  marqueeWords: ['web platforms', 'operations systems', 'mobile field apps', 'digital portals', 'harmony'],
  capabilitiesSection: {
    eyebrow: 'Capabilities',
    headingLead: 'Built around',
    headingAccent: 'real workflows.',
    items: [
      {
        id: 'web',
        num: '01',
        title: 'Web Platforms',
        tag: 'Public & Client Web',
        summary:
          'Fast, responsive websites and customer portals engineered for clarity, search visibility, and effortless self-service.',
        deliverables: ['Custom Vue & Web SPAs', 'Serviceability & Signup Flows', 'Performance & SEO']
      },
      {
        id: 'operations',
        num: '02',
        title: 'Operations Systems',
        tag: 'Admin & Workflows',
        summary:
          'Authenticated internal consoles uniting subscriber records, plans, dispatch, and daily operations in one workspace.',
        deliverables: ['Operations Dashboards', 'Role-Based Admin Portals', 'REST API Architecture']
      },
      {
        id: 'mobile',
        num: '03',
        title: 'Mobile Field Apps',
        tag: 'On-Site Teams',
        summary:
          'Focused cross-platform mobile terminals that keep field crews connected to live work orders on the go.',
        deliverables: ['Flutter & Cross-Platform', 'Live Work-Order Sync', 'Offline-First UX']
      },
      {
        id: 'portals',
        num: '04',
        title: 'Digital Portals',
        tag: 'Billing & Revenue',
        summary:
          'Clear online onboarding, application status tracking, and digital payment flows built to convert and retain.',
        deliverables: ['Online Signup & Tracking', 'Digital Billing & Payments', 'Customer Self-Service']
      }
    ]
  },
  featuredWork: {
    eyebrow: 'Selected Work',
    headingLead: 'SwitchFiber',
    headingAccent: 'Ecosystem.',
    intro: 'Three connected platforms built for regional fiber operations across web, admin, and field mobile.',
    projectIds: ['switchfiber-subscriber', 'switchfiber-admin', 'switchfiber-mobile']
  },
  closingCta: {
    eyebrow: 'Start a Project',
    headingLead: 'Have a system',
    headingAccent: 'in mind?',
    primaryLabel: 'Start a Conversation',
    primaryTo: '/contact',
    secondaryEmail: SITE_META.email
  }
};

// Gene - Nov, 24, 2026: Streamlined ABOUT_DATA with single concise founder role, crisp 1-line bio, and hairline 4-step process
/*
export const ABOUT_DATA = {
  hero: {
    eyebrow: 'How We Think',
    titleStart: 'Your business first.',
    titleAccent: 'Technology',
    titleEnd: 'second.',
    lead: 'We started Harmony IT Consultancy with a straightforward belief: software should fit the way your team works, not force everyone into rigid habits. You work directly with us to build dependable tools that solve everyday bottlenecks and support steady growth.'
  },
*/
  // Gene - Nov, 24, 2026: Removed redundant mission & quote split section from About Us
  /*
  mission: {
    eyebrow: 'Why We Do This',
    heading: 'Building software that actually helps people do their jobs.',
    paragraphs: [
      'Too many companies pay for websites that look fine on launch day but sit untouched while staff go back to chasing chat threads, juggling bookings, and fixing spreadsheets by hand.',
      'At Harmony IT Consultancy, we handle the full picture: reliable backend systems, clean cross-device interfaces, and thoughtful UX design backed by plain-language documentation so your team feels confident from day one.'
    ],
    quoteEyebrow: 'In Our Own Words',
    quote:
      "If a website or system doesn't make everyday work easier and help the business grow, it's just window dressing. We build tools people genuinely use, with clarity, speed, and lasting value.",
    quoteAuthor: 'Paulo, Gene & Bry (Founding Team)'
  },
  */
/*
  team: {
    eyebrow: "Who You'll Work With",
    headingSub: 'The people behind',
    headingMain: 'YOUR PROJECT.',
    intro:
      'No account managers in the middle. You speak and work directly with Paulo, Gene, and Bry from first call to rollout.',
    founders: [
      {
        id: 'paulo',
        indexTag: '01 · Founder',
        domainPill: 'Backend & Cloud',
        imageKey: 'paulo',
        imageClass: 'founder-img-paulo',
        width: 296,
        height: 296,
        alt: 'Jose Paulo Antazo (Paulo), Founder and Backend Lead at Harmony IT Consultancy',
        name: 'Paulo Antazo',
        fullName: 'Jose Paulo Antazo',
        role: 'Founder & Backend Lead',
        bio: 'Guides company direction while designing the backend systems, APIs, and cloud setups our clients rely on every day. Focused on dependable uptime, clean data organization, and foundations built to grow smoothly.',
        focusTags: ['Enterprise APIs', 'Cloud Infrastructure', 'Data Governance'],
        portfolio: null,
        linkedin: {
          url: 'https://www.linkedin.com/in/jose-paulo-antazo-2aa86976/',
          label: 'Jose Paulo Antazo on LinkedIn (opens in new tab)'
        },
        github: null
      },
      {
        id: 'gene',
        indexTag: '02 · Co-Founder',
        domainPill: 'Frontend & Systems',
        imageKey: 'gene',
        imageClass: 'founder-img-gene',
        width: 480,
        height: 480,
        alt: 'Gene Ray Medel, Co-Founder, Frontend Lead and Systems Architect at Harmony IT Consultancy',
        name: 'Gene Medel',
        fullName: 'Gene Ray Medel',
        role: 'Co-Founder, Frontend Lead & Systems Architect',
        bio: 'Software and application developer building reliable web platforms, APIs, and offline-first cross-platform Flutter apps since 2011. Writes clean Vue.js and Tailwind CSS interfaces, Python automation, and modular systems that turn complex daily workflows into straightforward tools.',
        focusTags: ['Vue.js & Tailwind CSS', 'Flutter & Offline-First', 'Python & System APIs'],
        portfolio: {
          url: 'https://genexis.dev/',
          text: 'genexis.dev',
          ariaLabel: "Visit Gene Ray Medel's personal website genexis.dev (opens in new tab)"
        },
        linkedin: {
          url: 'https://www.linkedin.com/in/gene-ray-medel/',
          label: 'Gene Ray Medel on LinkedIn (opens in new tab)'
        },
        github: {
          url: 'https://github.com/bluegene37',
          label: 'Gene Ray Medel on GitHub (opens in new tab)'
        }
      },
      {
        id: 'bry',
        indexTag: '03 · Operations Lead',
        domainPill: 'UX/UI, QA & HR',
        imageKey: 'bry',
        imageClass: 'founder-img-bry',
        width: 532,
        height: 600,
        alt: 'Blaine Ivory M. Medel (Bry), Operations Officer, UX/UI Design, QA and Documentation Lead, HR at Harmony IT Consultancy',
        name: 'Bry Medel',
        fullName: 'Blaine Ivory M. Medel',
        role: 'Operations Officer, UX/UI Design, QA & Documentation Lead, HR',
        bio: 'Leads day-to-day operations, UX/UI design, quality assurance, documentation, and HR coordination across client projects. Shapes clear user flows, straightforward operational SOPs, and thorough QA testing so every platform feels natural and easy for teams to adopt.',
        focusTags: ['UX/UI Design Systems', 'Accessibility & QA', 'Operational SOPs & HR'],
        portfolio: {
          url: 'https://bimwebsite.vercel.app/',
          text: 'bimwebsite.vercel.app',
          ariaLabel: "Visit Blaine Ivory M. Medel's portfolio bimwebsite.vercel.app (opens in new tab)"
        },
        linkedin: {
          url: 'https://www.linkedin.com/in/blaineimedel/',
          label: 'Blaine Ivory M. Medel on LinkedIn (opens in new tab)'
        },
        github: null
      }
    ],
    ctaEyebrow: 'Direct Senior Partnership',
    ctaTitle: 'Work directly with Paulo, Gene & Bry.',
    ctaDesc:
      'No layers of account managers, just a direct working relationship with the team designing, testing, and building your platform.'
  },
  process: {
    eyebrow: 'How We Work Together',
    headingLead: 'Our 4-step',
    headingAccent: 'working process.',
    steps: [
      {
        num: '01',
        tag: 'Listening',
        title: 'Understand the Real Problem',
        desc: 'We speak with the people doing the daily work to see where time is lost, where inquiries drop off, and what needs to change before writing any code.'
      },
      {
        num: '02',
        tag: 'Planning',
        title: 'Design & System Plan',
        desc: 'We map out clear user flows, readable layouts, and a reliable backend setup shaped around your goals and timeline.'
      },
      {
        num: '03',
        tag: 'Building',
        title: 'Focused Development',
        desc: 'We build dependable APIs, responsive interfaces, and practical workflow tools, testing every flow carefully before anything goes live.'
      },
      {
        num: '04',
        tag: 'Support',
        title: 'Launch, Guides & Growth',
        desc: 'We launch cleanly, hand over clear operating guides for your staff, and stay close to support updates as your business grows.'
      }
    ]
  },
  // Gene - Nov, 24, 2026: Moved About Us CTA to bottom unified strip
  closingCta: {
    eyebrow: 'Direct Senior Partnership',
    headingLead: 'Work directly with',
    headingAccent: 'Paulo, Gene & Bry.',
    desc: 'No layers of account managers, just a direct working relationship with the team designing, testing, and building your platform.',
    primaryLabel: 'Start a Conversation',
    primaryTo: '/contact'
  }
};
*/
export const ABOUT_DATA = {
  hero: {
    eyebrow: 'About',
    titleStart: 'Your business first.',
    titleAccent: 'Technology',
    titleEnd: 'second.',
    lead: 'No account managers or handoffs—you work directly with Paulo, Gene, and Bry from first architecture sketch to launch.'
  },
  team: {
    eyebrow: 'Founding Team',
    headingLead: 'The people behind',
    headingAccent: 'the work.',
    founders: [
      {
        id: 'paulo',
        imageKey: 'paulo',
        imageClass: 'founder-img-paulo',
        width: 296,
        height: 296,
        alt: 'Paulo Antazo, Founder and Backend & Cloud Lead at Harmony IT Consultancy',
        name: 'Paulo Antazo',
        role: 'Founder · Backend & Cloud',
        shortBio: 'Architects dependable APIs, cloud setups, and clean data foundations built to grow smoothly.',
        bio: 'Guides company direction while designing the backend systems, APIs, and cloud setups our clients rely on every day.',
        portfolio: null,
        linkedin: {
          url: 'https://www.linkedin.com/in/jose-paulo-antazo-2aa86976/',
          label: 'Paulo Antazo on LinkedIn (opens in new tab)'
        },
        github: null
      },
      {
        id: 'gene',
        imageKey: 'gene',
        imageClass: 'founder-img-gene',
        width: 480,
        height: 480,
        alt: 'Gene Medel, Co-Founder, Frontend & Systems Lead at Harmony IT Consultancy',
        name: 'Gene Medel',
        role: 'Co-Founder · Frontend & Systems',
        shortBio: 'Builds modern web platforms, Flutter apps, and modular workflow systems since 2011.',
        bio: 'Software and application developer building reliable web platforms, APIs, and offline-first cross-platform Flutter apps since 2011.',
        portfolio: {
          url: 'https://genexis.dev/',
          text: 'genexis.dev',
          ariaLabel: "Visit Gene Medel's personal website genexis.dev (opens in new tab)"
        },
        linkedin: {
          url: 'https://www.linkedin.com/in/gene-ray-medel/',
          label: 'Gene Medel on LinkedIn (opens in new tab)'
        },
        github: {
          url: 'https://github.com/bluegene37',
          label: 'Gene Medel on GitHub (opens in new tab)'
        }
      },
      {
        id: 'bry',
        imageKey: 'bry',
        imageClass: 'founder-img-bry',
        width: 532,
        height: 600,
        alt: 'Bry Medel, Operations, UX/UI & QA Lead at Harmony IT Consultancy',
        name: 'Bry Medel',
        role: 'Operations · UX/UI & QA',
        shortBio: 'Shapes clear user flows, design systems, thorough QA, and operational playbooks teams adopt fast.',
        bio: 'Leads day-to-day operations, UX/UI design, quality assurance, documentation, and HR coordination across client projects.',
        portfolio: {
          url: 'https://bimwebsite.vercel.app/',
          text: 'bimwebsite.vercel.app',
          ariaLabel: "Visit Bry Medel's portfolio bimwebsite.vercel.app (opens in new tab)"
        },
        linkedin: {
          url: 'https://www.linkedin.com/in/blaineimedel/',
          label: 'Bry Medel on LinkedIn (opens in new tab)'
        },
        github: null
      }
    ]
  },
  process: {
    eyebrow: 'Process',
    headingLead: 'Four steps from',
    headingAccent: 'problem to launch.',
    steps: [
      {
        num: '01',
        title: 'Discover',
        desc: 'We map where your team loses time and where manual steps slow daily work.'
      },
      {
        num: '02',
        title: 'Architect',
        desc: 'We design clear user flows, readable layouts, and dependable backend structure.'
      },
      {
        num: '03',
        title: 'Build',
        desc: 'We engineer clean APIs, responsive web interfaces, and field tools tested end-to-end.'
      },
      {
        num: '04',
        title: 'Launch',
        desc: 'We ship cleanly with clear operating guides and direct ongoing support.'
      }
    ]
  },
  closingCta: {
    eyebrow: 'Direct Senior Team',
    headingLead: 'Work directly with',
    headingAccent: 'Paulo, Gene & Bry.',
    primaryLabel: 'Start a Conversation',
    primaryTo: '/contact',
    secondaryEmail: SITE_META.email
  }
};

// Gene - Nov, 24, 2026: Editorial SwitchFiber split-row data with concise summaries and aligned scope IDs
/*
export const PROJECTS_DATA = {
  hero: {
    eyebrow: 'Selected Work',
    titleStart: 'Practical systems built for',
    titleAccent: 'real',
    titleEnd: 'operations.',
    lead: 'Explore the live platforms we built for SwitchFiber, helping internal teams manage daily fiber operations while giving subscribers across Rizal an easier self-service experience.'
  },
*/
  // Gene - Nov, 24, 2026: Switched Projects filters to clear platform categories
  /*
  filters: [
    { id: 'all', label: 'All Projects' },
    { id: 'problem', label: 'Problem Solvers' },
    { id: 'promo', label: 'Online Presence' },
    { id: 'operations', label: 'Daily Operations' },
    { id: 'income', label: 'Revenue & Billing' }
  ],
  */
/*
  filters: [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Portals' },
    { id: 'admin', label: 'Admin Console' },
    { id: 'mobile', label: 'Mobile App' }
  ],
  projects: [
    {
      id: 'switchfiber-admin',
      platform: 'admin',
      primaryPriority: 'problem',
      categories: ['problem', 'operations'],
      imageKey: 'switchfiber-admin',
      thumbModifier: 'project-thumb--admin',
      width: 1024,
      height: 640,
      alt: 'SwitchFiber Admin distributed fiber network management portal login screen',
      categoryLabel: 'Problem Solver · Operations',
      title: 'SwitchFiber Admin — Network Management',
      desc: 'Internal operations console built for Switch Fiber Network Operations, bringing subscriber records, service plans, technician job orders, and fiber infrastructure tracking into one organized system.',
      metrics: [
        { value: '4 Core Modules', label: 'Subscribers, Plans, Job Orders, Fiber' },
        { value: 'Vue 3 · PrimeVue', label: 'Operations SPA Console' }
      ],
      tagPill: 'Admin Operations Portal',
      liveUrl: 'https://admin.switchfiber.ph/switchfiberadmin/login',
      liveActionLabel: 'Open Portal',
      caseStudy: {
        eyebrow: 'PROBLEM SOLVER · OPERATIONS',
        title: 'SwitchFiber Admin — Network Management',
        desc: 'An internal operations console built for Switch Fiber Network Operations to bring day-to-day ISP management into one clear workspace.',
        challenge:
          'Running a regional fiber network means keeping subscriber records, service plans, field technician job orders, and fiber infrastructure synced cleanly without bouncing between disconnected spreadsheets.',
        solution:
          'We built the authenticated SwitchFiber Admin console to bring subscriber accounts, service plan configurations, technician job orders, and fiber network management together inside one responsive web application.',
        capabilitiesSummary: 'Subscriber, Plan, Job Order & Fiber Management',
        liveHostText: 'admin.switchfiber.ph/switchfiberadmin/login',
        tech: 'Vue 3, Vite, PrimeVue, Bootstrap, REST API',
        techStack: ['Vue 3', 'Vite', 'PrimeVue', 'Bootstrap', 'REST API']
      }
    },
    {
      id: 'switchfiber-subscriber',
      platform: 'web',
      primaryPriority: 'promo',
      categories: ['problem', 'promo', 'operations', 'income'],
      imageKey: 'switchfiber-subscriber',
      thumbModifier: 'project-thumb--frame',
      width: 1024,
      height: 640,
      alt: 'SwitchFiber Public and Subscriber Website featuring Rizal Fiber Grid serviceability check and fiber plans',
      categoryLabel: 'Online Presence · Operations · Billing',
      title: 'SwitchFiber Public & Subscriber Portal',
      desc: 'Public website and subscriber portal for SwitchFiber across Binangonan and Rizal, letting visitors check barangay fiber availability, compare FTTH plans starting at ₱699/mo, apply online, track applications, and pay bills digitally.',
      metrics: [
        { value: 'From ₱699/mo', label: 'Up to 220 Mbps · 0 Data Cap' },
        { value: '9 Municipalities', label: 'Binangonan & Rizal Fiber Grid' }
      ],
      tagPill: 'Subscriber & Public Web',
      liveUrl: 'https://switchfiberuser.genexis.dev/',
      liveActionLabel: 'Visit Site',
      caseStudy: {
        eyebrow: 'ONLINE PRESENCE · OPERATIONS · BILLING',
        title: 'SwitchFiber Public & Subscriber Portal',
        desc: 'The public website and subscriber portal serving homes and businesses across Binangonan and neighboring towns in Rizal.',
        challenge:
          'Future subscribers needed a quick way to check barangay fiber availability, see honest plan pricing up front, apply online without visiting a branch, track installation status, and pay bills from their phone.',
        solution:
          'We built a responsive public website and subscriber portal featuring the Rizal Fiber Grid serviceability checker, clear FTTH plan tiers (SwitchLite 50 Mbps ₱699, SwitchConnect 90 Mbps ₱799, SwitchNet 120 Mbps ₱999; up to 220 Mbps with 0 data cap), online signup (/register), application status tracking, router setup guides, and digital bill pay through pay.switchfiber.ph (GCash / QR Ph, Maya, WeChat Pay, Visa/Mastercard).',
        capabilitiesSummary: '9 Rizal Municipalities Covered · Plans from ₱699/mo',
        liveHostText: 'switchfiberuser.genexis.dev',
        tech: 'Modern Web SPA, Rizal Fiber Grid Serviceability Checker, Digital Payments (pay.switchfiber.ph)',
        techStack: ['Modern Web SPA', 'Rizal Fiber Grid Checker', 'Digital Payments (pay.switchfiber.ph)']
      }
    },
    {
      id: 'switchfiber-mobile',
      platform: 'mobile',
      primaryPriority: 'operations',
      categories: ['problem', 'operations'],
      imageKey: 'switchfiber-mobile',
      thumbModifier: 'project-thumb--mobile',
      width: 380,
      height: 787,
      alt: 'Switch Fiber Field Technician Terminal mobile app Technician Sign In screen connected to admin server',
      categoryLabel: 'Mobile App · Field Operations',
      title: 'Switch Fiber — Field Technician Terminal',
      desc: 'Dedicated mobile terminal built for Switch Fiber Network Operations field technicians to sign in securely with field credentials, access assigned work orders, and stay synced with the operations server on the go.',
      metrics: [
        { value: 'Field Terminal', label: 'Assigned Work Orders' },
        { value: 'Direct Sync', label: 'SwitchFiber Ops Server' }
      ],
      tagPill: 'Mobile Field App',
      liveUrl: null,
      liveActionLabel: null,
      caseStudy: {
        eyebrow: 'MOBILE APP · FIELD OPERATIONS',
        title: 'Switch Fiber — Field Technician Terminal',
        desc: 'A dedicated mobile field terminal engineered for Switch Fiber Network Operations technicians working out on installations and line maintenance.',
        challenge:
          'Field crews away from the office needed a focused, reliable mobile interface to sign in with their technician credentials and review assigned work orders without navigating a full desktop admin console on a phone.',
        solution:
          'We built the Switch Fiber Field Technician Terminal mobile app with authenticated technician sign-in, credential persistence ("Remember me"), live backend server connection status (admin.switchfiber.ph), and direct access to assigned field work orders.',
        capabilitiesSummary: 'Technician Sign-In & Work Order Access · Connected to Switch Fiber Network Operations',
        liveHostText: null,
        tech: 'Cross-Platform Mobile App, Authenticated Field Terminal, SwitchFiber Operations REST API',
        techStack: ['Cross-Platform Mobile', 'Authenticated Field Terminal', 'SwitchFiber REST API']
      }
    }
  ],
  closingCta: {
    eyebrow: 'Have a Project in Mind?',
    headingLead: 'Let’s scope your custom',
    headingAccent: 'web or ops platform.',
    desc: 'Talk directly with our founding engineering and UX leads about your workflow goals and timeline.',
    primaryLabel: 'Start a Conversation',
    primaryTo: '/contact',
    secondaryLabel: 'Meet the Team',
    secondaryTo: '/about'
  }
};
*/
export const PROJECTS_DATA = {
  hero: {
    eyebrow: 'Selected Work',
    titleStart: 'Built for',
    titleAccent: 'real',
    titleEnd: 'operations.',
    lead: 'Live web, operations, and field mobile software powering SwitchFiber across Rizal.'
  },
  filters: [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Portals' },
    { id: 'admin', label: 'Admin Console' },
    { id: 'mobile', label: 'Mobile App' }
  ],
  projects: [
    {
      id: 'switchfiber-admin',
      indexNum: '01',
      platform: 'admin',
      primaryPriority: 'operations',
      categories: ['problem', 'operations'],
      imageKey: 'switchfiber-admin',
      thumbModifier: 'project-thumb--admin',
      width: 1024,
      height: 640,
      alt: 'SwitchFiber Admin distributed fiber network management portal login screen',
      subtitle: 'Operations Console',
      categoryLabel: 'Operations System',
      title: 'SwitchFiber Admin — Network Management',
      shortDesc:
        'Authenticated operations console uniting subscriber accounts, plans, technician dispatch, and fiber infrastructure.',
      desc: 'Internal operations console built for Switch Fiber Network Operations, bringing subscriber records, service plans, technician job orders, and fiber infrastructure tracking into one organized system.',
      metrics: [
        { value: '4 Core Modules', label: 'Subscribers, Plans, Jobs, Fiber' },
        { value: 'Vue 3 · PrimeVue', label: 'Operations Console' }
      ],
      tagPill: 'Admin Portal',
      liveUrl: 'https://admin.switchfiber.ph/switchfiberadmin/login',
      liveActionLabel: 'Open Portal',
      caseStudy: {
        eyebrow: 'OPERATIONS SYSTEM',
        title: 'SwitchFiber Admin — Network Management',
        desc: 'An internal operations console built for Switch Fiber Network Operations to bring day-to-day ISP management into one clear workspace.',
        challenge:
          'Running a regional fiber network means keeping subscriber records, service plans, field technician job orders, and fiber infrastructure synced cleanly without bouncing between disconnected spreadsheets.',
        solution:
          'We built the authenticated SwitchFiber Admin console to bring subscriber accounts, service plan configurations, technician job orders, and fiber network management together inside one responsive web application.',
        capabilitiesSummary: 'Subscriber, Plan, Job Order & Fiber Management',
        liveHostText: 'admin.switchfiber.ph/switchfiberadmin/login',
        tech: 'Vue 3, Vite, PrimeVue, Bootstrap, REST API',
        techStack: ['Vue 3', 'Vite', 'PrimeVue', 'Bootstrap', 'REST API']
      }
    },
    {
      id: 'switchfiber-subscriber',
      indexNum: '02',
      platform: 'web',
      primaryPriority: 'web',
      categories: ['problem', 'promo', 'operations', 'income'],
      imageKey: 'switchfiber-subscriber',
      thumbModifier: 'project-thumb--frame',
      width: 1024,
      height: 640,
      alt: 'SwitchFiber Public and Subscriber Website featuring Rizal Fiber Grid serviceability check and fiber plans',
      subtitle: 'Public Web & Billing',
      categoryLabel: 'Web Platform · Digital Portal',
      title: 'SwitchFiber Public & Subscriber Portal',
      shortDesc:
        'Public website, Rizal Fiber Grid availability checker, online signup, and digital billing portal serving 9 municipalities.',
      desc: 'Public website and subscriber portal for SwitchFiber across Binangonan and Rizal, letting visitors check barangay fiber availability, compare FTTH plans starting at ₱699/mo, apply online, track applications, and pay bills digitally.',
      metrics: [
        { value: 'From ₱699/mo', label: 'Up to 220 Mbps · 0 Data Cap' },
        { value: '9 Municipalities', label: 'Rizal Fiber Grid' }
      ],
      tagPill: 'Public & Subscriber Web',
      liveUrl: 'https://switchfiberuser.genexis.dev/',
      liveActionLabel: 'Visit Site',
      caseStudy: {
        eyebrow: 'WEB PLATFORM · DIGITAL PORTAL',
        title: 'SwitchFiber Public & Subscriber Portal',
        desc: 'The public website and subscriber portal serving homes and businesses across Binangonan and neighboring towns in Rizal.',
        challenge:
          'Future subscribers needed a quick way to check barangay fiber availability, see honest plan pricing up front, apply online without visiting a branch, track installation status, and pay bills from their phone.',
        solution:
          'We built a responsive public website and subscriber portal featuring the Rizal Fiber Grid serviceability checker, clear FTTH plan tiers (SwitchLite 50 Mbps ₱699, SwitchConnect 90 Mbps ₱799, SwitchNet 120 Mbps ₱999; up to 220 Mbps with 0 data cap), online signup (/register), application status tracking, router setup guides, and digital bill pay through pay.switchfiber.ph (GCash / QR Ph, Maya, WeChat Pay, Visa/Mastercard).',
        capabilitiesSummary: '9 Rizal Municipalities Covered · Plans from ₱699/mo',
        liveHostText: 'switchfiberuser.genexis.dev',
        tech: 'Modern Web SPA, Rizal Fiber Grid Serviceability Checker, Digital Payments (pay.switchfiber.ph)',
        techStack: ['Modern Web SPA', 'Rizal Fiber Grid Checker', 'Digital Payments (pay.switchfiber.ph)']
      }
    },
    {
      id: 'switchfiber-mobile',
      indexNum: '03',
      platform: 'mobile',
      primaryPriority: 'mobile',
      categories: ['problem', 'operations'],
      imageKey: 'switchfiber-mobile',
      thumbModifier: 'project-thumb--mobile',
      width: 380,
      height: 787,
      alt: 'Switch Fiber Field Technician Terminal mobile app Technician Sign In screen connected to admin server',
      subtitle: 'Field Mobile App',
      categoryLabel: 'Mobile Field App',
      title: 'Switch Fiber — Field Technician Terminal',
      shortDesc:
        'Focused cross-platform mobile terminal keeping field technicians synced to assigned work orders on site.',
      desc: 'Dedicated mobile terminal built for Switch Fiber Network Operations field technicians to sign in securely with field credentials, access assigned work orders, and stay synced with the operations server on the go.',
      metrics: [
        { value: 'Field Terminal', label: 'Assigned Work Orders' },
        { value: 'Direct Sync', label: 'SwitchFiber Ops Server' }
      ],
      tagPill: 'Mobile Field App',
      liveUrl: null,
      liveActionLabel: null,
      caseStudy: {
        eyebrow: 'MOBILE FIELD APP',
        title: 'Switch Fiber — Field Technician Terminal',
        desc: 'A dedicated mobile field terminal engineered for Switch Fiber Network Operations technicians working out on installations and line maintenance.',
        challenge:
          'Field crews away from the office needed a focused, reliable mobile interface to sign in with their technician credentials and review assigned work orders without navigating a full desktop admin console on a phone.',
        solution:
          'We built the Switch Fiber Field Technician Terminal mobile app with authenticated technician sign-in, credential persistence ("Remember me"), live backend server connection status (admin.switchfiber.ph), and direct access to assigned field work orders.',
        capabilitiesSummary: 'Technician Sign-In & Work Order Access · Connected to Switch Fiber Network Operations',
        liveHostText: null,
        tech: 'Cross-Platform Mobile App, Authenticated Field Terminal, SwitchFiber Operations REST API',
        techStack: ['Cross-Platform Mobile', 'Authenticated Field Terminal', 'SwitchFiber REST API']
      }
    }
  ],
  closingCta: {
    eyebrow: 'Next Build',
    headingLead: 'Need a custom',
    headingAccent: 'platform?',
    primaryLabel: 'Start a Conversation',
    primaryTo: '/contact',
    secondaryEmail: SITE_META.email
  }
};

// Gene - Nov, 24, 2026: Architectural Contact split copy and concrete optional scope pills
/*
export const CONTACT_DATA = {
  hero: {
    eyebrow: 'Get in Touch',
    titleStart: "Let's build something",
    titleAccent: 'useful',
    titleEnd: 'together.',
    lead: 'Skip long ticket queues and speak directly with our founders. Pick what matters most to your team below to put together a quick project brief in seconds.'
  },
  briefBuilder: {
    eyebrow: 'Quick Project Brief',
    heading: 'What would help your business most right now?',
    subtitle:
      'Choose the areas you want to focus on so Paulo, Gene, and Bry can come prepared with practical ideas for our first conversation.',
    priorities: [
      {
        id: 'problem',
        title: '01 / Fix a Workflow Bottleneck',
        briefLabel: 'Fix a Workflow Bottleneck',
        desc: 'Replace manual record-keeping, missed inquiries, customer delays, or disorganized spreadsheets.'
      },
      {
        id: 'promo',
        title: '02 / Improve Online Presence',
        briefLabel: 'Improve Online Presence',
        desc: 'Build a fast, mobile-ready site that clearly explains your services and ranks well in search.'
      },
      {
        id: 'operations',
        title: '03 / Organize Daily Operations',
        briefLabel: 'Organize Daily Operations',
        desc: 'Simplify bookings, client portals, job dispatch, and invoicing so day-to-day work flows smoothly.'
      },
      {
        id: 'income',
        title: '04 / Support Revenue Growth',
        briefLabel: 'Support Revenue Growth',
        desc: 'Guide interested visitors smoothly toward inquiries, quotes, bookings, or online payments.'
      }
    ]
  },
  directBox: {
    label: 'Direct Inquiries Email',
    email: SITE_META.email,
    inquirySubject: 'Inquiry regarding HarmonyITC Web Consultancy'
  },
  channels: [
    {
      label: 'Reply Time',
      value: 'Within 24 Hours',
      desc: 'A personal reply from Paulo, Gene, or Bry.'
    },
    {
      label: 'Office Hours',
      value: 'Mon – Fri · 9 AM – 6 PM',
      desc: 'Flexible call slots when you need to move quickly.'
    },
    {
      label: 'Who You Reach',
      value: 'Paulo · Gene · Bry',
      desc: 'You talk directly with the people designing and building your site.'
    }
  ]
};
*/
export const CONTACT_DATA = {
  hero: {
    eyebrow: 'Contact',
    titleStart: "Let's build",
    titleAccent: 'something',
    titleEnd: 'useful.'
  },
  directNote: 'Direct to Paulo, Gene & Bry · Typical reply within 24 hours',
  briefBuilder: {
    eyebrow: 'Project Scope',
    heading: 'Tell us what you are building.',
    priorities: [
      { id: 'web', title: 'Web Platform', briefLabel: 'Web Platform' },
      { id: 'operations', title: 'Operations System', briefLabel: 'Operations System' },
      { id: 'mobile', title: 'Mobile Field App', briefLabel: 'Mobile Field App' },
      { id: 'portals', title: 'Digital Portal & Billing', briefLabel: 'Digital Portal & Billing' }
    ]
  },
  directBox: {
    label: 'Direct Email',
    email: SITE_META.email,
    inquirySubject: 'Inquiry regarding HarmonyITC Web Consultancy'
  }
};
