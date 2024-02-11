import {CreateUserDTO} from "./createUserDTO";
import {validateUserEmail} from "../../user/domain/valueObjects/userEmail";
import {validateUserPassword} from "../../user/domain/valueObjects/userPassword";
import {createUser} from "../../user/repo/userRepo";
import {v4} from 'uuid'

export async function createUserResolver(parent, args: CreateUserDTO, context) {
    const email = validateUserEmail(args.email)
    const password = validateUserPassword(args.password)

    await createUser({
        pid: v4(),
        email,
        password
    })

    return "User created successfully!"
}