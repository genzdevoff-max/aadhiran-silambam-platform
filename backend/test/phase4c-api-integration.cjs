const { query, pool } = require('../dist/config/db');

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:5055/api';
const suffix = Date.now().toString(36);
const created = {
  syllabus: [],
  instructors: [],
  achievements: [],
  events: [],
  news: [],
  heritage: [],
  partners: [],
  albums: [],
  media: [],
  enquiries: [],
  users: [],
};

const results = [];

const api = async (path, options = {}) => {
  const headers = {};
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  let body;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body,
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  return { status: response.status, payload };
};

const check = (name, condition, detail = '') => {
  results.push({ name, passed: Boolean(condition), detail });
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    console.log(`FAIL ${name}${detail ? ` :: ${detail}` : ''}`);
  }
};

const expectStatus = async (name, path, options, expected = 200) => {
  const response = await api(path, options);
  check(name, response.status === expected, `status=${response.status} body=${JSON.stringify(response.payload).slice(0, 300)}`);
  return response;
};

const listContains = async (path, token, id, listKey) => {
  const response = await api(path, { token });
  const list = response.payload?.[listKey] || [];
  return Array.isArray(list) && list.some((item) => item.id === id);
};

const main = async () => {
  console.log(`Testing ${BASE_URL} against database aadhiran`);

  const dbInfo = await query('SELECT DATABASE() AS db');
  check('test process connected to aadhiran', dbInfo.rows[0]?.db === 'aadhiran', String(dbInfo.rows[0]?.db));

  const login = await expectStatus('admin login', '/auth/login', {
    method: 'POST',
    body: { email: 'admin@aadhiran.com', password: 'Admin@Aadhiran2026' },
  }, 200);
  const token = login.payload?.token;
  check('login returns token and super_admin role', Boolean(token) && login.payload?.user?.role === 'super_admin');

  if (!token) throw new Error('Login failed; aborting authenticated integration checks.');

  const me = await expectStatus('auth/me readback', '/auth/me', { token });
  check('auth/me returns administrator profile', me.payload?.user?.email === 'admin@aadhiran.com');

  for (const [name, path, key] of [
    ['home', '/public/home', 'hero'],
    ['about', '/public/about', 'general'],
    ['lineage', '/public/lineage', 'masters'],
    ['syllabus', '/public/syllabus', null],
    ['instructors', '/public/instructors', null],
    ['achievements', '/public/achievements', null],
    ['events', '/public/events', null],
    ['albums', '/public/albums', null],
    ['photos', '/public/photos', null],
    ['videos', '/public/videos', null],
    ['news', '/public/news', null],
    ['heritage', '/public/heritage', null],
    ['partners-press', '/public/partners-press', null],
    ['settings', '/public/settings', null],
  ]) {
    const response = await expectStatus(`public GET ${name}`, path, {});
    check(`public ${name} payload is shaped`, response.payload?.success === true && (key ? response.payload.data?.[key] !== undefined : response.payload.data !== undefined));
  }

  for (const [name, path, listKey] of [
    ['dashboard', '/admin/dashboard', 'stats'],
    ['syllabus', '/admin/syllabus', 'stages'],
    ['instructors', '/admin/instructors', 'instructors'],
    ['achievements', '/admin/achievements', 'achievements'],
    ['events', '/admin/events', 'events'],
    ['news', '/admin/news', 'articles'],
    ['heritage', '/admin/heritage', 'projects'],
    ['partners', '/admin/partners', 'items'],
    ['albums', '/admin/albums', 'albums'],
    ['media', '/admin/media', 'media'],
    ['enquiries', '/admin/enquiries', 'enquiries'],
  ]) {
    const response = await expectStatus(`admin GET ${name}`, path, { token });
    check(`admin ${name} list is present`, Array.isArray(response.payload?.[listKey]) || (listKey === 'stats' && Boolean(response.payload?.stats)));
  }

  const stagePayload = {
    stage_number: 91,
    tamil_name: `à®šà¯‹à®¤à®©à¯ˆ ${suffix}`,
    english_name: 'Integration Test Stage',
    overview: 'Temporary stage created by Phase 4C integration checks.',
    key_techniques: 'probe',
    weapon_focus: 'probe',
    animal_movements: 'probe',
    sort_order: 91,
  };
  const stageCreate = await expectStatus('syllabus create write', '/admin/syllabus', { method: 'POST', token, body: stagePayload }, 201);
  const stageId = stageCreate.payload?.stage?.id;
  created.syllabus.push(stageId);
  check('syllabus create returns row from TiDB', Boolean(stageId) && stageCreate.payload?.stage?.english_name === stagePayload.english_name);
  const stageDb = await query('SELECT id FROM syllabus_stages WHERE id = $1', [stageId]);
  check('syllabus row readable directly from TiDB', stageDb.rowCount === 1);
  const stageUpdate = await expectStatus('syllabus update write', `/admin/syllabus/${stageId}`, {
    method: 'PUT', token, body: { english_name: 'Integration Test Stage Updated' },
  });
  check('syllabus update persisted', stageUpdate.payload?.stage?.english_name === 'Integration Test Stage Updated');
  check('syllabus appears in admin list', await listContains('/admin/syllabus', token, stageId, 'stages'));
  await expectStatus('syllabus delete cleanup', `/admin/syllabus/${stageId}`, { method: 'DELETE', token });
  created.syllabus = [];
  check('syllabus deleted from TiDB', (await query('SELECT id FROM syllabus_stages WHERE id = $1', [stageId])).rowCount === 0);

  const instructorPayload = {
    name: `Phase 4C Instructor ${suffix}`,
    tamil_name: 'à®šà¯‹à®¤à®©à¯ˆ à®†à®šà®¿à®°à®¿à®¯à®°à¯',
    title: 'Integration Test Instructor',
    role_type: 'instructor',
    biography: 'Temporary instructor created by Phase 4C integration checks.',
    years_experience: 1,
    lineage_rank: 'Test',
    photo_url: '/uploads/mariapaqiam4.png',
    sort_order: 99,
  };
  const instructorCreate = await expectStatus('instructor create write', '/admin/instructors', { method: 'POST', token, body: instructorPayload }, 201);
  const instructorId = instructorCreate.payload?.instructor?.id;
  created.instructors.push(instructorId);
  check('instructor create persisted', Boolean(instructorId) && (await query('SELECT id FROM instructors WHERE id = $1', [instructorId])).rowCount === 1);
  const instructorUpdate = await expectStatus('instructor update write', `/admin/instructors/${instructorId}`, {
    method: 'PUT', token, body: { title: 'Integration Test Instructor Updated' },
  });
  check('instructor update persisted', instructorUpdate.payload?.instructor?.title === 'Integration Test Instructor Updated');
  await expectStatus('instructor delete cleanup', `/admin/instructors/${instructorId}`, { method: 'DELETE', token });
  created.instructors = [];

  const achievementPayload = {
    title: `Phase 4C Achievement ${suffix}`,
    category: 'Integration Test',
    year: 2026,
    date_awarded: '2026-10-23',
    awarding_organization: 'Integration Harness',
    description: 'Temporary achievement created by Phase 4C integration checks.',
    supporting_images: ['/uploads/img1.jpg'],
    status: 'published',
    is_featured: false,
    sort_order: 99,
  };
  const achievementCreate = await expectStatus('achievement create write', '/admin/achievements', { method: 'POST', token, body: achievementPayload }, 201);
  const achievementId = achievementCreate.payload?.achievement?.id;
  created.achievements.push(achievementId);
  check('achievement JSON field round-tripped', Boolean(achievementId) && Array.isArray(achievementCreate.payload?.achievement?.supporting_images));
  const achievementUpdate = await expectStatus('achievement update write', `/admin/achievements/${achievementId}`, {
    method: 'PUT', token, body: { title: `Phase 4C Achievement Updated ${suffix}` },
  });
  check('achievement update persisted', achievementUpdate.payload?.achievement?.title?.endsWith('Updated ' + suffix));
  await expectStatus('achievement delete cleanup', `/admin/achievements/${achievementId}`, { method: 'DELETE', token });
  created.achievements = [];

  const eventSlug = `phase4c-event-${suffix}`;
  const eventCreate = await expectStatus('event create write', '/admin/events', {
    method: 'POST', token, body: {
      title: `Phase 4C Event ${suffix}`,
      slug: eventSlug,
      description: 'Temporary event created by Phase 4C integration checks.',
      event_type: 'test',
      start_date: '2026-12-01T10:00:00Z',
      location: 'Test Venue',
      status: 'upcoming',
    },
  }, 201);
  const eventId = eventCreate.payload?.event?.id;
  created.events.push(eventId);
  check('event create persisted to TiDB', (await query('SELECT id FROM events WHERE id = $1', [eventId])).rowCount === 1);
  const eventPublic = await expectStatus('event public readback by slug', `/public/events/${eventSlug}`, {});
  check('event public readback matches created row', eventPublic.payload?.data?.id === eventId);
  await expectStatus('event update write', `/admin/events/${eventId}`, {
    method: 'PUT', token, body: { title: `Phase 4C Event Updated ${suffix}` },
  });
  const eventAfterUpdate = await expectStatus('event readback after update', '/admin/events', { token });
  check('event update visible in admin list', (eventAfterUpdate.payload?.events || []).some((item) => item.id === eventId && item.title.endsWith('Updated ' + suffix)));
  await expectStatus('event delete cleanup', `/admin/events/${eventId}`, { method: 'DELETE', token });
  created.events = [];

  const newsSlug = `phase4c-news-${suffix}`;
  const newsCreate = await expectStatus('news create write', '/admin/news', {
    method: 'POST', token, body: {
      title: `Phase 4C Article ${suffix}`,
      slug: newsSlug,
      summary: 'Temporary article summary for integration checks.',
      content: 'Temporary article content for integration checks.',
      category: 'Integration Test',
      tags: 'phase4c,test',
      status: 'published',
    },
  }, 201);
  const newsId = newsCreate.payload?.article?.id;
  created.news.push(newsId);
  check('news create persisted to TiDB', (await query('SELECT id FROM news_articles WHERE id = $1', [newsId])).rowCount === 1);
  const newsPublic = await expectStatus('news public readback by slug', `/public/news/${newsSlug}`, {});
  check('news public readback matches created row', newsPublic.payload?.data?.id === newsId);
  await expectStatus('news update write', `/admin/news/${newsId}`, {
    method: 'PUT', token, body: { summary: 'Updated temporary article summary.' },
  });
  const newsAfterUpdate = await query('SELECT summary FROM news_articles WHERE id = $1', [newsId]);
  check('news update persisted to TiDB', newsAfterUpdate.rows[0]?.summary === 'Updated temporary article summary.');
  await expectStatus('news delete cleanup', `/admin/news/${newsId}`, { method: 'DELETE', token });
  created.news = [];

  const heritageSlug = `phase4c-heritage-${suffix}`;
  const heritageCreate = await expectStatus('heritage create write', '/admin/heritage', {
    method: 'POST', token, body: {
      title: `Phase 4C Heritage ${suffix}`,
      slug: heritageSlug,
      organization: 'Integration Harness',
      year: 2026,
      overview: 'Temporary heritage overview.',
      cultural_significance: 'Temporary heritage significance.',
      full_content: 'Temporary heritage content.',
    },
  }, 201);
  const heritageId = heritageCreate.payload?.project?.id;
  created.heritage.push(heritageId);
  check('heritage create persisted to TiDB', (await query('SELECT id FROM heritage_projects WHERE id = $1', [heritageId])).rowCount === 1);
  const heritagePublic = await expectStatus('heritage public readback by slug', `/public/heritage/${heritageSlug}`, {});
  check('heritage public readback matches created row', heritagePublic.payload?.data?.id === heritageId);
  await expectStatus('heritage delete cleanup', `/admin/heritage/${heritageId}`, { method: 'DELETE', token });
  created.heritage = [];

  const partnerCreate = await expectStatus('partner create write', '/admin/partners', {
    method: 'POST', token, body: {
      title: `Phase 4C Partner ${suffix}`,
      entity_type: 'partner',
      organization_name: 'Integration Harness',
      quote_or_excerpt: 'Temporary partner quote.',
      is_featured: false,
    },
  }, 201);
  const partnerId = partnerCreate.payload?.item?.id;
  created.partners.push(partnerId);
  check('partner create persisted to TiDB', (await query('SELECT id FROM partners_press WHERE id = $1', [partnerId])).rowCount === 1);
  await expectStatus('partner update write', `/admin/partners/${partnerId}`, {
    method: 'PUT', token, body: { title: `Phase 4C Partner Updated ${suffix}` },
  });
  const partnerDb = await query('SELECT title FROM partners_press WHERE id = $1', [partnerId]);
  check('partner update persisted to TiDB', partnerDb.rows[0]?.title?.endsWith('Updated ' + suffix));
  await expectStatus('partner delete cleanup', `/admin/partners/${partnerId}`, { method: 'DELETE', token });
  created.partners = [];

  const albumSlug = `phase4c-album-${suffix}`;
  const albumCreate = await expectStatus('album create write', '/admin/albums', {
    method: 'POST', token, body: {
      title: `Phase 4C Album ${suffix}`,
      slug: albumSlug,
      description: 'Temporary album.',
      category: 'test',
      sort_order: 99,
      is_published: true,
    },
  }, 201);
  const albumId = albumCreate.payload?.album?.id;
  created.albums.push(albumId);
  check('album create persisted to TiDB', (await query('SELECT id FROM albums WHERE id = $1', [albumId])).rowCount === 1);
  await expectStatus('album update write', `/admin/albums/${albumId}`, {
    method: 'PUT', token, body: { title: `Phase 4C Album Updated ${suffix}` },
  });
  const albumDb = await query('SELECT title FROM albums WHERE id = $1', [albumId]);
  check('album update persisted to TiDB', albumDb.rows[0]?.title?.endsWith('Updated ' + suffix));

  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const pngPayload = Buffer.concat([pngHeader, Buffer.alloc(64, 0)]);
  const form = new FormData();
  form.append('files', new Blob([pngPayload], { type: 'image/png' }), `phase4c-${suffix}.png`);
  form.append('album_id', albumId);
  form.append('caption', 'Phase 4C integration upload');
  form.append('alt_text', 'Phase 4C integration upload');
  const mediaUpload = await expectStatus('media upload write', '/admin/media/upload', { method: 'POST', token, form }, 201);
  const mediaId = mediaUpload.payload?.media?.[0]?.id;
  created.media.push(mediaId);
  check('media upload persisted to TiDB', Boolean(mediaId) && (await query('SELECT id FROM media_assets WHERE id = $1', [mediaId])).rowCount === 1);
  const mediaUpdate = await expectStatus('media update write', `/admin/media/${mediaId}`, {
    method: 'PUT', token, body: { alt_text: 'Updated integration upload', caption: 'Updated integration caption' },
  });
  check('media update persisted', mediaUpdate.payload?.media?.alt_text === 'Updated integration upload');
  const mediaList = await expectStatus('media list readback', `/admin/media?albumId=${albumId}`, { token });
  check('uploaded media visible in filtered list', (mediaList.payload?.media || []).some((item) => item.id === mediaId));
  await expectStatus('media delete cleanup', `/admin/media/${mediaId}?force=true`, { method: 'DELETE', token });
  created.media = [];
  await expectStatus('album delete cleanup', `/admin/albums/${albumId}`, { method: 'DELETE', token });
  created.albums = [];

  const contactEmail = `phase4c-contact-${suffix}@example.com`;
  const contact = await expectStatus('public contact enquiry write', '/public/enquiries', {
    method: 'POST', body: {
      fullName: 'Phase 4C Contact',
      email: contactEmail,
      phone: '+60 12-000 0000',
      message: 'Temporary contact enquiry for Phase 4C integration checks.',
    },
  }, 201);
  check('public contact enquiry acknowledged', contact.payload?.success === true);
  const enquiryList = await expectStatus('enquiry admin readback', '/admin/enquiries', { token });
  const contactEnquiry = (enquiryList.payload?.enquiries || []).find((item) => item.email === contactEmail);
  check('contact enquiry readable from TiDB via API', Boolean(contactEnquiry));
  if (contactEnquiry) {
    created.enquiries.push(contactEnquiry.id);
    const enquiryUpdate = await expectStatus('enquiry update write', `/admin/enquiries/${contactEnquiry.id}`, {
      method: 'PUT', token, body: { status: 'contacted', admin_notes: 'Phase 4C integration note.' },
    });
    check('enquiry update persisted', enquiryUpdate.payload?.enquiry?.status === 'contacted');
    await expectStatus('enquiry delete cleanup', `/admin/enquiries/${contactEnquiry.id}`, { method: 'DELETE', token });
    created.enquiries = [];
  }

  const joinEmail = `phase4c-join-${suffix}@example.com`;
  const join = await expectStatus('public join enquiry write', '/public/join-enquiry', {
    method: 'POST', body: {
      fullName: 'Phase 4C Join',
      email: joinEmail,
      phone: '+60 12-000 0001',
      ageGroup: 'adult',
      experienceLevel: 'beginner',
      preferredLocation: 'George Town',
    },
  }, 201);
  check('public join enquiry acknowledged', join.payload?.success === true);
  const joinDb = await query('SELECT id FROM enquiries WHERE email = $1', [joinEmail]);
  check('join enquiry persisted directly in TiDB', joinDb.rowCount === 1);
  if (joinDb.rowCount === 1) {
    created.enquiries.push(joinDb.rows[0].id);
    await expectStatus('join enquiry delete cleanup', `/admin/enquiries/${joinDb.rows[0].id}`, { method: 'DELETE', token });
    created.enquiries = [];
  }

  const settingsRead = await expectStatus('settings readback before write', '/public/settings', {});
  const generalValue = settingsRead.payload?.data?.general;
  const settingsWrite = await expectStatus('section setting write', '/admin/sections/general', {
    method: 'PUT', token, body: { value: generalValue },
  });
  check('section setting write acknowledged', settingsWrite.payload?.success === true);
  const settingsAfter = await expectStatus('settings readback after write', '/public/settings', {});
  check('section setting preserved after refresh', JSON.stringify(settingsAfter.payload?.data?.general) === JSON.stringify(generalValue));

  const userEmail = `phase4c-user-${suffix}@example.com`;
  const userCreate = await expectStatus('admin user create write', '/auth/users', {
    method: 'POST', token, body: {
      email: userEmail,
      password: 'Phase4C-Test-Password1',
      fullName: 'Phase 4C User',
      role: 'editor',
    },
  }, 201);
  const userId = userCreate.payload?.user?.id;
  created.users.push(userId);
  check('admin user create persisted to TiDB', Boolean(userId) && (await query('SELECT id FROM users WHERE id = $1', [userId])).rowCount === 1);
  const usersList = await expectStatus('admin users list readback', '/auth/users', { token });
  check('new admin user appears in list', (usersList.payload?.users || []).some((item) => item.id === userId));
  await expectStatus('admin user update write', `/auth/users/${userId}`, {
    method: 'PUT', token, body: { fullName: 'Phase 4C User Updated', isActive: false },
  });
  const userDb = await query('SELECT full_name, is_active FROM users WHERE id = $1', [userId]);
  check('admin user update persisted', userDb.rows[0]?.full_name === 'Phase 4C User Updated' && Number(userDb.rows[0]?.is_active) === 0);
  await expectStatus('admin user delete cleanup', `/auth/users/${userId}`, { method: 'DELETE', token });
  created.users = [];

  const unauth = await expectStatus('unauthenticated admin request rejected', '/admin/dashboard', {}, 401);
  check('unauthenticated request returns 401', unauth.payload?.success === false);
};

const cleanup = async () => {
  try {
    for (const id of created.syllabus.filter(Boolean)) await query('DELETE FROM syllabus_stages WHERE id = $1', [id]);
    for (const id of created.instructors.filter(Boolean)) await query('DELETE FROM instructors WHERE id = $1', [id]);
    for (const id of created.achievements.filter(Boolean)) await query('DELETE FROM achievements WHERE id = $1', [id]);
    for (const id of created.events.filter(Boolean)) await query('DELETE FROM events WHERE id = $1', [id]);
    for (const id of created.news.filter(Boolean)) await query('DELETE FROM news_articles WHERE id = $1', [id]);
    for (const id of created.heritage.filter(Boolean)) await query('DELETE FROM heritage_projects WHERE id = $1', [id]);
    for (const id of created.partners.filter(Boolean)) await query('DELETE FROM partners_press WHERE id = $1', [id]);
    for (const id of created.media.filter(Boolean)) await query('DELETE FROM media_assets WHERE id = $1', [id]);
    for (const id of created.albums.filter(Boolean)) await query('DELETE FROM albums WHERE id = $1', [id]);
    for (const id of created.enquiries.filter(Boolean)) await query('DELETE FROM enquiries WHERE id = $1', [id]);
    for (const id of created.users.filter(Boolean)) await query('DELETE FROM users WHERE id = $1', [id]);
  } catch (error) {
    console.error('Cleanup warning:', error.message);
  }
};

main()
  .catch((error) => {
    console.error('Integration harness error:', error.message);
    results.push({ name: 'harness completed without fatal error', passed: false, detail: error.message });
  })
  .finally(async () => {
    await cleanup();
    await pool.end();
    const failed = results.filter((result) => !result.passed);
    console.log(`\nRESULT ${results.length - failed.length}/${results.length} checks passed.`);
    if (failed.length > 0) {
      for (const failure of failed) console.log(`FAILED: ${failure.name} :: ${failure.detail}`);
      process.exit(1);
    }
    process.exit(0);
  });
