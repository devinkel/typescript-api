import { Request, Response, NextFunction } from 'express';
import apiError from '@src/util/errors/api-error';

export interface HTTPError extends Error {
    status?: number;
}

export function apiErrorValidator(
    error: HTTPError,
    _: Partial<Request>,
    res: Response,
    __: NextFunction
): void {
    const errorCode = error.status || 500;
    res.status(errorCode).json(
        apiError.format({
            code: errorCode,
            message: error.message,
        })
    );
}
