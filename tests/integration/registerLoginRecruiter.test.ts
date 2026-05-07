import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('RECRUITER AUTH INTEGRATION TEST', () => {
  let email: string;
  let password = '12345678';
  let token: string;

  beforeAll(() => {
    email = `recruiter${Date.now()}@mail.com`;
  });

  it('should register recruiter', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter Test',
        email,
        password,
        companyName: 'Test Company',
        position: 'HR'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Recruiter registered successfully');
  });

  it('should login recruiter', async () => {
    const res = await request(app)
      .post('/auth/login-recruiter')
      .send({
        email,
        password
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();

    token = res.body.data.accessToken;
  });

  it('should verify recruiter token', async () => {
    const res = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});