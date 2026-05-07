import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';



describe('NAVBAR → JOBS', () => {
  let token: string;

  afterAll(async () => {
    await sequelize.close();
  });

  beforeAll(async () => {
    const email = `jobtest${Date.now()}@mail.com`;
    const password = '12345678';

    await request(app).post('/auth/register-applier').send({
      email,
      password,
      name: 'Job Test'
    });

    const loginRes = await request(app)
      .post('/auth/login-applier')
      .send({ email, password });

    token = loginRes.body.data.accessToken;

  });

  it('should get job list', async () => {
    const res = await request(app)
      .get('/job/jobs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});