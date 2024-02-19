import {GetUserDTO, GetUserResponseDTO} from "./getUserDTO";
import {getUser} from "../../repo/userRepo";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {HttpError} from "../../../../core/errors";
import {toPublicDomain} from "../../mapper/userMapper";
import {validateUserName} from "../../domain/valueObjects/userName";
import {validateUserEmail} from "../../domain/valueObjects/userEmail";

export async function GetUserUseCase(request: DecodedExpressRequest<null, GetUserDTO>, response: Response) {
    let name: string | null = null
    let email: string | null = null

    if (request.queryObject.name)
        name = validateUserName(request.queryObject.name)

    if (request.queryObject.email)
        email = validateUserEmail(request.queryObject.email)

    const result = await getUser(name, email)

    if (!result)
        throw new HttpError(404, "User not found")

    return jsonResponse<GetUserResponseDTO>(
        response,
        200,
        {user: toPublicDomain(result)}
    )
}