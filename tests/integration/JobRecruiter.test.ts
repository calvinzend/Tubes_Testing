import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';


describe('RECRUITER JOB FLOW', () => {
  let token: string;
  let jobId: string;

  beforeAll(async () => {
    const email = `recruiter${Date.now()}@mail.com`;
    const password = '12345678';

    await request(app).post('/auth/register-recruiter').send({
      name: 'Recruiter Test',
      email,
      password,
      companyName: 'Test Company',
      position: 'HR'
    });

    const loginRes = await request(app)
      .post('/auth/login-recruiter')
      .send({ email, password });

    token = loginRes.body.data.accessToken;
  });

  it('create job', async () => {
    const res = await request(app)
      .post('/job/jobposts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Software Engineer',
        description: 'Backend dev',
        category_id: '1',
        type_id: '1',
        skills: ['Node.js'],
        salary_min: 5000000,
        salary_max: 10000000,
        salary_type: 'monthly'
      });

    expect(res.status).toBe(201);

    jobId = res.body.data.job_id;
    expect(jobId).toBeDefined();
  });

  it('get job detail', async () => {
    const res = await request(app)
      .get(`/job/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

it('update job', async () => {
  const res = await request(app)
    .put(`/job/jobs/${jobId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Updated Title',
      category_id: '1',   
      type_id: '1'        
    });

  expect(res.status).toBe(200);
});

  it('delete job', async () => {
    const res = await request(app)
      .delete(`/job/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});


