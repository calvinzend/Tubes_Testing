import request from 'supertest';
import app from '../../src/backend/app';
import { sequelize } from '../../src/backend/app';


describe('Testing Login Function', () => {
  let token: string;
  it('login applier', async () => {
    const res = await request(app)
      .post('/auth/login-applier')
      .send({
        email: `applier1@example.com`,
        password: 'password123',
      });

    expect(res.status).toBe(200);
  });

  it('login wrong applier', async () => {
    const res = await request(app)
      .post('/auth/login-applier')
      .send({
        email: `aplier1@example.com`,
        password: 'pasword123',
      });

    expect(res.status).toBe(500);
  });

  it('login recruiter', async () => {
    const res = await request(app)
      .post('/auth/login-recruiter')
      .send({
        email: `recruiter1@example.com`,
        password: 'password123',
      });

    expect(res.status).toBe(200);
  });

  it('login wrong recruiter', async () => {
    const res = await request(app)
      .post('/auth/login-recruiter')
      .send({
        email: `recruiter@example.com`,
        password: 'pasword123',
      });

    expect(res.status).toBe(500);
  });
  it('login company', async () => {
    const res = await request(app)
      .post('/auth/login-company')
      .send({
        companyEmail: `testing1@example.com`,
        companyPassword: 'testing1234',
      });

    expect(res.status).toBe(200);
  });

  it('login wrong company', async () => {
    const res = await request(app)
      .post('/auth/login-company')
      .send({
        companyEmail: `testing@example.com`,
        companyPassword: 'testing1234',
      });

    expect(res.status).toBe(500);
  });

});

afterAll(async () => {
  await sequelize.close();
});