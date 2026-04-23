import request from 'supertest';
import app from '../src/backend/app';
import { sequelize } from '../src/backend/app';


jest.mock('../src/middleware/Auth', () => {
  interface User {
    id: string;
    email: string;
    userType: string;
  }

  return (req: any, res: any, next: () => void) => {
    req.user = {
      id: '1',
      email: 'test@mail.com',
      userType: 'applier'
    } as User;
    next();
  };
});

describe('AUTH BLACK BOX', () => {
  let email = `test${Date.now()}@mail.com`;
  let password = '12345678';
  let token: string;

  it('register applier', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        email,
        password,
        name: 'Test User'
      });

    expect(res.status).toBe(200);
  });

  it('login applier', async () => {
    const res = await request(app)
      .post('/auth/login-applier')
      .send({
        email,
        password
      });

    expect(res.status).toBe(200);
    token = res.body.data.accessToken;
  });

  it('verify token', async () => {
    const res = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

afterAll(async () => {
  await sequelize.close();
});