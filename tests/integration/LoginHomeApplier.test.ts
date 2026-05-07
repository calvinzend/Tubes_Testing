import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('LOGIN → HOME (APPLIER)', () => {
  let email: string;
  let password = '12345678';
  let token: string;

  beforeAll(async () => {
    email = `applier${Date.now()}@mail.com`;

    await request(app)
      .post('/auth/register-applier')
      .send({
        email,
        password,
        name: 'Applier Test'
      });
  });

 it('should login and access protected route (applier)', async () => {
  const loginRes = await request(app)
    .post('/auth/login-applier')
    .send({ email, password });

  expect(loginRes.status).toBe(200);

  const token = loginRes.body.data.accessToken;

  const verifyRes = await request(app)
    .get('/auth/verify')
    .set('Authorization', `Bearer ${token}`);

  expect(verifyRes.status).toBe(200);
  expect(verifyRes.body.message).toBe('Token is valid');
});
});