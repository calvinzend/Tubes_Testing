import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('NAVBAR → PROFILE (APPLIER)', () => {
  let email: string;
  let password = '12345678';
  let token: string;
  let applierId: string;

  beforeAll(async () => {
    email = `applier${Date.now()}@mail.com`;

    await request(app).post('/auth/register-applier').send({
      email, password, name: 'Applier Test'
    });

    const loginRes = await request(app)
      .post('/auth/login-applier')
      .send({ email, password });

    token = loginRes.body.data.accessToken;

    // Ambil applierId dari login response
    applierId = loginRes.body.data.user?.user_id ||
                loginRes.body.data.user?.applier_id ||
                loginRes.body.data.user?.id;

    // Fallback: decode dari JWT
    if (!applierId && token) {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      applierId = payload.id || payload.applier_id;
    }

    console.log('applierId:', applierId);
    console.log('token:', token);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should get applier profile', async () => {
    const res = await request(app)
      .get(`/profile/appliers/${applierId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('profile status:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});