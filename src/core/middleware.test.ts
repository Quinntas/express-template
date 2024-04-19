import {Response} from 'express';
import {describe, expect, it, vi} from 'vitest';
import {DecodedExpressRequest} from '../types/decodedExpressRequest';
import {handleMiddleware} from './middleware';

describe('handleMiddleware', () => {
    it('should execute middleware successfully', async () => {
        const next = vi.fn();
        const middleware = vi.fn();

        const req: DecodedExpressRequest<null, null> = {
            method: 'get',
            bodyObject: {},
            queryObject: {},
        } as any;

        const res: Response = {} as any;

        await handleMiddleware(req, res, next, middleware);

        expect(middleware).toBeCalled();
        expect(middleware).toBeCalledWith(req, res, next);
        expect(next).not.toBeCalled();
    });

    it('should handle error thrown by middleware', async () => {
        const next = vi.fn();
        const middleware = vi.fn(() => {
            throw new Error('middleware error');
        });

        const req: DecodedExpressRequest<null, null> = {
            method: 'get',
            bodyObject: {},
            queryObject: {},
        } as any;

        const res: Response = {} as any;

        try {
            await handleMiddleware(req, res, next, middleware);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        expect(middleware).toBeCalled();
        expect(middleware).toBeCalledWith(req, res, next);
        expect(next).not.toBeCalled();
    });
});
