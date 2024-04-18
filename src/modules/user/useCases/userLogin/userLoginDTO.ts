export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface UserLoginResponseDTO {
    token: string;
    expiresIn: number;
    expireDate: number;
}

export interface PublicLoginToken {
    userPid: string;
}

export interface PrivateLoginToken {
    userPid: string;
    userEmail: string;
    userId: number;
    roleId: number;
}
