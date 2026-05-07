import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('Job Routes Testing (Create Post + Apply Job)', () => {
	let recruiterToken: string;
	let applierToken: string;

	let categoryId: number;
	let typeId: number;

	let createdJobIdForCrud = '';
	let createdJobIdForApply = '';
	let createdApplicationId = '';

	beforeAll(async () => {
		const recruiterLoginRes = await request(app)
			.post('/auth/login-recruiter')
			.send({ email: 'recruiter1@example.com', password: 'password123' });

		expect(recruiterLoginRes.status).toBe(200);
		recruiterToken = recruiterLoginRes.body.data.accessToken;

		const applierLoginRes = await request(app)
			.post('/auth/login-applier')
			.send({ email: 'applier1@example.com', password: 'password123' });

		expect(applierLoginRes.status).toBe(200);
		applierToken = applierLoginRes.body.data.accessToken;

		const categoriesRes = await request(app).get('/job/job-categories');
		expect(categoriesRes.status).toBe(200);
		expect(Array.isArray(categoriesRes.body)).toBe(true);
		expect(categoriesRes.body.length).toBeGreaterThan(0);
		categoryId = categoriesRes.body[0].category_id;

		const typesRes = await request(app).get('/job/job-types');
		expect(typesRes.status).toBe(200);
		expect(Array.isArray(typesRes.body)).toBe(true);
		expect(typesRes.body.length).toBeGreaterThan(0);
		typeId = typesRes.body[0].type_id;
	});

	it('Get job categories', async () => {
		const res = await request(app).get('/job/job-categories');

		expect(res.status).toBe(200);
	});

	it('Get job types', async () => {
		const res = await request(app).get('/job/job-types');

		expect(res.status).toBe(200);
	});

	it('Get skills', async () => {
		const res = await request(app).get('/job/skills');

		expect(res.status).toBe(200);
	});

	it('Create a new skill and reject duplicate skill', async () => {
		const uniqueSkillName = `Job Skill ${Date.now()}`;

		const createRes = await request(app)
			.post('/job/skills')
			.send({ name: uniqueSkillName });

		expect(createRes.status).toBe(201);

		const duplicateRes = await request(app)
			.post('/job/skills')
			.send({ name: uniqueSkillName });

		expect(duplicateRes.status).toBe(409);
	});

	it('Create job post for CRUD flow', async () => {
		const res = await request(app)
			.post('/job/jobposts')
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({
				title: `Backend Engineer CRUD ${Date.now()}`,
				description: 'Job for CRUD testing',
				category_id: categoryId,
				type_id: typeId,
				skills: ['Node.js', 'TypeScript'],
				salary_min: 5000000,
				salary_max: 10000000,
				salary_type: 'monthly'
			});

		expect(res.status).toBe(201);
		expect(res.body?.data?.job_id).toBeDefined();
		createdJobIdForCrud = String(res.body.data.job_id);
	});

	it('Get all jobs', async () => {
		const res = await request(app).get('/job/jobs');

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('Get single job by ID', async () => {
		expect(createdJobIdForCrud).not.toBe('');

		const res = await request(app).get(`/job/jobs/${createdJobIdForCrud}`);

		expect(res.status).toBe(200);
	});

	it('Update job by owner recruiter', async () => {
		expect(createdJobIdForCrud).not.toBe('');

		const res = await request(app)
			.put(`/job/jobs/${createdJobIdForCrud}`)
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({
				category_id: categoryId,
				type_id: typeId,
				salary_min: 7000000,
				salary_max: 12000000,
				salary_type: 'monthly'
			});

		expect(res.status).toBe(200);
	});

	it('Reject deleting job from non-owner token', async () => {
		expect(createdJobIdForCrud).not.toBe('');

		const res = await request(app)
			.delete(`/job/jobs/${createdJobIdForCrud}`)
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(403);
	});

	it('Create job post for apply flow', async () => {
		const res = await request(app)
			.post('/job/jobposts')
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({
				title: `Backend Engineer APPLY ${Date.now()}`,
				description: 'Job for apply testing',
				category_id: categoryId,
				type_id: typeId,
				skills: ['Express', 'SQL'],
				salary_min: 4500000,
				salary_max: 9000000,
				salary_type: 'monthly'
			});

		expect(res.status).toBe(201);
		expect(res.body?.data?.job_id).toBeDefined();
		createdJobIdForApply = String(res.body.data.job_id);
	});

	it('Apply for a job', async () => {
		expect(createdJobIdForApply).not.toBe('');

		const fakePdfBase64 = Buffer.from('%PDF-1.4 test document').toString('base64');

		const res = await request(app)
			.post('/job-applications/apply')
			.set('Authorization', `Bearer ${applierToken}`)
			.send({
				job_id: createdJobIdForApply,
				cv_file: fakePdfBase64,
				cv_filename: 'cv-test.pdf',
				cv_type: 'application/pdf',
				cover_letter: 'I am interested in this role.'
			});

		expect(res.status).toBe(200);

		createdApplicationId = String(res.body.application.id);
	});

	it('Get my job applications', async () => {
		const res = await request(app)
			.get('/job-applications/my-applications')
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(200);
	});

	it('Get applications for a specific job as recruiter', async () => {
		expect(createdJobIdForApply).not.toBe('');

		const res = await request(app)
			.get(`/job-applications/job/${createdJobIdForApply}/applications`)
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(res.status).toBe(200);
	});

	it('Get recruiter job applicants summary', async () => {
		const res = await request(app)
			.get('/job-applications/job-applicants')
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(res.status).toBe(200);
	});

	it('Update application status by recruiter', async () => {
		expect(createdApplicationId).not.toBe('');

		const res = await request(app)
			.patch(`/job-applications/applications/${createdApplicationId}/status`)
			.set('Authorization', `Bearer ${recruiterToken}`)
			.send({ status: 'interviewing' });

		expect(res.status).toBe(200);
	});

	it('Download CV for application using bearer token', async () => {
		expect(createdApplicationId).not.toBe('');

		const res = await request(app)
			.get(`/job-applications/download-cv/${createdApplicationId}`)
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(res.status).toBe(200);
	});

	it('Delete application by applier', async () => {
		expect(createdApplicationId).not.toBe('');

		const res = await request(app)
			.delete(`/job-applications/delete/${createdApplicationId}`)
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(200);
	});

	it('Delete jobs by owner recruiter', async () => {
		expect(createdJobIdForCrud).not.toBe('');
		expect(createdJobIdForApply).not.toBe('');

		const deleteCrudRes = await request(app)
			.delete(`/job/jobs/${createdJobIdForCrud}`)
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(deleteCrudRes.status).toBe(200);

		const deleteApplyRes = await request(app)
			.delete(`/job/jobs/${createdJobIdForApply}`)
			.set('Authorization', `Bearer ${recruiterToken}`);

		expect(deleteApplyRes.status).toBe(200);
	});
});

afterAll(async () => {
	await sequelize.close();
});
