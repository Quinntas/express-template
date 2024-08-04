import {User} from '../../domain/user';

export interface UserLoginDto {
    email: string;
    password: string;
}

export interface UserLoginResponseDTO {
    token: string;
    expiresIn: number;
    expireDate: number;
}

export interface PublicLoginToken {
    user: {
        pid: string;
    };
}

export interface PrivateLoginToken {
    user: User;
}
