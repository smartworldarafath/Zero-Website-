// Realtime Persistent Storage & Admin Sync Engine
export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  embedLink?: string;
  image: string;
  tag: string;
  duration: string;
}

export interface UserPlanData {
  plan: 'free' | 'core' | 'enterprise' | 'none';
  activatedAt: number;
  trialDays: number;
  status: 'active' | 'expired' | 'pending';
  contactRequested?: boolean;
}

export interface PricingConfig {
  starterMonthly: number;
  starterAnnual: number;
  coreMonthly: number;
  coreAnnual: number;
  enterpriseMonthly: number;
  enterpriseAnnual: number;
  discountPercent: number;
  trialDurationDays: number;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  type: 'info' | 'success' | 'warning' | 'deal';
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'user-1',
    title: 'Arabian Enterprise',
    description: 'A modern corporate enterprise web portal built for seamless business operations, corporate services showcase, and client consultation.',
    tech: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    link: 'https://arbian-enterprise.vercel.app/',
    embedLink: '/proxy/arbian-enterprise/',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tag: 'Enterprise Web',
    duration: 'Live Project'
  },
  {
    id: 'user-2',
    title: 'International Education Consultancy',
    description: 'A comprehensive education and study-abroad consultancy platform assisting students with global university programs, visa guidance, and admission processing.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    link: 'https://international-education-consultancy.vercel.app/',
    embedLink: '/proxy/international-education/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    tag: 'Education & Visa',
    duration: 'Live Project'
  },
  {
    id: 'user-3',
    title: 'Local Drive Platform',
    description: 'A fast, reliable cloud storage and file management web application designed for organizing, sharing, and securing user documents seamlessly.',
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Vercel'],
    link: 'https://local-drive.vercel.app/',
    embedLink: '/proxy/local-drive/',
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    tag: 'Cloud Storage',
    duration: 'Live Project'
  },
  {
    id: 'user-4',
    title: 'Local Drive Official Web',
    description: 'The official web presence and promotional platform for Local Drive, featuring interactive product tours, service highlights, and onboarding controls.',
    tech: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Netlify'],
    link: 'https://local-drive-official-web.netlify.app/',
    embedLink: '/proxy/local-drive-official/',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tag: 'Official Portal',
    duration: 'Live Project'
  },
  {
    id: 'user-5',
    title: '0 Zero Studio AI',
    description: 'An all-in-one suite of generative AI tools, code helpers, and intelligent content creation workflows engineered for modern developers and creators.',
    tech: ['React', 'Gemini API', 'Tailwind CSS', 'Netlify'],
    link: 'https://0zerostudioai.netlify.app/',
    embedLink: '/proxy/0zerostudioai/',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tag: 'AI Studio Suite',
    duration: 'Live Project'
  }
];

export const DEFAULT_PRICING: PricingConfig = {
  starterMonthly: 0,
  starterAnnual: 0,
  coreMonthly: 4.99,
  coreAnnual: 2.49,
  enterpriseMonthly: 9.99,
  enterpriseAnnual: 4.99,
  discountPercent: 50,
  trialDurationDays: 25
};

export const DEFAULT_ANNOUNCEMENT: AnnouncementConfig = {
  enabled: true,
  text: '🚀 25-Day Free Trial Available! Explore Zero Studio Code & AI Suite today.',
  linkText: 'Try Now',
  linkUrl: '#pricing',
  type: 'deal'
};

// Storage Keys
const KEYS = {
  PROJECTS: 'zero_projects_data',
  USER_PLAN: 'zero_user_plan_data',
  PRICING: 'zero_pricing_config',
  ANNOUNCEMENT: 'zero_announcement_config',
  ADMIN_AUTH: 'zero_admin_auth'
};

// Event Dispatcher for Realtime Sync
export function notifyStorageUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('zero_storage_sync'));
  }
}

// ── Projects CRUD ──
export function getStoredProjects(): ProjectItem[] {
  if (typeof window === 'undefined') return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveStoredProjects(projects: ProjectItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  notifyStorageUpdate();
}

// ── User Plan & Trial ──
export function getUserPlan(): UserPlanData {
  if (typeof window === 'undefined') {
    return { plan: 'none', activatedAt: 0, trialDays: 25, status: 'expired' };
  }
  try {
    const raw = localStorage.getItem(KEYS.USER_PLAN);
    if (!raw) {
      return { plan: 'none', activatedAt: 0, trialDays: 25, status: 'expired' };
    }
    const data: UserPlanData = JSON.parse(raw);
    const msPassed = Date.now() - data.activatedAt;
    const daysPassed = msPassed / (1000 * 60 * 60 * 24);
    
    if (daysPassed > data.trialDays) {
      data.status = 'expired';
    } else {
      data.status = 'active';
    }
    return data;
  } catch {
    return { plan: 'none', activatedAt: 0, trialDays: 25, status: 'expired' };
  }
}

export function setUserPlan(plan: 'free' | 'core' | 'enterprise', trialDays = 25, contactRequested = false) {
  if (typeof window === 'undefined') return;
  const data: UserPlanData = {
    plan,
    activatedAt: Date.now(),
    trialDays,
    status: 'active',
    contactRequested
  };
  localStorage.setItem(KEYS.USER_PLAN, JSON.stringify(data));
  notifyStorageUpdate();
}

export function getRemainingTrialDays(): number {
  const userPlan = getUserPlan();
  if (userPlan.status !== 'active') return 0;
  const msPassed = Date.now() - userPlan.activatedAt;
  const daysPassed = msPassed / (1000 * 60 * 60 * 24);
  const remaining = Math.ceil(userPlan.trialDays - daysPassed);
  return Math.max(0, remaining);
}

// ── Pricing Config ──
export function getPricingConfig(): PricingConfig {
  if (typeof window === 'undefined') return DEFAULT_PRICING;
  try {
    const raw = localStorage.getItem(KEYS.PRICING);
    if (!raw) return DEFAULT_PRICING;
    return { ...DEFAULT_PRICING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PRICING;
  }
}

export function savePricingConfig(config: PricingConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.PRICING, JSON.stringify(config));
  notifyStorageUpdate();
}

// ── Announcement Config ──
export function getAnnouncementConfig(): AnnouncementConfig {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT;
  try {
    const raw = localStorage.getItem(KEYS.ANNOUNCEMENT);
    if (!raw) return DEFAULT_ANNOUNCEMENT;
    return { ...DEFAULT_ANNOUNCEMENT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveAnnouncementConfig(config: AnnouncementConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ANNOUNCEMENT, JSON.stringify(config));
  notifyStorageUpdate();
}

// ── Admin Authentication ──
export function checkAdminAuth(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuth(isAuth: boolean) {
  if (typeof window === 'undefined') return;
  if (isAuth) {
    localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(KEYS.ADMIN_AUTH);
  }
}
