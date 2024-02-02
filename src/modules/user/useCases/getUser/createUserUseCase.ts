import {GetUserDTO} from "./getUserDTO";
import {validateUserName} from "../../domain/valueObjects/userName";
import {getByName} from "../../repo/userRepo";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {HttpError} from "../../../../core/errors";

export async function CreateUserUseCase(request: DecodedExpressRequest<GetUserDTO, null>, response: Response) {
    const name = validateUserName(request.bodyObject.name)

    const result = await getByName(name)

    if (!result)
        throw new HttpError(404, "User not found")

    return jsonResponse(response, 200, {user: result})
}