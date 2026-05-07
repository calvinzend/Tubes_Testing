import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('LOGIN → HOME (RECRUITER)', () => {
  let email: string;
  let password = '12345678';
  let token: string;

  beforeAll(async () => {
    email = `recruiter${Date.now()}@mail.com`;

    await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter Test',
        email,
        password,
        companyName: 'Test Company',
        position: 'HR'
      });
  });

  it('should login and access protected route (recruiter)', async () => {
  const loginRes = await request(app)
    .post('/auth/login-recruiter')
    .send({ email, password });

  expect(loginRes.status).toBe(200);

  const token = loginRes.body.data.accessToken;

  const verifyRes = await request(app)
    .get('/auth/verify')
    .set('Authorization', `Bearer ${token}`);

  expect(verifyRes.status).toBe(200);
});
});