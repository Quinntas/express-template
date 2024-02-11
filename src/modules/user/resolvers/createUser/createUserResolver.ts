import {CreateUserDTO} from "./createUserDTO";
import {v4} from 'uuid'
import {validateUserEmail} from "../../domain/valueObjects/userEmail";
import {validateUserPassword} from "../../domain/valueObjects/userPassword";
import {createUser} from "../../repo/userRepo";

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