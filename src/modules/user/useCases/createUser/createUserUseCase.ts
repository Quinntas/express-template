import {CreateUserDTO} from "./createUserDTO";
import {validateUserName} from "../../domain/valueObjects/userName";
import {validateUserEmail} from "../../domain/valueObjects/userEmail";
import {validateUserPassword} from "../../domain/valueObjects/userPassword";
import {userRepo} from "../../repo/userRepo";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {HttpError} from "../../../../core/errors";
import {encrypt} from "../../../../utils/encryption";
import {v4} from "uuid";

export async function CreateUserUseCase(request: DecodedExpressRequest<CreateUserDTO, null>, response: Response) {
    const name = validateUserName(request.bodyObject.name!)
    const email = validateUserEmail(request.bodyObject.email!)
    const password = validateUserPassword(request.bodyObject.password!)

    const result = await userRepo.insert({
        pid: v4(),
        name,
        email,
        password: encrypt(password)
    })

    if (!result)
        throw new HttpError(500, "Error creating user")

    return jsonResponse(response, 201, {message: "User created successfully"})
}