import {UserPassword} from '../../../../../../src/modules/core/user/domain/valueObjects/user.password.valueObject';

describe('UserPasswordValueObject', () => {
    it('should create a valid password', () => {
        const pass = '12345678';
        const res = UserPassword.validate(pass);
        expect(res.ok).toBeTruthy();
    });

    it('should create a invalid password', () => {
        const pass = '1234567';
        const res = UserPassword.validate(pass);
        expect(res.err).toBeTruthy();
    });
});
