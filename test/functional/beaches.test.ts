import { Beach } from '@src/models/beach';
import { User } from '@src/models/user';
import { AuthService } from '@src/services/auth';
import mongoose from 'mongoose';

describe('Beaches functional tests', () => {
    const defaultUser = {
        name: 'kelvin',
        email: 'kelvin@email.com',
        password: 'kelvin123',
    };
    let token: string;
    beforeEach(async () => {
        await Beach.deleteMany({});
        await User.deleteMany({});
        const user = await new User(defaultUser).save();
        token = AuthService.generateToken(user.toJSON());
    });
    describe('When creating beach', () => {
        it('should create a beach with success', async () => {
            const newBeach = {
                lat: -33.440404,
                lng: 151.2321312,
                name: 'Navega',
                position: 'E',
            };

            const response = await global.testRequest
                .post('/beaches')
                .set({ 'x-access-token': token })
                .send(newBeach);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));
        });

        it('should throw 400 when there is a validation error', async () => {
            const newBeach = {
                lat: 'invalid_string',
                lng: 151.2321312,
                name: 'Navega',
                position: 'E',
            };
            const response = await global.testRequest
                .post('/beaches')
                .set({ 'x-access-token': token })
                .send(newBeach);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                code: 400,
                error: 'Bad Request',
                message: 'request.body.lat should be number',
            });
        });

        it('should return 500 when there is any other than validation error', async () => {
            const newBeach = {
                lat: -33.440404,
                lng: 151.2321312,
                name: 'Navega',
                position: 'E',
            };

            await mongoose.disconnect();
            const response = await global.testRequest
                .post('/beaches')
                .set({ 'x-access-token': token })
                .send(newBeach);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                code: 500,
                error: 'Internal Server Error',
                message: 'Something went wrong',
            });
        });
    });
});
