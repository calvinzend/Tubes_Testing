import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('Experiences Routes Testing', () => {
	let applierToken: string;
	let recruiterToken: string;
	let applierId: string;
	let recruiterId: string;
	let applierExperienceId = '';
	let recruiterExperienceId = '';

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

	it('Get applier experiences by query ID', async () => {
		const res = await request(app)
			.get(`/experiences/appliers-experiences?applier_id=${applierId}`);

		expect(res.status).toBe(200);
	});

	it('Add applier experience', async () => {
		const res = await request(app)
			.post('/experiences/appliers-experiences')
			.set('Authorization', `Bearer ${applierToken}`)
			.send({
				applier_id: applierId,
				company_name: 'ITHB Tech',
				job_title: 'Backend Developer',
				start_date: '2023-01-01',
				end_date: '2023-12-31',
				description: 'Building APIs',
			});

		expect(res.status).toBe(200);
	});

	it('Update applier experience', async () => {
		expect(applierExperienceId).not.toBe('');

		const res = await request(app)
			.put(`/experiences/appliers-experiences/${applierExperienceId}`)
			.set('Authorization', `Bearer ${applierToken}`)
			.send({
				company_name: 'ITHB Tech Updated',
				job_title: 'Senior Backend Developer',
				end_date: '2024-01-31',
				description: 'Updated description',
			});

		expect(res.status).toBe(200);
	});

	it('Get applier experience statistics', async () => {
		const res = await request(app)
			.get(`/experiences/appliers-stats/${applierId}`);

		expect(res.status).toBe(200);
	});

	it('Delete applier experience', async () => {
		expect(applierExperienceId).not.toBe('');

		const res = await request(app)
			.delete(`/experiences/appliers-experiences/${applierExperienceId}`)
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(200);
	});

	it('Get recruiter experiences by query ID', async () => {
		const res = await request(app)
			.get(`/experiences/recruiters-experiences?recruiter_id=${recruiterId}`);

		expect(res.status).toBe(200);
	});

	it('Add recruiter experience', async () => {
		const res = await request(app)
			.post('/experiences/recruiters-experiences')
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({
				recruiter_id: recruiterId,
				company_name: 'ITHB Recruiter Corp',
				job_title: 'Tech Recruiter',
				start_date: '2022-01-01',
				end_date: '2022-12-31',
				description: 'Hiring engineers',
			});

		expect(res.status).toBe(200);
	});

	it('Update recruiter experience', async () => {
		expect(recruiterExperienceId).not.toBe('');

		const res = await request(app)
			.put(`/experiences/recruiters-experiences/${recruiterExperienceId}`)
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({
				company_name: 'ITHB Recruiter Corp Updated',
				job_title: 'Senior Tech Recruiter',
				end_date: '2023-01-31',
				description: 'Updated recruiter description',
			});

		expect(res.status).toBe(200);
	});

	it('Get recruiter experience statistics', async () => {
		const res = await request(app)
			.get(`/experiences/recruiters-stats/${recruiterId}`);

		expect(res.status).toBe(200);
	});

	it('Delete recruiter experience', async () => {
		expect(recruiterExperienceId).not.toBe('');

		const res = await request(app)
			.delete(`/experiences/recruiters-experiences/${recruiterExperienceId}`)
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(res.status).toBe(200);
	});
});

afterAll(async () => {
	await sequelize.close();
});
