import {Response} from 'express';
import {expect, test, vi} from 'vitest';
import {HttpError} from '../../../../core/errors';
import {jsonResponse} from '../../../../core/responses';
import {redisClient} from '../../../../infra/database/redis';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {jwtSign} from '../../../../utils/jsonWebToken';
import {userRepo} from '../../repo/userRepo';
import {UserLoginDTO} from './userLoginDTO';
import {userLoginUseCase} from './userLoginUseCase';

vi.mock('../../../../utils/env', () => ({
    env: {},
}));

vi.mock('../../../../core/responses', () => {
    return {
        jsonResponse: vi.fn(),
    };
});

vi.mock('../../../../utils/jsonWebToken', () => {
    return {
        jwtSign: vi.fn().mockReturnValue('mocked-jwt-token'),
    };
});

vi.mock('../../../../utils/encryption', () => {
    return {
        encrypt: vi.fn().mockReturnValue('password123'),
        parseEncryptedString: vi.fn().mockReturnValue({
            iterations: 10000,
            salt: 'mocked-salt',
            hash: 'encrypted-password',
        }),
        compare: vi.fn().mockImplementation((a: string, b: string) => a === b),
    };
});

vi.mock('../../../../infra/database/redis', () => {
    return {
        redisClient: {
            set: vi.fn(),
        },
    };
});

vi.mock('../../repo/userRepo', () => {
    class UserRepo {
        selectByEmail = vi.fn().mockImplementation((email: string) => {
            if (email === 'test@example.com')
                return {
                    id: 1,
                    pid: 'mocked-user-pid',
                    name: 'Test User',
                    email: email,
                    password: 'password123',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                };
            return null;
        });
    }

    return {
        UserRepo: UserRepo,
        userRepo: new UserRepo(),
    };
});

test('LoginUseCase - Successful login', async () => {
    const email = 'test@example.com';

    const mockReq: DecodedExpressRequest<UserLoginDTO, null> = {
        bodyObject: {
            email,
            password: 'password123',
        },
    } as DecodedExpressRequest<UserLoginDTO, null>;
    const mockRes: Response = {} as Response;

    await userLoginUseCase(mockReq, mockRes);

    expect(jsonResponse).toHaveBeenCalledWith(mockRes, 200, {
        token: 'mocked-jwt-token',
        expiresIn: expect.any(Number),
        expireDate: expect.any(Number),
    });

    expect(userRepo.selectByEmail).toHaveBeenCalledWith(email);

    expect(jwtSign).toBeCalledTimes(2);

    expect(jwtSign).toHaveBeenCalledWith(
        {
            userPid: expect.any(String),
        },
        {
            expiresIn: expect.any(Number),
        },
    );

    expect(jwtSign).toHaveBeenCalledWith(
        {
            userPid: expect.any(String),
            userEmail: expect.any(String),
            userId: expect.any(Number),
        },
        {
            expiresIn: expect.any(Number),
        },
    );

    // TODO: fix this to actually check the key value
    expect(redisClient.set).toHaveBeenCalledWith(expect.any(String), 'mocked-jwt-token', expect.any(Number));
});

test('LoginUseCase - User not found', async () => {
    const email = 'test2@example.com';

    const mockReq: DecodedExpressRequest<UserLoginDTO, null> = {
        bodyObject: {
            email,
            password: 'password123',
        },
    } as DecodedExpressRequest<UserLoginDTO, null>;
    const mockRes: Response = {} as Response;

    try {
        await userLoginUseCase(mockReq, mockRes);
    } catch (e) {
        const isErrorInstance = e instanceof HttpError;
        expect(isErrorInstance).toBe(true);
        if (isErrorInstance) expect(e.code).toBe(404);
    }
});

test('LoginUseCase - Invalid usernane or password', async () => {
    const email = 'test@example.com';

    const mockReq: DecodedExpressRequest<UserLoginDTO, null> = {
        bodyObject: {
            email,
            password: 'password1234',
        },
    } as DecodedExpressRequest<UserLoginDTO, null>;
    const mockRes: Response = {} as Response;

    try {
        await userLoginUseCase(mockReq, mockRes);
    } catch (e) {
        const isErrorInstance = e instanceof HttpError;
        expect(isErrorInstance).toBe(true);
        if (isErrorInstance) expect(e.code).toBe(401);
    }
});
