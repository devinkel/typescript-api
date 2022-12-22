import { User } from "@src/models/user";

describe('Users Functional Tests', () => {
    beforeEach(async () => await User.deleteMany({}));
    describe('When create a new User', () => {
        it('should return suceffuly create a new user', async () => {
            const newUser = {
                name: "kelvin",
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            const response = await global.testRequest.post('/users').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining(newUser));
        })

        it('should return 422 when there is a validation error', async () => {
            const newUser = {
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            const response = await global.testRequest.post('/users').send(newUser);
            expect(response.body).toEqual({
                code: 422,
                error: 'User validation failed: name: Path `name` is required.'
            });
        });

        it('should return 409 when the email already exists', async () => {
            const newUser = {
                name: "kelvin",
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            await global.testRequest.post('/users').send(newUser);
            const response = await global.testRequest.post('/users').send(newUser);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                code: 409,
                error: 'User validation failed: email: already exists in the database'
            });
        });
    });
});