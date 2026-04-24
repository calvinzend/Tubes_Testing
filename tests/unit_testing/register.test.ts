import request from 'supertest';
import app from '../../src/backend/app';
import { sequelize } from '../../src/backend/app';


describe('Tessting Register Function', () => {
  let email = `applier${Date.now()}@example.com`;
  let password = 'password123';
  let token: string;

  it('register applier', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        name: 'Applier One',
        email: `applier${Date.now()}@example.com`,
        password: 'password123',
        userType: 'applier'
      });

    expect(res.status).toBe(200);
  });

  it('register recruiter', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter One',
        email: `ecruiter${Date.now()}@example.com`,
        password :'password123',
        userType: 'recruiter'
      });

    expect(res.status).toBe(200);
  });
  it('register company', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Testing',
        companyEmail: `testing${Date.now()}@example.com`,
        companyPassword :'testing1234',
      });

    expect(res.status).toBe(200);
  });

});

afterAll(async () => {
  await sequelize.close();
});