import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('AUTH INTEGRATION TEST', () => {
  let email: string;
  let password = '12345678';
  let token: string;

  beforeAll(() => {
    email = `test${Date.now()}@mail.com`; 
  });

  afterAll(async () => {
    await sequelize.close(); 
  });

  // ✅ 1. REGISTER
  it('should register applier', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        email,
        password,
        name: 'Integration Test'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Applier registered successfully');
  });


  it('should login applier', async () => {
    const res = await request(app)
      .post('/auth/login-applier')
      .send({
        email,
        password
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();

    token = res.body.data.accessToken;
  });

  it('should verify token', async () => {
    const res = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Token is valid');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login-applier')
      .send({
        email,
        password: 'wrongpassword'
      });

    expect(res.status).not.toBe(200);
  });

  it('should fail verify without token', async () => {
    const res = await request(app)
      .get('/auth/verify');

    expect(res.status).not.toBe(200);
  });
});

