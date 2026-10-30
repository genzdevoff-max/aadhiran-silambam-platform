export interface SiteGeneralInfo {
  siteTitle: string;
  siteName: string;
  tamilName: string;
  foundedYear: number;
  registrationNumber: string;
  registrationBody: string;
  email: string;
  phone: string;
  secondaryPhone: string;
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
}

export interface QuickFact {
  id: string;
  badge: string;
  title: string;
  description: string;
  year: string;
  link: string;
}

export interface MartialPillar {
  title: string;
  tamil: string;
  description: string;
  iconName: string;
}

export const generalInfo: SiteGeneralInfo = {
  siteTitle: 'Aadhiran Silambam Association | Traditional Tamil Martial Arts',
  siteName: 'Persatuan Aadhiran Silambam Pulau Pinang',
  tamilName: 'ஆதிரன் சிலம்ப சங்கம்',
  foundedYear: 1975,
  registrationNumber: 'PPM-014-07-25021975',
  registrationBody: 'Registry of Societies (ROS) Malaysia',
  email: 'info@aadhiran.com',
  phone: '+60 16-414 7856',
  secondaryPhone: '+60 4-261 8890',
  address: 'Lebuh King, George Town',
  city: 'George Town',
  state: 'Penang',
  postcode: '10200',
  country: 'Malaysia',
  socials: {
    facebook: 'https://www.facebook.com/share/1kJFSc672L/',
    instagram: 'https://www.instagram.com/aadhiransilambam',
    youtube: 'https://youtube.com/@aadhiransilambam',
    twitter: 'https://twitter.com/aadhiransilambam',
    whatsapp: 'https://wa.me/97433690769',
  },
};

export const heroContent = {
  badge: '5,000-Year Ancient Tamil Martial Discipline',
  title: 'AADHIRAN SILAMBAM',
  tamilTitle: 'ஆதிரன் சிலம்பம் • GEORGE TOWN, PENANG',
  subtitle:
    'The authentic Guru-Student martial heritage originating from the Kurunji Mountains of South India, safeguarded in George Town, Penang since 1936.',
  bgImage: '/uploads/silambam-back.jpg',
  videoUrl: '/uploads/VID-20231026-WA0019.mp4',
  stats: [
    { label: 'Lineage Heritage', value: '5,000 Yrs' },
    { label: 'Penang Custodianship', value: 'Since 1936' },
    { label: 'Syllabus Stages', value: '10 Stages' },
    { label: 'Malaysia Book of Records', value: 'Oldest Assoc' },
  ],
};

export const quickFacts: QuickFact[] = [
  {
    id: 'fact-1',
    badge: 'MALAYSIA BOOK OF RECORDS',
    title: 'Oldest Silambam Association',
    description:
      'Persatuan Aadhiran Silambam Pulau Pinang was established on 25th February 1975 and officially recognized by the Malaysia Book of Records as the Oldest Silambam Association in Malaysia on 28th August 2022.',
    year: '2022',
    link: '/achievements',
  },
  {
    id: 'fact-2',
    badge: 'ICHCAP GLOBAL PUBLICATION',
    title: 'UNESCO ICHCAP South Korea Feature',
    description:
      'Aadhiran Silambam of Penang is the only martial art in Malaysia selected and published in the UNESCO ICHCAP global publication from South Korea under the Traditional Martial Arts division in 2020.',
    year: '2020',
    link: '/heritage',
  },
  {
    id: 'fact-3',
    badge: 'CNN TRAVEL SPOTLIGHT',
    title: 'CNN International Recognition',
    description:
      'Featured by CNN Travel in the global documentary article "9 reasons to visit Penang that have nothing to do with street food" on 14th February 2017, representing Penang\'s authentic living heritage.',
    year: '2017',
    link: '/partners',
  },
  {
    id: 'fact-4',
    badge: 'UNESCO LIVING HERITAGE',
    title: 'UNESCO Community Inventorying',
    description:
      'The sole martial art in Malaysia that actively engaged in George Town\'s urban communities living heritage inventory with UNESCO support in 2019, showcased on the official UNESCO Intangible Cultural Heritage platform.',
    year: '2019',
    link: '/heritage',
  },
];

export const martialPillars: MartialPillar[] = [
  {
    title: 'Gurukulam Lineage',
    tamil: 'குருகுல பாரம்பரியம்',
    description:
      'Unbroken direct master-to-disciple transmission tracing back 5,000 years to the ancient Kurunji mountains, safeguarding the art against modern dilution.',
    iconName: 'Shield',
  },
  {
    title: 'Pure Traditional Stages',
    tamil: 'பத்து பாரம்பரிய நிலைகள்',
    description:
      'Rejecting modern commercialized colored belts in favor of ten rigorous stages (Nilai) cultivating real martial prowess, mental focus, and spiritual fortitude.',
    iconName: 'Layers',
  },
  {
    title: 'Animated Animal Maneuvers',
    tamil: 'உயிர்ம மெய்ப்பாடு',
    description:
      'Mastery of dynamic animal combat patterns—Tiger (Pulipaaivu), Lion (Simham), and Elephant (Yaanai)—blended with deceptive footwork vectors.',
    iconName: 'Flame',
  },
  {
    title: 'Intangible Living Heritage',
    tamil: 'வாழும் கலாச்சார பாரம்பரியம்',
    description:
      'Recognized by UNESCO, ICHCAP South Korea, and the Malaysia Book of Records as an indispensable living treasure of George Town, Penang.',
    iconName: 'Award',
  },
];
