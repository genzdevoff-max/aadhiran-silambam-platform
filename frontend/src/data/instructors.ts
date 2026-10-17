import type { Instructor } from '../types';

export const instructorsList: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Grandmaster Mariapakkiam',
    tamil_name: 'கிராண்ட்மாஸ்டர் மரியபாக்கியம்',
    title: '14th Descendant of Aadhiran & Founding Pioneer',
    role_type: 'grandmaster',
    biography:
      'The 14th direct descendant of the ancient Aadhiran lineage. Migrated from Madurai, Tamil Nadu to George Town, Penang in 1936 during the British Colonial era. He dedicated his life to preserving this 5,000-year-old martial discipline from total extinction, establishing the official association in Penang on 25th February 1975.',
    years_experience: 65,
    lineage_rank: '14th Lineage Descendant',
    photo_url: '/uploads/mariapaqiam4.png',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'inst-2',
    name: 'Master Siva',
    tamil_name: 'மாஸ்டர் சிவா',
    title: 'Chief Master & Heritage Custodian',
    role_type: 'head_master',
    biography:
      'Chief Master of Persatuan Aadhiran Silambam Pulau Pinang. Master Siva has spearheaded the documentation, international recognition with UNESCO, ICHCAP South Korea, and the Malaysia Book of Records. He remains deeply committed to safeguarding authentic Tamil martial arts without commercialized modifications.',
    years_experience: 42,
    lineage_rank: '15th Lineage Successor',
    photo_url: '/uploads/siva_orig.png',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'inst-3',
    name: 'Master R. Vijayan',
    tamil_name: 'மாஸ்டர் ஆர். விஜயன்',
    title: 'Senior Master — Weapons & Twirling Specialist',
    role_type: 'senior_instructor',
    biography:
      'Practitioner of Aadhiran Silambam for over three decades. Direct disciple of the traditional lineage, specializing in Kambu Veechu, Maan Kombu, and double-weapon tactical routines.',
    years_experience: 32,
    lineage_rank: 'Senior Master',
    photo_url: '/uploads/member1.png',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'inst-4',
    name: 'Master K. Arumugam',
    tamil_name: 'மாஸ்டர் கே. ஆறுமுகம்',
    title: 'Senior Master — Animal Formations & Tactical Stances',
    role_type: 'senior_instructor',
    biography:
      'Renowned expert in the animal movement patterns of Aadhiran Silambam, specifically Pulipaaivu (Tiger) and Simhapaaivu (Lion). Oversees advanced syllabus grading and heritage combat demos.',
    years_experience: 28,
    lineage_rank: 'Senior Master',
    photo_url: '/uploads/member2.png',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'inst-5',
    name: 'Instructor D. Kumaran',
    tamil_name: 'ஆசிரியர் டி. குமரன்',
    title: 'Youth Training & Community Outreach Instructor',
    role_type: 'instructor',
    biography:
      'Leads the youth training academy and UNESCO community demonstration troupe. Actively involved in George Town heritage education and beginner syllabus training.',
    years_experience: 16,
    lineage_rank: 'Lead Instructor',
    photo_url: '/uploads/member3.png',
    sort_order: 5,
    is_active: true,
  },
];
