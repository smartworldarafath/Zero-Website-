// Realtime Persistent Storage, CMS, CRM & Admin Sync Engine

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
  featured?: boolean;
  visible?: boolean;
}

export interface UserPlanData {
  id?: string;
  name?: string;
  email?: string;
  plan: 'free' | 'core' | 'enterprise' | 'none';
  activatedAt: number;
  trialDays: number;
  status: 'active' | 'expired' | 'pending';
  contactRequested?: boolean;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  project: string;
  message: string;
  timestamp: number;
  status: 'new' | 'contacted' | 'resolved';
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
  freeTrialEnabled: boolean;
  coreFeatures: string[];
  enterpriseFeatures: string[];
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  type: 'info' | 'success' | 'warning' | 'deal' | 'neon';
}

export interface SiteCmsConfig {
  badgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  githubUrl: string;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  enableConfettiOnTrial: boolean;
}

export interface AiGatewayConfig {
  defaultModelId: string;
  groqAcceleration: boolean;
  geminiGrounding: boolean;
  pollinationsFallback: boolean;
  customSystemPrompt: string;
}

export interface SiteAnalytics {
  totalVisits: number;
  aiGenerations: number;
  trialActivations: number;
  contactInquiries: number;
  lastActiveTimestamp: number;
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
    duration: 'Live Project',
    featured: true,
    visible: true
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
    duration: 'Live Project',
    featured: true,
    visible: true
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
    duration: 'Live Project',
    featured: true,
    visible: true
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
    duration: 'Live Project',
    featured: false,
    visible: true
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
    duration: 'Live Project',
    featured: false,
    visible: true
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
  trialDurationDays: 25,
  freeTrialEnabled: true,
  coreFeatures: [
    'Free 25 Days Included Instantly',
    'Unlimited Fast AI Generations',
    'Access All 22+ AI Models & WASM Engines',
    'Priority Code Generation & Web Previews',
    'Dedicated Developer Consultation'
  ],
  enterpriseFeatures: [
    'Custom Web & AI Application Building',
    'Dedicated Deployment on Vercel/Cloud',
    'Direct 1-on-1 Consultation with Arafath',
    'Full Source Code Handover & GitHub Setup',
    '24/7 Priority Emergency Support'
  ]
};

export const DEFAULT_ANNOUNCEMENT: AnnouncementConfig = {
  enabled: true,
  text: '🚀 25-Day Free Trial Available! Explore Zero Studio Code & AI Suite today.',
  linkText: 'Try Now',
  linkUrl: '#pricing',
  type: 'neon'
};

export const DEFAULT_CMS: SiteCmsConfig = {
  badgeText: 'Next-Gen Digital Engine & AI Studio 2026',
  heroTitle: 'Engineered for Creators, Developers & Enterprises.',
  heroSubtitle: 'Experience blazing-fast web applications, custom enterprise deployments, and a complete suite of intelligent AI productivity tools.',
  contactEmail: 'arafathrahman711@gmail.com',
  githubUrl: 'https://github.com/smartworldarafath/Zero-Website-',
  maintenanceMode: false,
  maintenanceNotice: 'Zero Studio is undergoing scheduled upgrades. We will be right back in a few minutes!',
  enableConfettiOnTrial: true
};

export const DEFAULT_AI_GATEWAY: AiGatewayConfig = {
  defaultModelId: 'gemini-3.1-pro',
  groqAcceleration: true,
  geminiGrounding: true,
  pollinationsFallback: true,
  customSystemPrompt: 'You are Zero Studio Code AI, an ultra-advanced software engineering and design suite.'
};

// Storage Keys
const KEYS = {
  PROJECTS: 'zero_projects_data',
  USER_PLAN: 'zero_user_plan_data',
  USER_LIST: 'zero_users_directory',
  INQUIRIES: 'zero_contact_inquiries',
  PRICING: 'zero_pricing_config',
  ANNOUNCEMENT: 'zero_announcement_config',
  CMS: 'zero_cms_config',
  AI_GATEWAY: 'zero_ai_gateway_config',
  ANALYTICS: 'zero_site_analytics',
  ADMIN_PIN: 'zero_admin_security_pin',
  ADMIN_AUTH: 'zero_admin_auth'
};

// Realtime Sync Broadcaster
export function notifyStorageUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('zero_storage_sync'));
  }
}

// ── Security PIN Management (Default: 4048) ──
export function getAdminPin(): string {
  if (typeof window === 'undefined') return '4048';
  return localStorage.getItem(KEYS.ADMIN_PIN) || '4048';
}

export function saveAdminPin(pin: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ADMIN_PIN, pin.trim() || '4048');
  notifyStorageUpdate();
}

export function verifyAdminPin(entered: string): boolean {
  const pin = getAdminPin();
  // Allow configured PIN, 4048, or emergency master PIN
  return entered === pin || entered === '4048' || entered === 'arafath711';
}

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
  trackTrialActivation();
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

// ── User CRM Directory ──
export function getRegisteredUsers(): UserPlanData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.USER_LIST);
    if (!raw) {
      // Create initial user list
      const initial: UserPlanData[] = [
        { id: 'usr-1', name: 'Demo Trial User', email: 'user@zerostudio.app', plan: 'free', activatedAt: Date.now() - 86400000 * 2, trialDays: 25, status: 'active' },
        { id: 'usr-2', name: 'Enterprise Client (Arabian)', email: 'client@arbian.com', plan: 'enterprise', activatedAt: Date.now() - 86400000 * 5, trialDays: 365, status: 'active' }
      ];
      localStorage.setItem(KEYS.USER_LIST, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: UserPlanData[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.USER_LIST, JSON.stringify(users));
  notifyStorageUpdate();
}

// ── Contact Us Inquiries CRM ──
export function getContactInquiries(): ContactInquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.INQUIRIES);
    if (!raw) {
      const initial: ContactInquiry[] = [
        {
          id: 'inq-1',
          name: 'Ahmed Tariq',
          email: 'ahmed.tariq@arabiancorp.com',
          company: 'Arabian Enterprises',
          project: 'Custom AI Portal Development',
          message: 'We are interested in licensing Zero Studio Code with dedicated Claude Sonnet integration for our developer team.',
          timestamp: Date.now() - 86400000 * 1,
          status: 'new'
        }
      ];
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'timestamp' | 'status'>) {
  if (typeof window === 'undefined') return;
  const current = getContactInquiries();
  const newInq: ContactInquiry = {
    ...inquiry,
    id: 'inq-' + Date.now(),
    timestamp: Date.now(),
    status: 'new'
  };
  const updated = [newInq, ...current];
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(updated));
  trackContactInquiry();
  notifyStorageUpdate();
}

export function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved') {
  if (typeof window === 'undefined') return;
  const current = getContactInquiries();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(updated));
  notifyStorageUpdate();
}

export function deleteInquiry(id: string) {
  if (typeof window === 'undefined') return;
  const current = getContactInquiries();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(updated));
  notifyStorageUpdate();
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

// ── Site CMS Config ──
export function getSiteCmsConfig(): SiteCmsConfig {
  if (typeof window === 'undefined') return DEFAULT_CMS;
  try {
    const raw = localStorage.getItem(KEYS.CMS);
    if (!raw) return DEFAULT_CMS;
    return { ...DEFAULT_CMS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CMS;
  }
}

export function saveSiteCmsConfig(config: SiteCmsConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.CMS, JSON.stringify(config));
  notifyStorageUpdate();
}

// ── AI Gateway Config ──
export function getAiGatewayConfig(): AiGatewayConfig {
  if (typeof window === 'undefined') return DEFAULT_AI_GATEWAY;
  try {
    const raw = localStorage.getItem(KEYS.AI_GATEWAY);
    if (!raw) return DEFAULT_AI_GATEWAY;
    return { ...DEFAULT_AI_GATEWAY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_GATEWAY;
  }
}

export function saveAiGatewayConfig(config: AiGatewayConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.AI_GATEWAY, JSON.stringify(config));
  notifyStorageUpdate();
}

// ── Site Analytics ──
export function getSiteAnalytics(): SiteAnalytics {
  if (typeof window === 'undefined') {
    return { totalVisits: 1420, aiGenerations: 3890, trialActivations: 312, contactInquiries: 18, lastActiveTimestamp: Date.now() };
  }
  try {
    const raw = localStorage.getItem(KEYS.ANALYTICS);
    if (!raw) {
      const initial: SiteAnalytics = { totalVisits: 1420, aiGenerations: 3890, trialActivations: 312, contactInquiries: 18, lastActiveTimestamp: Date.now() };
      localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { totalVisits: 1420, aiGenerations: 3890, trialActivations: 312, contactInquiries: 18, lastActiveTimestamp: Date.now() };
  }
}

export function trackSiteVisit() {
  if (typeof window === 'undefined') return;
  const current = getSiteAnalytics();
  current.totalVisits += 1;
  current.lastActiveTimestamp = Date.now();
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(current));
}

export function trackAiGeneration() {
  if (typeof window === 'undefined') return;
  const current = getSiteAnalytics();
  current.aiGenerations += 1;
  current.lastActiveTimestamp = Date.now();
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(current));
}

export function trackTrialActivation() {
  if (typeof window === 'undefined') return;
  const current = getSiteAnalytics();
  current.trialActivations += 1;
  current.lastActiveTimestamp = Date.now();
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(current));
}

export function trackContactInquiry() {
  if (typeof window === 'undefined') return;
  const current = getSiteAnalytics();
  current.contactInquiries += 1;
  current.lastActiveTimestamp = Date.now();
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(current));
}

// ── Full System Backup & Restore ──
export function exportFullDatabase(): string {
  const data = {
    version: '2026.2.0',
    exportTimestamp: Date.now(),
    projects: getStoredProjects(),
    pricing: getPricingConfig(),
    announcement: getAnnouncementConfig(),
    cms: getSiteCmsConfig(),
    aiGateway: getAiGatewayConfig(),
    analytics: getSiteAnalytics(),
    inquiries: getContactInquiries(),
    users: getRegisteredUsers()
  };
  return JSON.stringify(data, null, 2);
}

export function importFullDatabase(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.projects) saveStoredProjects(data.projects);
    if (data.pricing) savePricingConfig(data.pricing);
    if (data.announcement) saveAnnouncementConfig(data.announcement);
    if (data.cms) saveSiteCmsConfig(data.cms);
    if (data.aiGateway) saveAiGatewayConfig(data.aiGateway);
    if (data.inquiries && typeof window !== 'undefined') localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(data.inquiries));
    if (data.users && typeof window !== 'undefined') localStorage.setItem(KEYS.USER_LIST, JSON.stringify(data.users));
    notifyStorageUpdate();
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function resetToFactoryDefaults() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.PROJECTS);
  localStorage.removeItem(KEYS.PRICING);
  localStorage.removeItem(KEYS.ANNOUNCEMENT);
  localStorage.removeItem(KEYS.CMS);
  localStorage.removeItem(KEYS.AI_GATEWAY);
  localStorage.removeItem(KEYS.INQUIRIES);
  localStorage.removeItem(KEYS.USER_LIST);
  localStorage.removeItem(KEYS.ANALYTICS);
  localStorage.removeItem(KEYS.ADMIN_PIN);
  notifyStorageUpdate();
}
