export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'editor';
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface SyllabusStage {
  id: string;
  stage_number: number;
  tamil_name: string;
  english_name: string;
  overview: string;
  key_techniques?: string;
  weapon_focus?: string;
  animal_movements?: string;
  sort_order?: number;
  is_published?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  tamil_name?: string;
  title: string;
  role_type: 'grandmaster' | 'head_master' | 'senior_instructor' | 'instructor';
  biography: string;
  years_experience: number;
  lineage_rank?: string;
  photo_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  year: number;
  date_awarded?: string;
  awarding_organization: string;
  description: string;
  cover_image_url?: string;
  supporting_images?: string[];
  evidence_url?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  sort_order?: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location: string;
  cover_image_url?: string;
  registration_url?: string;
  is_featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags?: string;
  cover_image_url?: string;
  author_name?: string;
  is_featured: boolean;
  published_at: string;
  status?: string;
}

export interface HeritageProject {
  id: string;
  title: string;
  slug: string;
  organization: string;
  year: number;
  overview: string;
  cultural_significance: string;
  full_content?: string;
  cover_image_url?: string;
  document_url?: string;
  is_featured: boolean;
}

export interface PartnerPress {
  id: string;
  title: string;
  entity_type: 'press' | 'partner';
  organization_name: string;
  publication_date?: string;
  quote_or_excerpt?: string;
  article_url?: string;
  logo_or_image_url?: string;
  is_featured: boolean;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  sort_order?: number;
  photo_count?: number;
  cover_photo?: string;
  is_published?: boolean;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  alt_text?: string;
  caption?: string;
  album_id?: string;
  album_title?: string;
  is_featured: boolean;
  created_at?: string;
  reference_count?: number;
}

export interface Enquiry {
  id: string;
  enquiry_type: 'general' | 'join_training';
  full_name: string;
  email: string;
  phone: string;
  age_group?: string;
  experience_level?: string;
  preferred_location?: string;
  message: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
  admin_notes?: string;
  created_at: string;
}

export interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  achievements: number;
  events: number;
  articles: number;
  mediaAssets: number;
  instructors: number;
}

export interface SiteSettingsData {
  siteTitle: string;
  siteName: string;
  tamilName?: string;
  tagline?: string;
  metaDescription?: string;
  metaKeywords?: string;
  foundedYear: number;
  registrationNumber: string;
  registrationBody: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    whatsapp?: string;
  };
  footerNotice?: string;
}

export interface HeroConfig {
  badge: string;
  title: string;
  tamilTitle: string;
  subtitle: string;
  bgImage: string;
  videoUrl: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  stats: Array<{ label: string; value: string }>;
}

export interface SectionVisibilityItem {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface QuickFact {
  id: string;
  badge: string;
  title: string;
  description: string;
  year: string;
  link: string;
}

