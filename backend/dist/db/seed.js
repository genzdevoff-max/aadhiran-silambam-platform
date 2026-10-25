"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const runSeed = async () => {
    const client = await db_1.pool.connect();
    try {
        console.log('--- Seeding Aadhiran Silambam Database with Authentic Content ---');
        const dbResult = await client.query('SELECT DATABASE() AS db');
        const activeDatabase = dbResult.rows[0]?.db ?? null;
        if (activeDatabase !== 'aadhiran') {
            throw new Error(`Refusing to seed: active database is "${activeDatabase ?? 'none'}", expected "aadhiran".`);
        }
        const existingResult = await client.query(`SELECT
         (SELECT COUNT(*) FROM instructors) +
         (SELECT COUNT(*) FROM achievements) +
         (SELECT COUNT(*) FROM albums) +
         (SELECT COUNT(*) FROM media_assets) +
         (SELECT COUNT(*) FROM events) +
         (SELECT COUNT(*) FROM news_articles) +
         (SELECT COUNT(*) FROM heritage_projects) +
         (SELECT COUNT(*) FROM partners_press) AS count`);
        if (Number(existingResult.rows[0]?.count ?? 0) > 0 && process.env.SEED_ALLOW_DESTRUCTIVE !== 'true') {
            throw new Error('Refusing to seed because existing content was found. Set SEED_ALLOW_DESTRUCTIVE=true only when you intend to replace it.');
        }
        await client.query('BEGIN');
        // 1. Admin User
        const adminPasswordHash = await bcryptjs_1.default.hash('Admin@Aadhiran2026', 10);
        await client.query(`
      INSERT INTO users (email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON DUPLICATE KEY UPDATE
      password_hash = VALUES(password_hash), full_name = VALUES(full_name);
    `, ['admin@aadhiran.com', adminPasswordHash, 'Aadhiran Administrator', 'super_admin', true]);
        const userRes = await client.query('SELECT id FROM users WHERE email = $1', ['admin@aadhiran.com']);
        const adminId = userRes.rows[0].id;
        // 2. Site Settings
        const settings = [
            {
                key: 'general',
                value: {
                    siteTitle: 'Aadhiran Silambam Association | Traditional Tamil Martial Arts',
                    siteName: 'Persatuan Aadhiran Silambam Pulau Pinang',
                    foundedYear: 1975,
                    registrationNumber: 'PPM-014-07-25021975',
                    email: 'info@aadhiran.com',
                    phone: '+60 16-414 7856',
                    secondaryPhone: '+60 4-261 8890',
                    address: 'Lebuh King, George Town, 10200 Penang, Malaysia',
                    instagram: 'https://instagram.com/aadhiransilambam',
                    facebook: 'https://facebook.com/aadhiransilambam',
                    youtube: 'https://youtube.com/@aadhiransilambam',
                    twitter: 'https://twitter.com/aadhiransilambam'
                }
            },
            {
                key: 'hero',
                value: {
                    badge: '5,000-YEAR ANCIENT TAMIL MARTIAL DISCIPLINE',
                    title: 'AADHIRAN SILAMBAM',
                    tamilTitle: 'ஆதிரன் சிலம்பம்',
                    subtitle: 'The authentic Guru-Student martial heritage originating from the Kurunji Mountains of South India, preserved in George Town, Penang since 1936.',
                    videoUrl: '/uploads/VID-20231026-WA0019.mp4',
                    bgImage: '/uploads/silambam-back.jpg',
                    stats: [
                        { label: 'Lineage Heritage', value: '5,000 Yrs' },
                        { label: 'Penang Custodianship', value: 'Since 1936' },
                        { label: 'Syllabus Stages', value: '10 Stages' },
                        { label: 'Malaysia Book of Record', value: 'Oldest Assoc' }
                    ]
                }
            },
            {
                key: 'quick_facts',
                value: [
                    {
                        id: 'fact-1',
                        badge: 'MALAYSIA BOOK OF RECORDS',
                        title: 'Oldest Silambam Association',
                        description: 'Persatuan Aadhiran Silambam Pulau Pinang was established on 25th February 1975 and officially recognized by the Malaysia Book of Records as the Oldest Silambam Association in Malaysia on 28th August 2022.',
                        year: '2022',
                        link: '/achievements'
                    },
                    {
                        id: 'fact-2',
                        badge: 'ICHCAP GLOBAL PUBLICATION',
                        title: 'UNESCO ICHCAP South Korea Feature',
                        description: 'Aadhiran Silambam of Penang is the only martial art in Malaysia selected and published in the UNESCO ICHCAP global publication from South Korea under the Traditional Martial Arts division in 2020.',
                        year: '2020',
                        link: '/heritage-works'
                    },
                    {
                        id: 'fact-3',
                        badge: 'CNN TRAVEL SPOTLIGHT',
                        title: 'CNN International Recognition',
                        description: 'Featured by CNN Travel in the global documentary article "9 reasons to visit Penang that have nothing to do with street food" on 14th February 2017, representing Penang\'s authentic living heritage.',
                        year: '2017',
                        link: '/partners-press'
                    },
                    {
                        id: 'fact-4',
                        badge: 'UNESCO LIVING HERITAGE',
                        title: 'UNESCO Community Inventorying',
                        description: 'The sole martial art in Malaysia that actively engaged in George Town\'s urban communities living heritage inventory with UNESCO support in 2019, showcased on the official UNESCO Intangible Cultural Heritage platform.',
                        year: '2019',
                        link: '/heritage-works'
                    }
                ]
            },
            {
                key: 'navigation',
                value: {
                    mainMenu: [
                        { name: 'Home', path: '/' },
                        {
                            name: 'About',
                            children: [
                                { name: 'About Aadhiran', path: '/about' },
                                { name: 'History & Lineage', path: '/history-lineage' },
                                { name: 'Instructors & Masters', path: '/instructors' }
                            ]
                        },
                        { name: 'Syllabus', path: '/training-syllabus' },
                        { name: 'Achievements', path: '/achievements' },
                        { name: 'Events', path: '/events' },
                        {
                            name: 'Media',
                            children: [
                                { name: 'Photo Gallery', path: '/gallery' },
                                { name: 'Videos & Demos', path: '/videos' }
                            ]
                        },
                        { name: 'Heritage Works', path: '/heritage-works' },
                        { name: 'Partners & Press', path: '/partners-press' },
                        { name: 'News', path: '/news' },
                        { name: 'Contact', path: '/contact' }
                    ],
                    cta: { name: 'Join Training', path: '/join' }
                }
            }
        ];
        for (const setting of settings) {
            await client.query(`
        INSERT INTO site_settings (\`key\`, \`value\`, updated_at)
        VALUES ($1, $2, NOW())
        ON DUPLICATE KEY UPDATE
        value = VALUES(value), updated_at = NOW();
      `, [setting.key, JSON.stringify(setting.value)]);
        }
        // 3. Syllabus Stages (10 Traditional Stages)
        const stages = [
            {
                stage_number: 1,
                tamil_name: 'காலடி வரிசை (Kaaladi Varisai)',
                english_name: 'Fundamental Footwork Patterns',
                overview: 'The foundation of all Silambam discipline. Focuses on eighteen traditional foot positions, balancing center of gravity, triangular shifts, and low earth-grounded stances.',
                key_techniques: 'Thatti Kaaladi, Vattu Kaaladi, Square and Triangular stepping, Weight transitions',
                weapon_focus: 'Barefoot balance, Bamboo practice staff measurement and posture',
                animal_movements: 'Initial earth-grounding mimicking the stability of the Kurunji mountain terrain',
                sort_order: 1
            },
            {
                stage_number: 2,
                tamil_name: 'கம்பு வீச்சு (Kambu Veechu)',
                english_name: 'Staff Twirling & Momentum Control',
                overview: 'Mastery over the bamboo staff through rotational momentum. Single-hand and two-handed wrist rotations, figure-eight loops, and high-velocity continuous spins that build muscle memory.',
                key_techniques: 'Erattai Veechu (Double twirl), Ottai Veechu (Single-hand twirl), Mel Veechu (Overhead spin)',
                weapon_focus: 'Traditional curved-grain seasoned bamboo staff (Prambu)',
                animal_movements: 'Continuous winding flow mimicking serpents in motion',
                sort_order: 2
            },
            {
                stage_number: 3,
                tamil_name: 'போர் காலடி (Por Kaaladi)',
                english_name: 'Combative Footwork & Tactical Angles',
                overview: 'Transition from solitary pattern work to combat evasion. Teaching deceptive lateral jumps, sudden pivot turns, and angle cutting to bypass opposing defense.',
                key_techniques: 'Surukku Kaaladi, Veetu Kaaladi, 45-degree angle interception',
                weapon_focus: 'Combat staff paired with dynamic diagonal stance shifts',
                animal_movements: 'Agile monkey pivots and evasive shifts',
                sort_order: 3
            },
            {
                stage_number: 4,
                tamil_name: 'பிரிவு தடுப்பு (Pirivu Thaduppu)',
                english_name: 'Defensive Interceptions & Weapon Leverage',
                overview: 'Neutralizing aggressive strikes using precision leverage rather than brute force. Counter-twirling into joint disarms, deflective slides, and rapid counter-thrusts.',
                key_techniques: 'Mel Thaduppu, Kezh Thaduppu, Pakka Thaduppu, Leverage sliding traps',
                weapon_focus: 'Defensive bamboo staff parries and instant point strikes',
                animal_movements: 'Snake neck deflection and sudden coil counter',
                sort_order: 4
            },
            {
                stage_number: 5,
                tamil_name: 'மான் கொம்பு (Maan Kombu / Maduvu)',
                english_name: 'Deer Horn Combat & Close Quarter Defense',
                overview: 'Ancient double-ended deer antler weapon training. Fast, tight rotational shielding and fatal throat/solar plexus targeting designed for tightly packed encounters.',
                key_techniques: 'Dual horn rotation, Cross-locking incoming weapons, Internal strike thrusts',
                weapon_focus: 'Maan Kombu (Deer horn short weapon tipped with steel studs)',
                animal_movements: 'Fighting stag head maneuvers and defensive horn sweeps',
                sort_order: 5
            },
            {
                stage_number: 6,
                tamil_name: 'சுருள் வாள் (Surul Vaal)',
                english_name: 'The Flexible Ribbon Whip Sword',
                overview: 'One of the most dangerous martial weapons in world history. Up to four flexible spring-steel blades wielded in continuous rotational vortexes requiring absolute concentration.',
                key_techniques: 'Circular boundary shielding, Decapitating sweep arcs, Retraction coils',
                weapon_focus: 'Surul Vaal (Multi-blade flexible steel whip sword)',
                animal_movements: 'Coiling viper spirals and whirlwind vortex flow',
                sort_order: 6
            },
            {
                stage_number: 7,
                tamil_name: 'வேல் கம்பு (Vel Kambu)',
                english_name: 'Spear Combat & Long-Range Neutralization',
                overview: 'The sacred weapon of Lord Murugan and ancient Kurunji warriors. Precision long-distance thrusts, circular shaft deflections, and hooking disarms.',
                key_techniques: 'Kuthu Varisai (Piercing vectors), Hook pulls, Defensive spear butt counter-strikes',
                weapon_focus: 'Vel (Leaf-shaped bronze/steel spear mounted on hardwood shaft)',
                animal_movements: 'Falcon dive thrusts and predatory eagle swoops',
                sort_order: 7
            },
            {
                stage_number: 8,
                tamil_name: 'புலிப்பாய்வு (Pulipaaivu)',
                english_name: 'Tiger Stances & Explosive Pounces',
                overview: 'Animated traditional animal movements embodying the ferocious tenacity of the Royal Bengal tiger. Low-crouch ambushes, rapid forward springs, and crushing claw strikes.',
                key_techniques: 'Pulipaaivu leap, Clamour claw disarms, Low hamstring sweep tackles',
                weapon_focus: 'Bare-handed claw strikes and short staff leverage',
                animal_movements: 'Authentic Tiger (Puli) predatory stalk and sudden leap',
                sort_order: 8
            },
            {
                stage_number: 9,
                tamil_name: 'சிங்கப்பாய்வு & யானைப்பாய்வு (Simham & Yaanai)',
                english_name: 'Lion & Elephant Formations',
                overview: 'Combining the commanding dominance of the Lion (Simham) with the unstoppable rooted inertia of the Elephant (Yaanai). Unshakable rooted defense and pulverizing momentum.',
                key_techniques: 'Gaja Kaaladi (Elephant rooted stance), Simha Kural (Focus breath shout), Heavy counter-charges',
                weapon_focus: 'Heavy hardwood staff and dual club maces (Kurunthadi)',
                animal_movements: 'Royal Lion pounce and Mountain Elephant rooted charge',
                sort_order: 9
            },
            {
                stage_number: 10,
                tamil_name: 'குறிஞ்சி மெய்ப்பாடு (Kurunji Meypadu)',
                english_name: 'Master Heritage Synthesis & battlefield Ethics',
                overview: 'The pinnacle of Aadhiran Silambam. Blending all nine prior stages into instinctual fighting reflexes, tricky attacking manoeuvres, spiritual fortitude, and battlefield preservation.',
                key_techniques: 'Seamless fusion of 18 footworks, tricky attacking deception, disarming without lethality',
                weapon_focus: 'All traditional weapons (Staff, Horn, Spear, Sword, Shield, Bare-hand Varma points)',
                animal_movements: 'Synthesis of all living nature movements as preserved through 5,000 years of lineage',
                sort_order: 10
            }
        ];
        for (const stage of stages) {
            await client.query(`
        INSERT INTO syllabus_stages (
          stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order, is_published
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
        ON DUPLICATE KEY UPDATE
        tamil_name = VALUES(tamil_name), english_name = VALUES(english_name),
        overview = VALUES(overview), key_techniques = VALUES(key_techniques),
        weapon_focus = VALUES(weapon_focus), animal_movements = VALUES(animal_movements);
      `, [
                stage.stage_number, stage.tamil_name, stage.english_name, stage.overview,
                stage.key_techniques, stage.weapon_focus, stage.animal_movements, stage.sort_order
            ]);
        }
        // 4. Instructors & Masters
        const instructors = [
            {
                name: 'Grandmaster Mariapakkiam',
                tamil_name: 'கிராண்ட்மாஸ்டர் மரியபாக்கியம்',
                title: '14th Descendant of Aadhiran & Founding Pioneer',
                role_type: 'grandmaster',
                biography: 'The 14th direct descendant of the ancient Aadhiran lineage. Migrated from Madurai, Tamil Nadu to George Town, Penang in 1936 during the British Colonial era. He dedicated his life to preserving this 5,000-year-old martial discipline from total extinction, establishing the official association in Penang on 25th February 1975.',
                years_experience: 65,
                lineage_rank: '14th Lineage Descendant',
                photo_url: '/uploads/mariapaqiam4.png',
                sort_order: 1
            },
            {
                name: 'Master Siva',
                tamil_name: 'மாஸ்டர் சிவா',
                title: 'Chief Master & Heritage Custodian',
                role_type: 'head_master',
                biography: 'Chief Master of Persatuan Aadhiran Silambam Pulau Pinang. Master Siva has spearheaded the documentation, international recognition with UNESCO, ICHCAP South Korea, and the Malaysia Book of Records. He remains deeply committed to safeguarding authentic Tamil martial arts without commercialized modifications.',
                years_experience: 42,
                lineage_rank: '15th Lineage Successor',
                photo_url: '/uploads/siva_orig.png',
                sort_order: 2
            },
            {
                name: 'Master R. Vijayan',
                tamil_name: 'மாஸ்டர் ஆர். விஜயன்',
                title: 'Senior Master — Weapons & Twirling Specialist',
                role_type: 'senior_instructor',
                biography: 'Practitioner of Aadhiran Silambam for over three decades. Direct disciple of the traditional lineage, specializing in Kambu Veechu, Maan Kombu, and double-weapon tactical routines.',
                years_experience: 32,
                lineage_rank: 'Senior Master',
                photo_url: '/uploads/member1.png',
                sort_order: 3
            },
            {
                name: 'Master K. Arumugam',
                tamil_name: 'மாஸ்டர் கே. ஆறுமுகம்',
                title: 'Senior Master — Animal Formations & Tactical Stances',
                role_type: 'senior_instructor',
                biography: 'Renowned expert in the animal movement patterns of Aadhiran Silambam, specifically Pulipaaivu (Tiger) and Simhapaaivu (Lion). Oversees advanced syllabus grading and heritage combat demos.',
                years_experience: 28,
                lineage_rank: 'Senior Master',
                photo_url: '/uploads/member2.png',
                sort_order: 4
            },
            {
                name: 'Instructor D. Kumaran',
                tamil_name: 'ஆசிரியர் டி. குமரன்',
                title: 'Youth Training & Community Outreach Instructor',
                role_type: 'instructor',
                biography: 'Leads the youth training academy and UNESCO community demonstration troupe. Actively involved in George Town heritage education and beginner syllabus training.',
                years_experience: 16,
                lineage_rank: 'Lead Instructor',
                photo_url: '/uploads/member3.png',
                sort_order: 5
            }
        ];
        await client.query(`DELETE FROM instructors WHERE 1=1;`);
        for (const inst of instructors) {
            await client.query(`
        INSERT INTO instructors (
          name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true);
      `, [
                inst.name, inst.tamil_name, inst.title, inst.role_type, inst.biography,
                inst.years_experience, inst.lineage_rank, inst.photo_url, inst.sort_order
            ]);
        }
        // 5. Achievements
        const achievements = [
            {
                title: 'Oldest Silambam Association in Malaysia',
                category: 'National Record',
                year: 2022,
                date_awarded: '2022-08-28',
                awarding_organization: 'The Malaysia Book of Records',
                description: 'Persatuan Aadhiran Silambam Pulau Pinang, having been officially registered on 25th February 1975 and holding unbroken lineage practice since 1936, was formally verified and inducted into the Malaysia Book of Records as the oldest recognized Silambam association in the nation.',
                cover_image_url: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png',
                evidence_url: 'https://www.malaysiarecords.com.my',
                is_featured: true,
                status: 'published',
                sort_order: 1
            },
            {
                title: 'UNESCO ICHCAP Global Martial Arts Publication',
                category: 'International Recognition',
                year: 2020,
                date_awarded: '2020-11-15',
                awarding_organization: 'ICHCAP (International Information and Networking Centre for Intangible Cultural Heritage in the Asia-Pacific Region under the auspices of UNESCO, South Korea)',
                description: 'Aadhiran Silambam was the sole martial art from Malaysia selected and published in the prestigious ICHCAP global publication dedicated to safeguarding traditional martial arts disciplines across the Asia-Pacific region.',
                cover_image_url: '/uploads/july-2015_orig.png',
                evidence_url: 'https://www.unesco-ichcap.org',
                is_featured: true,
                status: 'published',
                sort_order: 2
            },
            {
                title: 'UNESCO Living Heritage Community Inventory Engagement',
                category: 'Cultural Heritage',
                year: 2019,
                date_awarded: '2019-07-07',
                awarding_organization: 'UNESCO & George Town World Heritage Incorporated',
                description: 'Selected as the primary traditional martial art representation in George Town\'s urban community inventorying project supported by UNESCO. Featured on the global UNESCO Intangible Cultural Heritage platform for preserving living cultural expressions.',
                cover_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
                evidence_url: 'https://ich.unesco.org',
                is_featured: true,
                status: 'published',
                sort_order: 3
            },
            {
                title: 'CNN Travel International Feature Recognition',
                category: 'Global Media',
                year: 2017,
                date_awarded: '2017-02-14',
                awarding_organization: 'CNN Travel (Warner Bros. Discovery)',
                description: 'Highlighted by CNN Travel in their global documentary article titled "9 reasons to visit Penang that have nothing to do with street food". Aadhiran Silambam was spotlighted as the premiere traditional martial discipline showcasing Penang\'s living cultural heritage.',
                cover_image_url: '/uploads/img10.jpg',
                evidence_url: 'https://edition.cnn.com/travel/article/penang-not-about-street-food/index.html',
                is_featured: true,
                status: 'published',
                sort_order: 4
            },
            {
                title: 'Penang Living Heritage Treasure Custodian Citation',
                category: 'State Heritage',
                year: 2018,
                date_awarded: '2018-09-12',
                awarding_organization: 'Penang Heritage Trust & State Government of Penang',
                description: 'Special recognition honoring the unbroken transmission of authentic Kurunji mountain stick twirling and animal movements in George Town without commercialization.',
                cover_image_url: '/uploads/portfolio-2-1.jpg',
                evidence_url: 'https://pht.org.my',
                is_featured: false,
                status: 'published',
                sort_order: 5
            }
        ];
        await client.query(`DELETE FROM achievements WHERE 1=1;`);
        for (const ach of achievements) {
            await client.query(`
        INSERT INTO achievements (
          title, category, year, date_awarded, awarding_organization, description, cover_image_url, evidence_url, is_featured, status, sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
                ach.title, ach.category, ach.year, ach.date_awarded, ach.awarding_organization,
                ach.description, ach.cover_image_url, ach.evidence_url, ach.is_featured,
                ach.status, ach.sort_order
            ]);
        }
        // 6. Albums & Media Assets
        await client.query(`DELETE FROM albums WHERE 1=1;`);
        const albums = [
            { title: 'Archival & Historic Lineage (1970s–1990s)', slug: 'archival-lineage', category: 'history', sort_order: 1 },
            { title: 'UNESCO Living Heritage & Demonstrations', slug: 'unesco-heritage', category: 'heritage', sort_order: 2 },
            { title: 'Traditional Weapon Twirling & Combat Practice', slug: 'weapons-training', category: 'training', sort_order: 3 },
            { title: 'Festivals & Cultural Showcases in George Town', slug: 'cultural-showcases', category: 'events', sort_order: 4 }
        ];
        const albumMap = {};
        for (const a of albums) {
            await client.query(`
        INSERT INTO albums (title, slug, description, category, sort_order, is_published)
        VALUES ($1, $2, $3, $4, $5, true)
      `, [a.title, a.slug, `Photographic collection of ${a.title}`, a.category, a.sort_order]);
            const albumRes = await client.query('SELECT id FROM albums WHERE slug = $1', [a.slug]);
            albumMap[a.slug] = albumRes.rows[0].id;
        }
        // Seed Media Assets from authentic files
        const mediaList = [
            { file: 'mariapaqiam4.png', name: 'Grandmaster Mariapakkiam 14th Descendant', alt: 'Grandmaster Mariapakkiam in traditional posture', album: 'archival-lineage', feat: true },
            { file: 'siva_orig.png', name: 'Master Siva Chief Instructor', alt: 'Master Siva holding traditional Silambam staff', album: 'archival-lineage', feat: true },
            { file: 'silambam-back.jpg', name: 'Silambam Warrior Dynamic Spin', alt: 'Silambam practitioner executing high-velocity twirl', album: 'weapons-training', feat: true },
            { file: 'screenshot-2019-06-09-at-5-17-22-am_orig.png', name: 'Malaysia Book of Records Presentation', alt: 'Malaysia Book of Records certificate ceremony', album: 'unesco-heritage', feat: true },
            { file: 'july-2015_orig.png', name: 'Historic Association Gathering', alt: 'Aadhiran practitioners gathered at Penang hall', album: 'archival-lineage', feat: true },
            { file: '48397540-957165591150493-3850920351072518144-o.jpg', name: 'UNESCO Community Showcase', alt: 'UNESCO George Town Living Heritage demonstration', album: 'unesco-heritage', feat: true },
            { file: '1129754474.jpg', name: 'Senior Master Demonstration', alt: 'Senior Master performing Por Kaaladi', album: 'weapons-training', feat: true },
            { file: '1094154479.jpg', name: 'Traditional Weaponry Array', alt: 'Traditional bamboo staffs, horns, and shields', album: 'weapons-training', feat: false },
            { file: 'img1.jpg', name: 'Staff Twirling Stance Practice', alt: 'Students learning Kambu Veechu stances', album: 'weapons-training', feat: false },
            { file: 'img2.jpg', name: 'Footwork Synchronization', alt: 'Kaaladi Varisai synchronous group practice', album: 'weapons-training', feat: false },
            { file: 'img3.jpg', name: 'Heritage Street Demonstration', alt: 'Silambam performance on George Town heritage streets', album: 'cultural-showcases', feat: false },
            { file: 'img4.jpg', name: 'Youth Trainee Mastery', alt: 'Young practitioner demonstrating staff balance', album: 'weapons-training', feat: false },
            { file: 'img5.jpg', name: 'Two-Handed Rotational Strike', alt: 'Two-handed rotational strike in combat posture', album: 'weapons-training', feat: false },
            { file: 'img6.jpg', name: 'Traditional Lineage Ceremony', alt: 'Annual lineage blessing and guru tribute', album: 'cultural-showcases', feat: false },
            { file: 'img10.jpg', name: 'CNN Featured Demonstration', alt: 'Aadhiran fighters demonstrating for CNN Travel team', album: 'unesco-heritage', feat: false },
            { file: 'l1.jpg', name: 'High-Velocity Curved Spin', alt: 'High velocity circular staff spin', album: 'weapons-training', feat: false },
            { file: 'l2.jpg', name: 'Animal Stance Combat Drill', alt: 'Pulipaaivu low tiger crouch drill', album: 'weapons-training', feat: false },
            { file: 'l3.jpg', name: 'Duo Combat Exchange', alt: 'Two senior exponents exchanging staff strikes', album: 'cultural-showcases', feat: false },
            { file: 'l4.jpg', name: 'Master-Student Transmission', alt: 'Master correcting the student wrist posture', album: 'weapons-training', feat: false }
        ];
        await client.query(`DELETE FROM media_assets WHERE 1=1;`);
        for (const m of mediaList) {
            await client.query(`
        INSERT INTO media_assets (
          file_name, original_name, file_path, mime_type, file_size, alt_text, caption, album_id, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [
                m.file, m.name, `/uploads/${m.file}`, 'image/jpeg', 150000, m.alt, m.name, albumMap[m.album] || null, m.feat
            ]);
        }
        // 7. Events
        const events = [
            {
                title: 'George Town World Heritage Day Silambam Showcase 2026',
                slug: 'george-town-heritage-day-2026',
                description: 'Annual cultural presentation of 5,000-year Aadhiran Silambam in the UNESCO World Heritage Site of George Town, featuring live weapon demonstrations, Kaaladi footwork, and public interactive workshops.',
                event_type: 'heritage_showcase',
                start_date: '2026-07-07T09:00:00Z',
                end_date: '2026-07-07T18:00:00Z',
                location: 'Armenian Street & Lebuh King, George Town, Penang',
                cover_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
                registration_url: '/join',
                is_featured: true,
                status: 'upcoming'
            },
            {
                title: 'National Traditional Martial Arts Heritage Assembly 2026',
                slug: 'national-heritage-assembly-2026',
                description: 'A major gathering of traditional martial arts masters from across Malaysia and Southeast Asia celebrating ancient uncorrupted lineages. Highlighting the 10-stage Aadhiran syllabus.',
                event_type: 'championship',
                start_date: '2026-11-21T10:00:00Z',
                end_date: '2026-11-22T19:00:00Z',
                location: 'Penang Youth and Sports Complex, Batu Uban, Penang',
                cover_image_url: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png',
                registration_url: '/join',
                is_featured: true,
                status: 'upcoming'
            },
            {
                title: 'Grandmaster Mariapakkiam Memorial Guru Pooja 2027',
                slug: 'mariapakkiam-guru-pooja-2027',
                description: 'Honoring the 14th descendant Grandmaster Mariapakkiam who brought the sacred Aadhiran lineage from Madurai to Penang in 1936. Annual traditional weapon consecration and student advancements.',
                event_type: 'memorial_ceremony',
                start_date: '2027-02-25T08:30:00Z',
                end_date: '2027-02-25T14:00:00Z',
                location: 'Persatuan Aadhiran Silambam Headquarters, George Town, Penang',
                cover_image_url: '/uploads/mariapaqiam4.png',
                registration_url: '/join',
                is_featured: false,
                status: 'upcoming'
            }
        ];
        await client.query(`DELETE FROM events WHERE 1=1;`);
        for (const ev of events) {
            await client.query(`
        INSERT INTO events (
          title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
                ev.title, ev.slug, ev.description, ev.event_type, ev.start_date, ev.end_date,
                ev.location, ev.cover_image_url, ev.registration_url, ev.is_featured, ev.status
            ]);
        }
        // 8. News & Blog Articles
        const articles = [
            {
                title: 'The Living Legacy of Aadhiran: 5,000 Years from the Kurunji Mountains to Penang',
                slug: 'living-legacy-5000-years-kurunji-to-penang',
                summary: 'How an ancient martial tradition originating five millennia ago survived extinction in its motherland and flourished as an intangible cultural heritage treasure in George Town.',
                content: `
# The Living Legacy of Aadhiran Silambam

Silambam is recognized globally as one of the oldest systematic martial arts systems known to humanity, originating from the Kurunji mountain ranges of South India over five thousand years ago. While many regional systems modernized into combat sport or faded into history, **Aadhiran Silambam** remains the singular ancient discipline that safeguards the uncorrupted 10-stage Guru-Student lineage.

## The Historic Migration of 1936
In 1936, during the British Colonial era, the 14th direct descendant of the Aadhiran lineage, **Grandmaster Mariapakkiam**, migrated from Madurai, Tamil Nadu to George Town, Penang. Carrying with him nothing but the sacred oral tradition, footwork manuscripts, and the seasoned bamboo staff techniques handed down through generations, he planted the seeds of this martial heritage on Malaysian soil.

## Establishing the Association in 1975
On 25th February 1975, the association was officially registered as **Persatuan Aadhiran Silambam Pulau Pinang**. For half a century, the masters and practitioners have steadfastly rejected modern sport commercialization in favor of the authentic ten-stage syllabus that develops the complete warrior: mind, body, and heritage.

Today, Aadhiran Silambam stands recognized by the **Malaysia Book of Records (2022)** as the oldest Silambam association in Malaysia, and by **UNESCO ICHCAP (2020)** as a premier intangible cultural heritage asset.
        `,
                category: 'History',
                tags: 'History, Lineage, UNESCO, Penang',
                cover_image_url: '/uploads/silambam-back.jpg',
                is_featured: true,
                status: 'published'
            },
            {
                title: 'Why Traditional Silambam Rejects Modern Belts for Authentic Stages',
                slug: 'traditional-silambam-vs-modern-belting-systems',
                summary: 'Aadhiran Silambam preserves ancient Tamil custom based syllabuses divided into ten stages rather than modern colored belts, prioritizing true mastery over commercial grading.',
                content: `
# Traditional Stages vs Modern Belting Systems

In contemporary martial arts, the colored belt system is ubiquitous. However, within the authentic 5,000-year tradition of **Aadhiran Silambam**, commercial belt progressions have never existed. 

## The Ten Traditional Stages
Instead of rapid color advancements, Aadhiran practitioners progress through **ten comprehensive stages** (Nilai), beginning with the grounding of **Kaaladi Varisai** (footwork patterns), advancing through staff twirling (**Kambu Veechu**), defensive leverage (**Pirivu Thaduppu**), traditional weapons (**Maan Kombu, Surul Vaal, Vel Kambu**), animal maneuvers (**Pulipaaivu, Simham, Yaanai**), culminating in **Kurunji Meypadu**.

Each stage demands physical conditioning, spiritual balance, and flawless execution under direct Master supervision.
        `,
                category: 'Philosophy',
                tags: 'Syllabus, Philosophy, Training, Tamil Culture',
                cover_image_url: '/uploads/1129754474.jpg',
                is_featured: true,
                status: 'published'
            },
            {
                title: 'Safeguarding Penang\'s Living Intangible Heritage with UNESCO',
                slug: 'safeguarding-penang-living-heritage-unesco',
                summary: 'A look back at our community inventorying initiative in George Town with the support of UNESCO and George Town World Heritage Incorporated.',
                content: `
# Safeguarding Penang's Living Intangible Heritage

In 2019, Aadhiran Silambam was invited to take center stage in the George Town urban communities living heritage inventory project supported by UNESCO. 

Unlike static museum artifacts, traditional martial arts are living cultural expressions that exist only as long as living practitioners twirl the bamboo staff and transmit the knowledge to future generations.

Our master demonstrators and youth apprentices were featured on the global UNESCO Intangible Cultural Heritage portal, showcasing Penang as an international beacon for Asian martial preservation.
        `,
                category: 'Heritage',
                tags: 'UNESCO, ICHCAP, George Town, Penang Heritage',
                cover_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
                is_featured: false,
                status: 'published'
            }
        ];
        await client.query(`DELETE FROM news_articles WHERE 1=1;`);
        for (const art of articles) {
            await client.query(`
        INSERT INTO news_articles (
          title, slug, summary, content, category, tags, cover_image_url, author_id, status, is_featured, published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW());
      `, [
                art.title, art.slug, art.summary, art.content, art.category, art.tags,
                art.cover_image_url, adminId, art.status, art.is_featured
            ]);
        }
        // 9. Heritage Projects
        const heritageProjects = [
            {
                title: 'UNESCO Living Heritage Community Inventorying (George Town)',
                slug: 'unesco-living-heritage-inventory',
                organization: 'UNESCO & George Town World Heritage Incorporated',
                year: 2019,
                overview: 'A milestone urban living heritage inventory project documenting George Town\'s intangible cultural treasures. Aadhiran Silambam was the sole martial art selected for in-depth documentation and public engagement.',
                cultural_significance: 'Preserves the authentic transmission of ancient Tamil martial knowledge in a UNESCO World Heritage City, ensuring youth awareness and government safeguarding.',
                full_content: 'Comprehensive field interviews, video recordings of the ten stages, and documentation of oral martial sayings preserved by Master Siva and senior disciples.',
                cover_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
                document_url: 'https://ich.unesco.org',
                is_featured: true
            },
            {
                title: 'ICHCAP South Korea Global Traditional Martial Arts Documentation',
                slug: 'ichcap-south-korea-documentation',
                organization: 'ICHCAP UNESCO Category 2 Centre (Jeonju, Republic of Korea)',
                year: 2020,
                overview: 'An international academic and cultural publication project cataloging authentic martial arts in the Asia-Pacific region. Aadhiran Silambam was selected to represent Malaysia\'s rich multicultural martial heritage.',
                cultural_significance: 'Positioned Aadhiran Silambam on the global academic and cultural diplomacy map, distinguishing authentic non-commercialized Silambam from modern sports offshoots.',
                full_content: 'Publication featuring historical analysis of Grandmaster Mariapakkiam\'s 1936 migration, technical analysis of Kambu Veechu and Por Kaaladi, and high-resolution photo archives.',
                cover_image_url: '/uploads/july-2015_orig.png',
                document_url: 'https://www.unesco-ichcap.org',
                is_featured: true
            },
            {
                title: 'Malaysia Book of Records Historical Verification Project',
                slug: 'malaysia-book-of-records-verification',
                organization: 'The Malaysia Book of Records',
                year: 2022,
                overview: 'An extensive historical and legal audit reviewing registrar of societies documents, newspaper archives, and oral testimonies dating back to 25 February 1975.',
                cultural_significance: 'Officially certified Persatuan Aadhiran Silambam Pulau Pinang as the Oldest Silambam Association in Malaysia, giving our lineage indisputable historical primacy.',
                full_content: 'Official certificate presented at a gala ceremony in George Town on 28th August 2022 witnessed by state dignitaries and community elders.',
                cover_image_url: '/uploads/screenshot-2019-06-09-at-5-17-22-am_orig.png',
                document_url: 'https://www.malaysiarecords.com.my',
                is_featured: true
            }
        ];
        await client.query(`DELETE FROM heritage_projects WHERE 1=1;`);
        for (const hp of heritageProjects) {
            await client.query(`
        INSERT INTO heritage_projects (
          title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
      `, [
                hp.title, hp.slug, hp.organization, hp.year, hp.overview, hp.cultural_significance,
                hp.full_content, hp.cover_image_url, hp.document_url, hp.is_featured
            ]);
        }
        // 10. Partners & Press
        const partnersPress = [
            {
                title: 'CNN Travel Feature: "9 reasons to visit Penang that have nothing to do with street food"',
                entity_type: 'press',
                organization_name: 'CNN Travel',
                publication_date: '2017-02-14',
                quote_or_excerpt: 'Beyond Penang\'s world-famous street food lies an extraordinary living tapestry of ancient martial arts. Aadhiran Silambam showcases stick-fighting traditions that trace their lineage thousands of years into antiquity.',
                article_url: 'https://edition.cnn.com/travel/article/penang-not-about-street-food/index.html',
                logo_or_image_url: '/uploads/img10.jpg',
                is_featured: true
            },
            {
                title: 'UNESCO ICHCAP Asia-Pacific Martial Arts Division',
                entity_type: 'partner',
                organization_name: 'UNESCO ICHCAP (South Korea)',
                publication_date: '2020-11-15',
                quote_or_excerpt: 'Aadhiran Silambam exemplifies community-level safeguarding of traditional martial expressions with intact Guru-Student lineage transmission.',
                article_url: 'https://www.unesco-ichcap.org',
                logo_or_image_url: '/uploads/july-2015_orig.png',
                is_featured: true
            },
            {
                title: 'George Town World Heritage Incorporated (GTWHI)',
                entity_type: 'partner',
                organization_name: 'GTWHI',
                publication_date: '2019-07-07',
                quote_or_excerpt: 'Persatuan Aadhiran Silambam Pulau Pinang represents the authentic pulse of Penang\'s living cultural heritage, actively engaging the local community in living tradition.',
                article_url: 'https://gtwhi.com.my',
                logo_or_image_url: '/uploads/48397540-957165591150493-3850920351072518144-o.jpg',
                is_featured: true
            },
            {
                title: 'Penang Heritage Trust (PHT)',
                entity_type: 'partner',
                organization_name: 'Penang Heritage Trust',
                publication_date: '2018-09-12',
                quote_or_excerpt: 'A rare and cherished intangible cultural asset that has kept our state\'s historic ties with ancient South Indian traditions alive and flourishing.',
                article_url: 'https://pht.org.my',
                logo_or_image_url: '/uploads/portfolio-2-1.jpg',
                is_featured: false
            }
        ];
        await client.query(`DELETE FROM partners_press WHERE 1=1;`);
        for (const pp of partnersPress) {
            await client.query(`
        INSERT INTO partners_press (
          title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [
                pp.title, pp.entity_type, pp.organization_name, pp.publication_date,
                pp.quote_or_excerpt, pp.article_url, pp.logo_or_image_url, pp.is_featured
            ]);
        }
        // 11. Initial Sample Enquiries (for testing admin enquiries view)
        await client.query(`
      INSERT INTO enquiries (
        enquiry_type, full_name, email, phone, age_group, experience_level, preferred_location, message, status, admin_notes
      )
      VALUES 
      ('join_training', 'Kavitha Ramasamy', 'kavitha.r@example.com', '+60 12-345 6789', 'teen', 'beginner', 'George Town Heritage Center', 'I would like to enroll my 14-year-old son in the weekend Kaaladi Varisai beginner batches. Does he need to bring a bamboo staff on day one?', 'new', ''),
      ('general', 'Dr. Marcus Tan', 'mtan.heritage@example.my', '+60 17-889 1234', 'adult', 'none', 'Penang Island', 'We are organizing an intangible cultural heritage documentary for Penang Heritage Week and would love to film a 15-minute demonstration with Master Siva.', 'contacted', 'Spoke to Dr. Tan on WhatsApp; agreed on preliminary date in November.')
      ;
    `);
        await client.query('COMMIT');
        console.log('✓ Authentic database seeding completed successfully!');
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('✗ Seeding error:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.runSeed = runSeed;
if (require.main === module) {
    (0, exports.runSeed)()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
