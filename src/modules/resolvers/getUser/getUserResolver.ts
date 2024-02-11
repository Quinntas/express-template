import {GetUserDTO} from "./getUserDTO";
import {validateUserEmail} from "../../user/domain/valueObjects/userEmail";
import {getUser} from "../../user/repo/userRepo";
import {toPublicDomain} from "../../user/mapper/userMapper";

export async function getUserResolver(parent, args: GetUserDTO, context) {
    let email = null

    if (args.email)
        email = validateUserEmail(args.email)

    const result = await getUser(args.pid, email)

    if (!result)
        return null

    return toPublicDomain(result)
}