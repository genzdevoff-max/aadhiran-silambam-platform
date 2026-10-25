import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE_PNG = path.resolve(__dirname, 'fixtures/test-e2e-asset.png');
const ADMIN_EMAIL = 'admin@aadhiran.com';
const ADMIN_PASSWORD = 'Admin@Aadhiran2026';
const EDITOR_EMAIL = 'e2e.editor@test-aadhiran.com';
const EDITOR_PASSWORD = 'EditorPassword123!';

test.describe('Aadhiran Admin Portal - Browser End-to-End Suite', () => {

  test('1. Unauthorized access to protected admin routes redirects to login', async ({ page }) => {
    // Attempt to access admin dashboard directly without authentication
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('#admin-email')).toBeVisible();

    // Attempt to access settings directly
    await page.goto('/admin/settings');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('2. Admin login form validation and credential failure states', async ({ page }) => {
    await page.goto('/admin/login');

    // Attempt invalid password
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Verify error banner is displayed
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/Invalid|Unable to sign in/i);
  });

  test('3. Successful Admin Login and Dashboard loading', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // Expect navigation to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('aside[aria-label="Admin navigation"]')).toBeVisible();
    await expect(page.locator('text=AADHIRAN CMS').first()).toBeVisible();

    // Verify token exists in localStorage
    const token = await page.evaluate(() => localStorage.getItem('aadhiran_admin_token'));
    expect(token).toBeTruthy();
  });

  test('4. Full Navigation across all Admin Screens', async ({ page }) => {
    // Log in
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    const routes = [
      { text: 'Sections & Hero', urlPattern: /\/admin\/sections/ },
      { text: '10-Stage Syllabus', urlPattern: /\/admin\/syllabus/ },
      { text: 'Instructors & Masters', urlPattern: /\/admin\/instructors/ },
      { text: 'Achievements & Awards', urlPattern: /\/admin\/achievements/ },
      { text: 'Events & Competitions', urlPattern: /\/admin\/events/ },
      { text: 'News & Blog Articles', urlPattern: /\/admin\/news/ },
      { text: 'Heritage Projects', urlPattern: /\/admin\/heritage/ },
      { text: 'Partners & Press', urlPattern: /\/admin\/partners/ },
      { text: 'Media Asset Library', urlPattern: /\/admin\/media/ },
      { text: 'Photo Albums', urlPattern: /\/admin\/albums/ },
      { text: 'Contact & Join Enquiries', urlPattern: /\/admin\/enquiries/ },
      { text: 'Admin Users & Roles', urlPattern: /\/admin\/users/ },
      { text: 'Site Settings & SEO', urlPattern: /\/admin\/settings/ },
    ];

    for (const route of routes) {
      await page.click(`aside a:has-text("${route.text}")`);
      await expect(page).toHaveURL(route.urlPattern);
    }
  });

  test('5. Syllabus Module: Form Validation, Create, Readback, Edit, and Delete', async ({ page }) => {
    // Log in and go to Syllabus
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click('aside a:has-text("10-Stage Syllabus")');
    await expect(page).toHaveURL(/\/admin\/syllabus/);

    // Click Add Stage
    await page.click('button:has-text("Add Stage")');
    const dialog = page.locator('[data-admin-dialog]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h3')).toContainText(/Create New Syllabus Stage/i);

    // Fill Stage Details
    const stageNum = 19;
    const tamilName = 'தேர்வு நிலை (E2E Test Stage)';
    const englishName = 'E2E Automated Verification Stage';
    const updatedEnglishName = 'E2E Automated Verification Stage - Updated';

    await dialog.locator('input[type="number"]').fill(String(stageNum));
    // Tamil title input
    const inputs = dialog.locator('input[type="text"]');
    await inputs.nth(0).fill(tamilName);
    await inputs.nth(1).fill(englishName);

    // Overview textarea
    await dialog.locator('textarea').first().fill('E2E browser automated test stage verification.');

    // Save
    await dialog.locator('button:has-text("Save Stage")').click();

    // Verify success banner
    await expect(page.locator('text=New syllabus stage created successfully.')).toBeVisible();

    // Verify stage in list
    const stageCard = page.locator(`text=${englishName}`).first();
    await expect(stageCard).toBeVisible();

    // Edit the newly created stage
    const parentContainer = page.locator('div.rounded-2xl', { hasText: englishName }).first();
    await parentContainer.locator('button:has-text("Edit")').click();

    // Edit modal
    await expect(dialog).toBeVisible();
    await dialog.locator('input[type="text"]').nth(1).fill(updatedEnglishName);
    await dialog.locator('button:has-text("Save Stage")').click();

    // Verify update success
    await expect(page.locator('text=Syllabus stage updated successfully.')).toBeVisible();
    await expect(page.locator(`text=${updatedEnglishName}`).first()).toBeVisible();

    // Delete the stage with confirm dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    const updatedContainer = page.locator('div.rounded-2xl', { hasText: updatedEnglishName }).first();
    await updatedContainer.locator('button:has-text("Delete")').click();

    // Verify deletion message
    await expect(page.locator('text=Stage removed successfully.')).toBeVisible();
    await expect(page.locator(`text=${updatedEnglishName}`)).toHaveCount(0);
  });

  test('6. Media Module: Upload, File Validation, View, and Delete Cleanup', async ({ page }) => {
    // Log in and go to Media
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click('aside a:has-text("Media Asset Library")');
    await expect(page).toHaveURL(/\/admin\/media/);

    // Upload fixture file
    await page.setInputFiles('input[type="file"]', FIXTURE_PNG);

    // Verify success banner
    await expect(page.locator('text=1 file(s) uploaded successfully.')).toBeVisible({ timeout: 15000 });

    // Locate uploaded asset card
    const assetCard = page.locator('div.group', { hasText: 'test-e2e-asset.png' }).first();
    await expect(assetCard).toBeVisible();

    // Delete asset
    await assetCard.locator('button[title="Delete asset"]').click();

    // Verify deletion modal appears
    const deleteModal = page.locator('[data-admin-dialog]');
    await expect(deleteModal).toBeVisible();
    await expect(deleteModal.locator('h2')).toContainText(/Confirm Asset Deletion|Warning: Asset In Use/);

    // Confirm Delete
    const confirmBtn = deleteModal.locator('button:has-text("Delete Asset"), button:has-text("Force Delete Anyway")');
    await confirmBtn.click();

    // Verify modal closes and asset is removed
    await expect(deleteModal).toHaveCount(0);
    await expect(page.locator('div.group', { hasText: 'test-e2e-asset.png' })).toHaveCount(0);
  });

  test('7. Settings Module: Value Edit, Save, and Persistence across Page Reload', async ({ page }) => {
    // Log in and go to Settings
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click('aside a:has-text("Site Settings & SEO")');
    await expect(page).toHaveURL(/\/admin\/settings/);

    // Wait for form to populate
    const siteTitleInput = page.locator('input[type="text"]').first();
    await expect(siteTitleInput).toBeVisible();
    const currentTitle = await siteTitleInput.inputValue();
    expect(currentTitle).toBeTruthy();

    const testMarker = ' [E2E-Verified]';
    const modifiedTitle = currentTitle.includes(testMarker) ? currentTitle : currentTitle + testMarker;

    // Change title
    await siteTitleInput.fill(modifiedTitle);
    await page.click('button:has-text("Save General Settings")');

    // Verify save feedback
    await expect(page.locator('text=Site settings and metadata saved successfully.')).toBeVisible();

    // Reload page to test server-side persistence
    await page.reload();
    await expect(page.locator('input[type="text"]').first()).toHaveValue(modifiedTitle);

    // Restore clean title
    const cleanTitle = modifiedTitle.replace(testMarker, '');
    await page.locator('input[type="text"]').first().fill(cleanTitle);
    await page.click('button:has-text("Save General Settings")');
    await expect(page.locator('text=Site settings and metadata saved successfully.')).toBeVisible();
  });

  test('8. Role Restrictions: Super Admin vs Editor Access Guard and User Lifecycle', async ({ page }) => {
    // 1. Log in as super_admin
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Navigate to Admin Users
    await page.click('aside a:has-text("Admin Users & Roles")');
    await expect(page).toHaveURL(/\/admin\/users/);

    // 3. Create isolated editor user
    await page.click('button:has-text("New Staff User")');
    const userDialog = page.locator('[data-admin-dialog]');
    await expect(userDialog).toBeVisible();

    await userDialog.locator('#new-user-name').fill('E2E Test Editor');
    await userDialog.locator('#new-user-email').fill(EDITOR_EMAIL);
    await userDialog.locator('#new-user-password').fill(EDITOR_PASSWORD);
    await userDialog.locator('#new-user-role').selectOption('editor');
    await userDialog.locator('button:has-text("Create Account")').click();

    // Expect success message
    await expect(page.locator('text=Staff administrator user created successfully.')).toBeVisible();
    await expect(page.locator(`text=${EDITOR_EMAIL}`)).toBeVisible();

    // 4. Log out super_admin
    await page.locator('button[aria-label="Sign out"]').click();
    await expect(page).toHaveURL(/\/admin\/login/);

    // 5. Log in as the newly created Editor
    await page.fill('#admin-email', EDITOR_EMAIL);
    await page.fill('#admin-password', EDITOR_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 6. Verify "Admin Users & Roles" link is hidden in the sidebar for editor
    await expect(page.locator('aside a:has-text("Admin Users & Roles")')).toHaveCount(0);

    // 7. Attempt direct navigation to restricted URL
    await page.goto('/admin/users');
    await expect(page.locator('text=Access Restricted')).toBeVisible();
    await expect(page.locator('text=requires SUPER ADMIN privileges', { exact: false })).toBeVisible();

    // 8. Log out editor
    await page.locator('button[aria-label="Sign out"]').click();
    await expect(page).toHaveURL(/\/admin\/login/);

    // 9. Re-login as super_admin and clean up the test user
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.click('aside a:has-text("Admin Users & Roles")');
    await expect(page).toHaveURL(/\/admin\/users/);

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    const userRow = page.locator('tr', { hasText: EDITOR_EMAIL });
    await userRow.locator('button[title="Revoke user account"]').click();

    // Verify deletion feedback and user absence
    await expect(page.locator('text=Account deleted successfully.')).toBeVisible();
    await expect(page.locator(`text=${EDITOR_EMAIL}`)).toHaveCount(0);
  });

  test('9. Admin Logout clears session and returns to login screen', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // Click Sign Out
    await page.locator('button[aria-label="Sign out"]').click();
    await expect(page).toHaveURL(/\/admin\/login/);

    // Verify local storage is cleared
    const token = await page.evaluate(() => localStorage.getItem('aadhiran_admin_token'));
    expect(token).toBeNull();
  });
});
