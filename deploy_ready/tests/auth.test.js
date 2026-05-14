const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../index');

test('register and login returns JWT token', async () => {
  const unique = `user_${Date.now()}`;
  const password = 'Password123!';

  const registerResponse = await request(app)
    .post('/api/register')
    .send({
      username: unique,
      name: 'Test User',
      password
    });

  assert.equal(registerResponse.status, 200);
  assert.equal(registerResponse.body.success, true);

  const loginResponse = await request(app)
    .post('/api/login')
    .send({
      username: unique,
      password
    });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.success, true);
  assert.ok(loginResponse.body.token);
});

test('profile update rejects request without token', async () => {
  const response = await request(app)
    .put('/api/profile')
    .send({
      name: 'Should Fail'
    });

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.code, 'UNAUTHORIZED');
});

test('links update rejects invalid schema consistently', async () => {
  const unique = `user_${Date.now()}_links`;
  const password = 'Password123!';

  await request(app)
    .post('/api/register')
    .send({
      username: unique,
      name: 'Links Tester',
      password
    });

  const login = await request(app)
    .post('/api/login')
    .send({
      username: unique,
      password
    });

  const token = login.body.token;
  const response = await request(app)
    .post('/api/profile/links')
    .set('Authorization', `Bearer ${token}`)
    .send({
      links: [{ platform: 'UnknownPlatform', url: 'not-a-url' }]
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.code, 'UNSUPPORTED_PLATFORM');
});

test('analytics endpoint returns stats for authenticated user', async () => {
  const unique = `user_${Date.now()}_analytics`;
  const password = 'Password123!';

  await request(app)
    .post('/api/register')
    .send({
      username: unique,
      name: 'Analytics Tester',
      password
    });

  const login = await request(app)
    .post('/api/login')
    .send({
      username: unique,
      password
    });

  const token = login.body.token;
  const analyticsResponse = await request(app)
    .get('/api/analytics')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(analyticsResponse.status, 200);
  assert.equal(analyticsResponse.body.success, true);
  assert.ok(analyticsResponse.body.stats);
  assert.ok(Array.isArray(analyticsResponse.body.timeline));
});

test('analytics click accepts source metadata', async () => {
  const unique = `user_${Date.now()}_click`;
  const password = 'Password123!';

  await request(app)
    .post('/api/register')
    .send({
      username: unique,
      name: 'Click Source Tester',
      password
    });

  const clickResponse = await request(app)
    .post('/api/analytics/click')
    .send({
      username: unique,
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/tester',
      source: 'public_profile'
    });

  assert.equal(clickResponse.status, 200);
  assert.equal(clickResponse.body.success, true);
});
