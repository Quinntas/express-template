export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    expiresIn: number;
    expireDate: number;
}

export interface PublicLoginToken {
    userPid: string;
    exp: number;
}

export interface PrivateLoginToken {
    userPid: string;
    userEmail: string;
    userId: number;
    exp: number;
}
