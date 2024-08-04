export interface UserCreateDto {
    email: string;
    password: string;
}

export interface UserCreateResponseDTO {
    insertId: number;
    message: string;
}
