import { expect, test } from '@playwright/test';

test('inspect SauceDemo network traffic', async ({ page }) => {
  const requests: string[] = [];
  let responseCount = 0;

  page.on('response', (response) => {
    responseCount += 1;
    const request = response.request();
    if (request.resourceType() !== 'fetch' && request.resourceType() !== 'xhr') return;

    const url = new URL(request.url());
    const destination = url.hostname === 'www.saucedemo.com'
      ? `${url.origin}${url.pathname}`
      : url.origin;
    requests.push(`${request.method()} ${destination} -> ${response.status()}`);
  });

  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('First Name').fill('Alex');
  await page.getByPlaceholder('Last Name').fill('Tester');
  await page.getByPlaceholder('Zip/Postal Code').fill('10001');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  console.log(`SAUCEDEMO_NETWORK_AUDIT=${JSON.stringify({ responseCount, requests })}`);
});
