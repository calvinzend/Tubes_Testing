import request from 'supertest';
import app from '../../src/backend/app';
import { sequelize } from '../../src/backend/app';


describe('Testing Register Function', () => {
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
        email: `recruiter${Date.now()}@example.com`,
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

  it('register applier with same email', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        name: 'Applier One',
        email: `applier1@example.com`,
        password: 'password123',
        userType: 'applier'
      });

    expect(res.status).toBe(500);
  });

  it('register recruiter with same email', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter One',
        email: `recruiter1@example.com`,
        password :'password123',
        userType: 'recruiter'
      });

    expect(res.status).toBe(500);
  });

  it('register company with same email', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Testing',
        companyEmail: `testing1@example.com`,
        companyPassword :'testing1234',
      });

    expect(res.status).toBe(500);
  });

  it('register applier with wrong email', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        name: 'Applier One',
        email: `applier1example.com`,
        password: 'password123',
        userType: 'applier'
      });

    expect(res.status).toBe(500);
  });

  it('register recruiter with wrong email', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter One',
        email: `recruiter1example.com`,
        password :'password123',
        userType: 'recruiter'
      });

    expect(res.status).toBe(500);
  });

  it('register company with wrong email', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Testing',
        companyEmail: `testing1example.com`,
        companyPassword :'testing1234',
      });

    expect(res.status).toBe(500);
  });

  it('register applier with wrong password', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        name: 'Applier One',
        email: `applier1@example.com`,
        password: 'passwor',
        userType: 'applier'
      });

    expect(res.status).toBe(500);
  });

  it('register recruiter with wrong password', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: 'Recruiter One',
        email: `recruiter1@example.com`,
        password :'passwor',
        userType: 'recruiter'
      });

    expect(res.status).toBe(500);
  });

  it('register company with wrong password', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: 'Testing',
        companyEmail: `testing1@example.com`,
        companyPassword :'testing',
      });

    expect(res.status).toBe(500);
  });

  it('register applier with empty name', async () => {
    const res = await request(app)
      .post('/auth/register-applier')
      .send({
        name: '',
        email: `applier1@example.com`,
        password: 'password123',
        userType: 'applier'
      });

    expect(res.status).toBe(500);
  });

  it('register recruiter with empty name', async () => {
    const res = await request(app)
      .post('/auth/register-recruiter')
      .send({
        name: '',
        email: `recruiter1@example.com`,
        password :'password123',
        userType: 'recruiter'
      });

    expect(res.status).toBe(500);
  });

  it('register company with empty name', async () => {
    const res = await request(app)
      .post('/auth/register-company')
      .send({
        companyName: '',
        companyEmail: `testing1@example.com`,
        companyPassword :'testing1234',
      });

    expect(res.status).toBe(500);
  });

});

afterAll(async () => {
  await sequelize.close();
});