import {Response} from 'express';
import {expect, test, vi} from 'vitest';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {healthCheckUseCase} from './healthCheckUseCase';

vi.mock('../../../../core/responses', () => ({
    jsonResponse: vi.fn(),
}));

test('healthCheckUseCase - Successful health check', async () => {
    const mockReq: DecodedExpressRequest<null, null> = {} as DecodedExpressRequest<null, null>;
    const mockRes: Response = {} as Response;

    await healthCheckUseCase(mockReq, mockRes);

    expect(jsonResponse).toHaveBeenCalledWith(mockRes, 200, {message: 'ok'});
});
