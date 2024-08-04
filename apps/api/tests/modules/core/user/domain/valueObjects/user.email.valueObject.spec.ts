import {UserEmail} from '../../../../../../src/modules/core/user/domain/valueObjects/user.email.valueObject';

describe('UserEmailValueObject', () => {
    it('should create a valid email', () => {
        const email = 'caio@gmail.com';
        const res = UserEmail.validate(email);
        expect(res.ok).toBeTruthy();
    });

    it('should create a invalid email', () => {
        const email = 'caiogmail.com';
        const res = UserEmail.validate(email);
        expect(res.err).toBeTruthy();
    });
});
