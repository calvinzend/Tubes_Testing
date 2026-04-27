import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('Profile and Skills Testing', () => {
    let applierToken: string;
    let recruiterToken: string;
    let applierId: string;
    let recruiterId: string;
    let createdExperienceId = '';

    beforeAll(async () => {
        const applierLoginRes = await request(app)
            .post('/auth/login-applier')
            .send({ email: 'applier1@example.com', password: 'password123' });

        expect(applierLoginRes.status).toBe(200);
        applierToken = applierLoginRes.body.data.accessToken;
        applierId = applierLoginRes.body.data.user.user_id;

        const recruiterLoginRes = await request(app)
            .post('/auth/login-recruiter')
            .send({ email: 'recruiter1@example.com', password: 'password123' });

        expect(recruiterLoginRes.status).toBe(200);
        recruiterToken = recruiterLoginRes.body.data.accessToken;
        recruiterId = recruiterLoginRes.body.data.user.user_id;
    });

    it('Get applier profile by query ID', async () => {
        const res = await request(app)
            .get(`/profile/appliers?applier_id=${applierId}`);

        expect(res.status).toBe(200);
    });

    it('Get applier profile by params ID', async () => {
        const res = await request(app)
            .get(`/profile/appliers/${applierId}`);

        expect(res.status).toBe(200);
    });

    it('Get recruiter profile by params ID', async () => {
        const res = await request(app)
            .get(`/profile/recruiters/${recruiterId}`);

        expect(res.status).toBe(200);
    });

    it('Get recruiter profile by query ID', async () => {
        const res = await request(app)
            .get(`/profile/recruiters?recruiter_id=${recruiterId}`);

        expect(res.status).toBe(200);
    });

    it('Get applier skills', async () => {
        const res = await request(app)
            .get(`/profile/appliers-skills?applier_id=${applierId}`);

        expect(res.status).toBe(200);
    });

    it('Add or update applier skills', async () => {
        const skillNames = [
            `Testing Skill ${Date.now()}`,
            `Testing Skill ${Date.now() + 1}`,
        ];

        const res = await request(app)
            .post('/profile/appliers-skills')
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                applier_id: applierId,
                skills: skillNames,
            });

        expect(res.status).toBe(200);
    });

    it('Add experience for applier', async () => {
        const res = await request(app)
            .post('/profile/experiences')
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                user_type: 'applier',
                user_id: applierId,
                company_name: 'ITHB Tech',
                job_title: 'Backend Developer',
                start_date: '2023-01-01',
                description: 'Developing awesome APIs',
            });

        expect(res.status).toBe(200);
        expect(res.body.data.experience_id).toBeDefined();
        createdExperienceId = res.body.data.experience_id;
    });

    it('Get experiences by user type and user ID', async () => {
        const res = await request(app)
            .get(`/profile/experiences?user_type=applier&user_id=${applierId}`);

        expect(res.status).toBe(200);
    });

    it('Update experience by experience ID', async () => {
        expect(createdExperienceId).not.toBe('');

        const res = await request(app)
            .put(`/profile/experiences/${createdExperienceId}`)
            .send({
                company_name: 'ITHB Tech Updated',
                job_title: 'Senior Backend Developer',
                end_date: '2024-01-01',
                description: 'Updated description for testing',
            });

        expect(res.status).toBe(200);
    });

    it('Delete experience by experience ID', async () => {
        expect(createdExperienceId).not.toBe('');

        const res = await request(app)
            .delete(`/profile/experiences/${createdExperienceId}`);

        expect(res.status).toBe(200);
    });

    it('Update recruiter company association removal', async () => {
        const res = await request(app)
            .put(`/profile/recruiters/${recruiterId}`)
            .set('Authorization', `Bearer ${recruiterToken}`);

        expect(res.status).toBe(200);
    });

    it('Update applier name', async () => {
        const res = await request(app)
            .put(`/profile/appliers/${applierId}/edit`)
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                name: 'Applier one',
                email: 'applier1@example.com',
                currentPassword: 'password123',
            });

        expect(res.status).toBe(200);
    });

    it('Update applier email', async () => {
        const res = await request(app)
            .put(`/profile/appliers/${applierId}/edit`)
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                name: 'Applier 1',
                email: 'applierone@example.com',
                currentPassword: 'password123',
            });

        expect(res.status).toBe(200);
    });

    it('Update applier password', async () => {
        const newPassword = 'password123';
        const res = await request(app)
            .put(`/profile/appliers/${applierId}/edit`)
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                name: 'Applier 1',
                email: 'applier1@example.com',
                currentPassword: 'password123',
                password: newPassword,
            });
        expect(res.status).toBe(200);
    });

    it('Update recruiter name', async () => {
        const res = await request(app)
            .put(`/profile/recruiters/${recruiterId}/edit`)
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                name: 'Recruiter one',
                email: 'recruiter1@example.com',
                currentPassword: 'password123',
            });

        expect(res.status).toBe(200);
    });

    it('Update recruiter email', async () => {
        const res = await request(app)
            .put(`/profile/recruiters/${recruiterId}/edit`)
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                name: 'Recruiter 1',
                email: 'recruiterone@example.com',
                currentPassword: 'password123',
            });

        expect(res.status).toBe(200);
    });

    it('Update recruiter password', async () => {
        const newPassword = 'password123';
        const res = await request(app)
            .put(`/profile/recruiters/${recruiterId}/edit`)
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                name: 'Recruiter 1',
                email: 'recruiter1@example.com',
                currentPassword: 'password123',
                password: newPassword,
            });
        expect(res.status).toBe(200);
    });

    it('Update applier about information', async () => {
        const aboutText = 'null';

        const res = await request(app)
            .post(`/profile/appliers/${applierId}/about`)
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                about: aboutText,
            });

        expect(res.status).toBe(200);
    });

    it('Update recruiter about information', async () => {
        const aboutText = 'null';

        const res = await request(app)
            .post(`/profile/recruiters/${recruiterId}/about`)
            .set('Authorization', `Bearer ${recruiterToken}`)
            .send({
                about: aboutText,
            });

        expect(res.status).toBe(200);
    });
});

afterAll(async () => {
    await sequelize.close();
});
