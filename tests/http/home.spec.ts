import { expect, test } from '@playwright/test';

test('serves the SauceDemo home page over HTTP', async ({ request }) => {
  const response = await request.get('/');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');
});
