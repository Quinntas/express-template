import {User} from "../../domain/user";

export interface GetUserDTO {
    name: string | null;
    email: string | null;
}

export interface GetUserResponseDTO {
    user: Omit<User, "password">
}