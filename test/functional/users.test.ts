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
    });
});