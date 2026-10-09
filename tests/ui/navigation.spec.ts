import { expect, test } from '@playwright/test';

test('returns to all items from the cart menu', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('.shopping_cart_link').click();
  await expect(page.getByText('Your Cart')).toBeVisible();

  await page.getByRole('button', { name: 'Open Menu' }).click();
  const allItems = page.getByRole('button', { name: 'All Items' });
  await expect(allItems).toBeVisible();
  await allItems.click();

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});
