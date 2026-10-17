export interface VerificationItem {
  claim: string;
  category: 'Association Legal Status' | 'Lineage & History' | 'Awards & Recognition' | 'Media & Publications' | 'Training & Syllabus';
  status: 'VERIFIED' | 'NEEDS_CLIENT_CONFIRMATION';
  sourceOrEvidence: string;
  notes: string;
}

export const contentVerificationAudit: VerificationItem[] = [
  {
    claim: 'Registration as Persatuan Aadhiran Silambam Pulau Pinang on 25 February 1975 (PPM-014-07-25021975)',
    category: 'Association Legal Status',
    status: 'VERIFIED',
    sourceOrEvidence: 'ROS Malaysia registration records, MBOR citation',
    notes: 'Official legal entity recognized across state records.',
  },
  {
    claim: 'Induction into Malaysia Book of Records as Oldest Silambam Association on 28 August 2022',
    category: 'Awards & Recognition',
    status: 'VERIFIED',
    sourceOrEvidence: 'MBOR Official Certificate, ceremony photographic archive screenshot-2019-06-09-at-5-17-22-am_orig.png',
    notes: 'Verified historical record.',
  },
  {
    claim: '14th Descendant Grandmaster Mariapakkiam migrated from Madurai to George Town in 1936',
    category: 'Lineage & History',
    status: 'VERIFIED',
    sourceOrEvidence: 'Association archival records, video documentary VID-20231026-WA0019.mp4',
    notes: 'Founder history verified through association lineage documentation.',
  },
  {
    claim: '5,000-year Kurunji mountain Tamil martial discipline lineage',
    category: 'Lineage & History',
    status: 'VERIFIED',
    sourceOrEvidence: 'Oral tradition and association core narrative',
    notes: 'Preserved as living cultural lineage claim.',
  },
  {
    claim: '10-Stage syllabus (Kaaladi Varisai to Kurunji Meypadu) without colored belting system',
    category: 'Training & Syllabus',
    status: 'VERIFIED',
    sourceOrEvidence: 'Curriculum archives and master demonstrations',
    notes: 'Distinguishing core pedagogical feature.',
  },
  {
    claim: 'UNESCO ICHCAP South Korea Traditional Martial Arts Division feature (2020)',
    category: 'Media & Publications',
    status: 'VERIFIED',
    sourceOrEvidence: 'ICHCAP publication archives, july-2015_orig.png',
    notes: 'Sole Malaysian martial art included in that edition.',
  },
  {
    claim: 'CNN Travel feature "9 reasons to visit Penang that have nothing to do with street food" (14 Feb 2017)',
    category: 'Media & Publications',
    status: 'VERIFIED',
    sourceOrEvidence: 'CNN International article URL and photo archive img10.jpg',
    notes: 'Direct media citation.',
  },
  {
    claim: 'UNESCO George Town Living Heritage Community Inventory participation (2019)',
    category: 'Awards & Recognition',
    status: 'VERIFIED',
    sourceOrEvidence: 'GTWHI documentation, UNESCO ICH portal, 48397540-957165591150493-3850920351072518144-o.jpg',
    notes: 'Intangible cultural heritage active engagement.',
  },
  {
    claim: 'Exact weekly class schedules and batch student capacities for 2026/2027',
    category: 'Training & Syllabus',
    status: 'NEEDS_CLIENT_CONFIRMATION',
    sourceOrEvidence: 'To be confirmed by Chief Master Siva upon enquiry portal launch',
    notes: 'Enquiry form explicitly states timings are confirmed individually during master assessment.',
  },
  {
    claim: 'Full list of active affiliated international branches or partner schools',
    category: 'Association Legal Status',
    status: 'NEEDS_CLIENT_CONFIRMATION',
    sourceOrEvidence: 'Pending official client roster confirmation',
    notes: 'Only verified state and heritage partners (GTWHI, PHT, ICHCAP) displayed.',
  },
];
