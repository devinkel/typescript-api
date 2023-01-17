import ApiError from '../api-error';

describe('Error formatter', () => {
    it('should return error message, code, and code as string', () => {
        const error = {
            message: 'Invalid request',
            code: 400,
        };
        const expected = {
            message: 'Invalid request',
            code: 400,
            error: 'Bad Request',
        };
        expect(ApiError.format(error)).toEqual(expected);
    });

    it('should return error message, code, code as string, and documentation', () => {
        const error = {
            message: 'Invalid request',
            code: 400,
            documentation: 'https://example.com/errors/400',
        };
        const expected = {
            message: 'Invalid request',
            code: 400,
            error: 'Bad Request',
            documentation: 'https://example.com/errors/400',
        };
        expect(ApiError.format(error)).toEqual(expected);
    });

    it('should return error message, code, code as string, and description', () => {
        const error = {
            message: 'Invalid request',
            code: 400,
            documentation: 'The request is missing a required parameter',
        };
        const expected = {
            message: 'Invalid request',
            code: 400,
            error: 'Bad Request',
            documentation: 'The request is missing a required parameter',
        };
        expect(ApiError.format(error)).toEqual(expected);
    });

    describe('Error formatter', () => {
        // existing it cases ...

        it('should return error message, code, and code as string when user not found', () => {
            const error = {
                message: 'User not found',
                code: 404,
            };
            const expected = {
                message: 'User not found',
                code: 404,
                error: 'Not Found',
            };
            expect(ApiError.format(error)).toEqual(expected);
        });

        it('should return error message, code, code as string, and documentation when user not found', () => {
            const error = {
                message: 'User not found',
                code: 404,
                documentation: 'https://example.com/errors/404',
            };
            const expected = {
                message: 'User not found',
                code: 404,
                error: 'Not Found',
                documentation: 'https://example.com/errors/404',
            };
            expect(ApiError.format(error)).toEqual(expected);
        });

        it('should return error message, code, code as string, and description when user not found', () => {
            const error = {
                message: 'User not found',
                code: 404,
                description:
                    'The user with the specified ID could not be found',
            };
            const expected = {
                message: 'User not found',
                code: 404,
                error: 'Not Found',
                documentation:
                    'The user with the specified ID could not be found',
            };
            expect(ApiError.format(error)).toEqual(expected);
        });
    });
});
