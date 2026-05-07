import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('COMPANY AUTH INTEGRATION TEST', () => {
  let companyEmail: string;
  let companyPassword = '12345678';
  let token: string;

  beforeAll(() => {
    companyEmail = `company${Date.now()}@mail.com`;
  });

  it('should register company', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Company Test',
        companyEmail,
        companyPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Company registered successfully');
  });

  it('should login company', async () => {
    const res = await request(app)
      .post('/auth/login-company')
      .send({
        companyEmail,
        companyPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();

    token = res.body.data.accessToken;
  });

  it('should verify company token', async () => {
    const res = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});