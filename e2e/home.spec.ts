import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display CustomDash title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('CustomDash');
  });

  test('should have login and register links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Connexion')).toBeVisible();
    await expect(page.getByText('Inscription')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Connexion').click();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Connexion');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Inscription').click();
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Inscription');
  });
});
