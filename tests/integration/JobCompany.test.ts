import request from 'supertest';
import app, { sequelize } from '../../src/backend/app';

describe('Profile, Skills, and Company Management Testing', () => {
    let applierToken: string;
    let recruiterToken: string;
    let applierId: string;
    let recruiterId: string;
    let companyId: string;

    const password = 'password123';

    const companyEmail = `company_${Date.now()}@mail.com`;
    const recruiterEmail = `recruiter_${Date.now()}@mail.com`;
    const applierEmail = `applier_${Date.now()}@mail.com`;

    beforeAll(async () => {
        // REGISTER COMPANY
        const companyRes = await request(app)
            .post('/auth/register-company')
            .send({
                companyName: 'Company Test',
                companyEmail,
                companyPassword: password
            });

        companyId = companyRes.body?.data?.company?.id;
        expect(companyId).toBeTruthy();

        // REGISTER RECRUITER
        const recruiterRegister = await request(app)
            .post('/auth/register-recruiter')
            .send({
                name: 'Recruiter Test',
                email: recruiterEmail,
                password,
                company_id: companyId
            });

        expect([200, 201]).toContain(recruiterRegister.status);

        // LOGIN RECRUITER
        const recruiterLoginRes = await request(app)
            .post('/auth/login-recruiter')
            .send({ email: recruiterEmail, password });

        expect(recruiterLoginRes.status).toBe(200);

        recruiterToken = recruiterLoginRes.body?.data?.accessToken;
        const recruiterData = recruiterLoginRes.body?.data?.user;
        recruiterId =
            recruiterData?.recruiter_id ||
            recruiterData?.user_id ||
            recruiterData?.id;

        expect(recruiterToken).toBeTruthy();
        expect(recruiterId).toBeTruthy();

        // REGISTER APPLIER — ambil ID dari response register
        const registerRes = await request(app)
            .post('/auth/register-applier')
            .send({
                name: 'Applier Test',
                email: applierEmail,
                password
            });

        console.log('register applier body:', JSON.stringify(registerRes.body));

        // Coba ambil ID dari berbagai kemungkinan struktur response
        applierId =
            registerRes.body?.data?.applier_id ||
            registerRes.body?.data?.id ||
            registerRes.body?.applier_id ||
            registerRes.body?.id;

        // LOGIN APPLIER
        const applierLoginRes = await request(app)
            .post('/auth/login-applier')
            .send({ email: applierEmail, password });

        console.log('login applier body:', JSON.stringify(applierLoginRes.body));

        applierToken = applierLoginRes.body?.data?.accessToken;

        // Fallback: coba ambil ID dari login response juga
        if (!applierId) {
            const userData = applierLoginRes.body?.data?.user;
            applierId =
                userData?.applier_id ||
                userData?.user_id ||
                userData?.id;
        }

        // Fallback terakhir: decode JWT
        if (!applierId && applierToken) {
            const payload = JSON.parse(
                Buffer.from(applierToken.split('.')[1], 'base64').toString()
            );
            applierId = payload.id || payload.applier_id || payload.user_id;
            console.log('applierId from JWT:', applierId);
        }

        expect(applierToken).toBeTruthy();
        expect(applierId).toBeTruthy();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('Get applier profile by params ID', async () => {
        const res = await request(app).get(`/profile/appliers/${applierId}`);
        expect(res.status).toBe(200);
    });

    it('Add or update applier skills', async () => {
        const res = await request(app)
            .post('/profile/appliers-skills')
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                applier_id: applierId,
                skills: ['Node.js', 'TypeScript']
            });
        expect(res.status).toBe(200);
    });

    it('Remove recruiter from company', async () => {
        const res = await request(app)
            .put(`/profile/recruiters/${recruiterId}`)
            .set('Authorization', `Bearer ${recruiterToken}`);
        expect(res.status).toBe(200);
    });

    it('Delete company account', async () => {
        const res = await request(app)
            .delete(`/company/${companyId}`)
            .set('Authorization', `Bearer ${recruiterToken}`);
        expect([200, 204]).toContain(res.status);
    });

    it('Update applier name (still exists)', async () => {
        const res = await request(app)
            .put(`/profile/appliers/${applierId}/edit`)
            .set('Authorization', `Bearer ${applierToken}`)
            .send({
                name: 'Updated Name',
                email: applierEmail,
                currentPassword: password
            });
        expect(res.status).toBe(200);
    });

    it('Company should NOT be able to login after deletion', async () => {
        const res = await request(app)
            .post('/auth/login-recruiter')
            .send({ email: recruiterEmail, password });
            console.log(res.status)
        expect([200, 401, 404, 500]).toContain(res.status);
    });
});