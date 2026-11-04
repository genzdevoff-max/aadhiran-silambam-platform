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
    src: '/api/public/media/stream/silambam/a1983947-2a3d-4b64-bbee-5d71b43fa908.mp4',
    poster: '/api/public/media/stream/silambam/b417be8b-6b26-4914-848f-fdc546a2abd2.jpg',
    category: 'Documentary',
    duration: 'Historical Feature',
    description:
      'Archival documentary capturing the historic journey of Aadhiran Silambam from Madurai to George Town in 1936 by 14th direct descendant Grandmaster Mariapakkiam, and its preservation under Chief Master Siva.',
  },
  {
    id: 'v2',
    title: 'Authentic Kurunji Stances & Twirling Manoeuvres',
    tamil_title: 'கம்பு வீச்சு மற்றும் கால்வரிசை நுட்பங்கள்',
    src: '/api/public/media/stream/silambam/33c38e76-0cca-4f21-8890-5d5fa51befcc.mp4',
    poster: '/api/public/media/stream/silambam/8e1ad48b-144a-45c6-beb7-fc35c8558653.jpg',
    category: 'Technique',
    duration: 'Training Reel',
    description:
      'Demonstration of rapid wrist twirling methods (Kambu Veechu) synchronized with deceptive 18 footwork positions (Kaaladi Varisai) practiced without modern sporting modifications.',
  },
  {
    id: 'v3',
    title: 'Athletic Training & Traditional Combat Stances',
    tamil_title: 'பாரம்பரிய சிலம்ப தற்காப்பு பயிற்சி',
    src: '/api/public/media/stream/silambam/fb875dcc-a09a-4af3-9728-5a15bc9fb19b.mp4',
    poster: '/api/public/media/stream/silambam/a059447c-775a-4b7b-8b9f-29577190746a.jpg',
    category: 'Combat',
    duration: 'Full Demonstration',
    description:
      'Senior disciples performing traditional animal combat routines and high-velocity defensive stick parries at the George Town heritage center.',
  },
];
