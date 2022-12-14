import { User } from "@src/models/user";
import { AuthService } from "@src/services/auth";

describe('Users Functional Tests', () => {
    beforeEach(async () => await User.deleteMany({}));
    describe('When create a new User', () => {
        it('should return suceffuly create a new user with encrypted password', async () => {
            const newUser = {
                name: "kelvin",
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            const response = await global.testRequest.post('/users').send(newUser);
            expect(response.status).toBe(201);
            await expect(AuthService.comparePasswords(newUser.password, response.body.password)).resolves.toBeTruthy();
            expect(response.body).toEqual(
                expect.objectContaining({
                    ...newUser,
                    ...{ password: expect.any(String) }
                })
            );
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
    // AUTHENTICATION TESTS
    describe('When authenticating a user', () => {
        it('should generate a token for valid user', async () => {
            const newUser = {
                name: "kelvin",
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            await new User(newUser).save();
            const response = await global.testRequest.post('/users/authenticate').send({
                email: newUser.email,
                password: newUser.password
            });

            expect(response.body).toEqual(
                expect.objectContaining({ token: expect.any(String) })
            );
        });

        it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
            const response = await global.testRequest.post('/users/authenticate').send({
                email: 'some-mail@mail.com',
                password: '1234'
            });
            expect(response.status).toBe(401);
        });

        it('should return ANAUTHORIZED if the user found but the password doesn`t match', async () => {
            const newUser = {
                name: "kelvin",
                email: "kelvin@email.com",
                password: "kelvin123"
            }

            await new User(newUser).save();
            const response = await global.testRequest.post('/users/authenticate').send({
                email: newUser.email,
                password: 'different-password'
            });

            expect(response.status).toBe(401);
        });
    });
});