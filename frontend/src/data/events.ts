import type { EventItem } from '../types';

export const eventsList: EventItem[] = [
  {
    id: 'ev-1',
    title: 'George Town World Heritage Day Silambam Showcase 2026',
    slug: 'george-town-heritage-day-2026',
    description:
      'Annual cultural presentation of 5,000-year Aadhiran Silambam in the UNESCO World Heritage Site of George Town, featuring live weapon demonstrations, Kaaladi footwork, and public interactive workshops.',
    event_type: 'Heritage Showcase',
    start_date: '2026-07-07T09:00:00Z',
    end_date: '2026-07-07T18:00:00Z',
    location: 'Armenian Street & Lebuh King, George Town, Penang',
    cover_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
    registration_url: '/join',
    is_featured: true,
    status: 'upcoming',
  },
  {
    id: 'ev-2',
    title: 'National Traditional Martial Arts Heritage Assembly 2026',
    slug: 'national-heritage-assembly-2026',
    description:
      'A major gathering of traditional martial arts masters from across Malaysia and Southeast Asia celebrating ancient uncorrupted lineages. Highlighting the 10-stage Aadhiran syllabus.',
    event_type: 'Championship & Assembly',
    start_date: '2026-11-21T10:00:00Z',
    end_date: '2026-11-22T19:00:00Z',
    location: 'Penang Youth and Sports Complex, Batu Uban, Penang',
    cover_image_url: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png',
    registration_url: '/join',
    is_featured: true,
    status: 'upcoming',
  },
  {
    id: 'ev-3',
    title: 'Grandmaster Mariapakkiam Memorial Guru Pooja 2027',
    slug: 'mariapakkiam-guru-pooja-2027',
    description:
      'Honoring the 14th descendant Grandmaster Mariapakkiam who brought the sacred Aadhiran lineage from Madurai to Penang in 1936. Annual traditional weapon consecration and student advancements.',
    event_type: 'Memorial Ceremony',
    start_date: '2027-02-25T08:30:00Z',
    end_date: '2027-02-25T14:00:00Z',
    location: 'Persatuan Aadhiran Silambam Headquarters, George Town, Penang',
    cover_image_url: '/uploads/mariapaqiam4.png',
    registration_url: '/join',
    is_featured: false,
    status: 'upcoming',
  },
];
