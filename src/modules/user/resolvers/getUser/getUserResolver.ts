import {GetUserDTO} from "./getUserDTO";
import {validateUserEmail} from "../../domain/valueObjects/userEmail";
import {getUser} from "../../repo/userRepo";
import {toPublicDomain} from "../../mapper/userMapper";

export async function getUserResolver(parent, args: GetUserDTO, context) {
    let email = null

    if (args.email)
        email = validateUserEmail(args.email)

    const result = await getUser(args.pid, email)

    if (!result)
        return null

    return toPublicDomain(result)
}