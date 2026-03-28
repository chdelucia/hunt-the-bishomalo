import { test, expect } from '@playwright/test';

test.describe('Achievements Verification', () => {
  test('should load achievements list from JSON', async ({ page }) => {
    // Intercept JSON request to ensure it's loaded correctly
    await page.route('**/assets/achievements/hunt-the-bishomalo.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'lara',
            title: 'Test Achievement',
            description: 'Test Description',
            svgIcon: 'lara.png',
            unlocked: false,
            rarity: 'common'
          }
        ])
      });
    });

    await page.goto('/#/logros');

    // Check if the achievement item is rendered
    const achievementItem = page.locator('app-achievement-item');
    await expect(achievementItem).toBeVisible({ timeout: 15000 });
    // Use transloco default fallback which we updated in HTML
    await expect(achievementItem.locator('.title')).toContainText('Test Achievement');

    // Check if image has correct src and is not broken
    const icon = achievementItem.locator('img.achievement-icon');
    await expect(icon).toHaveAttribute('src', /https:\/\/bold-mouse-42af\.c-heredia-naranjo\.workers\.dev\/achievements\/lara\.png/);
  });

  test('should show toast with image when achievement unlocked', async ({ page }) => {
    await page.goto('/#/settings');
    await page.get_by_label(/nombre/i).fill('Jules');
    await page.get_by_role('button', { name: /jugar/i }).click();

    // Trigger achievement unlock via window dispatch (simulating game event)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id: 'lara' } }));
    });

    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();

    const toastImg = toast.locator('img.icon');
    await expect(toastImg).toHaveAttribute('src', /https:\/\/bold-mouse-42af\.c-heredia-naranjo\.workers\.dev\/achievements\/lara\.png/);
  });
});
