import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('APPLIER JOB FLOW', () => {
    let token: string;
    let jobId: string;
    let applicationId: string;
    let createdJobIdForCrud = '';
    let createdJobIdForApply = '';
    let createdApplicationId = '';
    const fakePdfBase64 = Buffer.from('%PDF-1.4 test document').toString('base64');

    beforeAll(async () => {
        const email = `applier${Date.now()}@mail.com`;
        const password = '12345678';

        await request(app).post('/auth/register-applier').send({
            name: 'Applier Test',
            email,
            password
        });

        const loginRes = await request(app)
            .post('/auth/login-applier')
            .send({ email, password });

        token = loginRes.body.data.accessToken;

        const recruiterEmail = `rec${Date.now()}@mail.com`;

        await request(app).post('/auth/register-recruiter').send({
            name: 'Recruiter Test',
            email: recruiterEmail,
            password: '12345678',
            companyName: 'Test Company',
            position: 'HR'
        });

        const recLogin = await request(app)
            .post('/auth/login-recruiter')
            .send({ email: recruiterEmail, password: '12345678' });

        const recToken = recLogin.body.data.accessToken;

        const jobRes = await request(app)
            .post('/job/jobposts')
            .set('Authorization', `Bearer ${recToken}`)
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

        jobId = jobRes.body.data?.job_id || jobRes.body.jobPost?.job_id;
    });

    it('apply job', async () => {
        const res = await request(app)
            .post('/job-applications/apply')
            .set('Authorization', `Bearer ${token}`)
            .send({
                job_id: jobId,
				cv_file: fakePdfBase64,
				cv_filename: 'cv-test.pdf',
				cv_type: 'application/pdf',
				cover_letter: 'I am interested in this role.'
            });

        console.log('ISI RESPONSE:', JSON.stringify(res.body, null, 2));
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        applicationId = res.body.application.id;
    });

    it('get my applications', async () => {
        const res = await request(app)
            .get('/job-applications/my-applications')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });


    it('get job detail', async () => {
        const res = await request(app)
            .get(`/job/jobs/${jobId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.job_id).toBe(jobId);
    });


    it('cancel apply', async () => {
        const res = await request(app)
            .delete(`/job-applications/delete/${applicationId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});