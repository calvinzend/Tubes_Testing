import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('Skills Routes Testing', () => {
	let applierToken: string;
	let applierId: string;
	let createdSkillId: number;

	beforeAll(async () => {
		const applierLoginRes = await request(app)
			.post('/auth/login-applier')
			.send({ email: 'applier1@example.com', password: 'password123' });

		expect(applierLoginRes.status).toBe(200);
		applierToken = applierLoginRes.body.data.accessToken;
		applierId = applierLoginRes.body.data.user.user_id;
	});

	it('Get applier skills by applier_id in request body', async () => {
		const res = await request(app)
			.get('/skills/appliers-skills')
			.send({ applier_id: applierId });

		expect(res.status).toBe(200);
	});

	it('Reject get applier skills when applier_id is missing', async () => {
		const res = await request(app).get('/skills/appliers-skills');

		expect(res.status).toBe(500);
	});

	it('Create applier skills with auth token', async () => {
		const uniqueSkillName = `Skill Route Test ${Date.now()}`;

		const res = await request(app)
			.post('/skills/appliers-skills/create')
			.set('Authorization', `Bearer ${applierToken}`)
			.send([uniqueSkillName]);

		expect(res.status).toBe(200);

		const getSkillsRes = await request(app)
			.get('/skills/appliers-skills')
			.send({ applier_id: applierId });

		expect(getSkillsRes.status).toBe(200);

		const createdSkill = (getSkillsRes.body.data as Array<{ skill_id: number; name: string }>).find(
			(skill) => skill.name === uniqueSkillName
		);

		expect(createdSkill).toBeDefined();
		createdSkillId = createdSkill!.skill_id;
	});

	it('Reject create applier skills when token is missing', async () => {
		const res = await request(app)
			.post('/skills/appliers-skills/create')
			.send([`Skill Without Token ${Date.now()}`]);

		expect(res.status).toBe(401);
		expect(res.body.message).toBe('No token provided');
	});

	it('Delete applier skill by skill_id', async () => {
		expect(createdSkillId).toBeDefined();

		const res = await request(app)
			.delete(`/skills/appliers-skills/${createdSkillId}`)
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(200);
		expect(res.body.message).toBe('Skill removed successfully.');
	});

	it('Reject delete applier skill with invalid skill_id', async () => {
		const res = await request(app)
			.delete('/skills/appliers-skills/not-a-number')
			.set('Authorization', `Bearer ${applierToken}`);

		expect(res.status).toBe(500);
		expect(res.body.message).toBe('Invalid request parameters.');
	});
});

afterAll(async () => {
	await sequelize.close();
});
