export interface AuthenticVideo {
  id: string;
  title: string;
  tamil_title?: string;
  src: string;
  poster: string;
  category: string;
  duration: string;
  description: string;
}

export const videosList: AuthenticVideo[] = [
  {
    id: 'v1',
    title: 'Aadhiran Silambam of Penang: The Untold Story',
    tamil_title: 'ஆதிரன் சிலம்பம் • சொல்லப்படாத வரலாறு',
    src: '/uploads/VID-20231026-WA0019.mp4',
    poster: '/uploads/silambam-back.jpg',
    category: 'Documentary',
    duration: 'Historical Feature',
    description:
      'Archival documentary capturing the historic journey of Aadhiran Silambam from Madurai to George Town in 1936 by 14th direct descendant Grandmaster Mariapakkiam, and its preservation under Chief Master Siva.',
  },
  {
    id: 'v2',
    title: 'Authentic Kurunji Stances & Twirling Manoeuvres',
    tamil_title: 'கம்பு வீச்சு மற்றும் கால்வரிசை நுட்பங்கள்',
    src: '/uploads/VID-20231026-WA0020.mp4',
    poster: '/uploads/portfolio-2.jpg',
    category: 'Technique',
    duration: 'Training Reel',
    description:
      'Demonstration of rapid wrist twirling methods (Kambu Veechu) synchronized with deceptive 18 footwork positions (Kaaladi Varisai) practiced without modern sporting modifications.',
  },
  {
    id: 'v3',
    title: 'Athletic Training & Traditional Combat Stances',
    tamil_title: 'பாரம்பரிய சிலம்ப தற்காப்பு பயிற்சி',
    src: '/uploads/athletica.mp4',
    poster: '/uploads/portfolio-1.jpg',
    category: 'Combat',
    duration: 'Full Demonstration',
    description:
      'Senior disciples performing traditional animal combat routines and high-velocity defensive stick parries at the George Town heritage center.',
  },
];
