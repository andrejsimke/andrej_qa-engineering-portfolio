import { expect, test, type Page } from '@playwright/test';

async function openOrderReview(page: Page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByPlaceholder('First Name').fill('Alex');
  await page.getByPlaceholder('Last Name').fill('Tester');
  await page.getByPlaceholder('Zip/Postal Code').fill('10001');
  await page.getByRole('button', { name: 'Continue' }).click();
}

test('shows two items and calculates the order total', async ({ page }) => {
  await openOrderReview(page);

  await expect(page.getByText('Checkout: Overview')).toBeVisible();
  const backpack = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
  const bikeLight = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Bike Light' });
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
  await expect(backpack.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  await expect(bikeLight.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
  await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack', { exact: false })).toBeVisible();
  await expect(page.locator('[data-test="payment-info-label"]')).toHaveText('Payment Information:');
  await expect(page.locator('[data-test="shipping-info-label"]')).toHaveText('Shipping Information:');
  await expect(page.locator('[data-test="total-info-label"]')).toHaveText('Price Total');

  const itemTotal = Number((await page.locator('[data-test="subtotal-label"]').innerText()).split('$')[1]);
  const tax = Number((await page.locator('[data-test="tax-label"]').innerText()).split('$')[1]);
  const total = Number((await page.locator('[data-test="total-label"]').innerText()).split('$')[1]);

  expect(itemTotal).toBeCloseTo(29.99 + 9.99, 2);
  expect(total).toBeCloseTo(itemTotal + tax, 2);
});

test('downloads the order PDF and returns home after checkout', async ({ page }) => {
  await openOrderReview(page);
  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  const pdfButton = page.getByRole('button', { name: 'Generate PDF order' });
  const backHomeButton = page.getByRole('button', { name: 'Back Home' });
  await expect(pdfButton).toBeVisible();
  await expect(backHomeButton).toBeVisible();

  // Start waiting before clicking, so Playwright does not miss the download event.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    pdfButton.click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^swag-labs-order-.*\.pdf$/);

  await backHomeButton.click();
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});
