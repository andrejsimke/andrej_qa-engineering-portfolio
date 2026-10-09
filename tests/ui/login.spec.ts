import { expect, test } from '@playwright/test';

test('shows products after a successful login', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('shows an error when the password is incorrect', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('incorrect_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(
    page.getByText('Epic sadface: Username and password do not match any user in this service'),
  ).toBeVisible();
});
