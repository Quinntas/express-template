import {GetUserDTO, GetUserResponseDTO} from "./getUserDTO";
import {getUser} from "../../repo/userRepo";
import {jsonResponse} from "../../../../core/responses";
import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";
import {Response} from "express";
import {HttpError} from "../../../../core/errors";
import {toPublicDomain} from "../../mapper/userMapper";

export async function GetUserUseCase(request: DecodedExpressRequest<GetUserDTO, null>, response: Response) {
    const result = await getUser(request.bodyObject.name, request.bodyObject.email)

    if (!result)
        throw new HttpError(404, "User not found")

    return jsonResponse<GetUserResponseDTO>(
        response,
        200,
        {user: toPublicDomain(result)}
    )
}