import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('LOGIN → HOME (COMPANY)', () => {
  let companyEmail: string;
  let companyPassword = '12345678';
  let token: string;

  beforeAll(async () => {
    companyEmail = `company${Date.now()}@mail.com`;

    await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Company Test',
        companyEmail,
        companyPassword
      });
  });
it('should login and access protected route (company)', async () => {
  const loginRes = await request(app)
    .post('/auth/login-company')
    .send({ companyEmail, companyPassword });

  expect(loginRes.status).toBe(200);

  const token = loginRes.body.data.accessToken;

  const verifyRes = await request(app)
    .get('/auth/verify')
    .set('Authorization', `Bearer ${token}`);

  expect(verifyRes.status).toBe(200);
});
});