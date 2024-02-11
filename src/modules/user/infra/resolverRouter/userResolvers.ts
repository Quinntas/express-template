import {handleResolver} from "../../../../core/resolverHandler";
import {createUserResolver} from "../../../resolvers/createUser/createUserResolver";
import {getUserResolver} from "../../../resolvers/getUser/getUserResolver";

export const userResolvers = {
    Mutation: {
        createUser: (parent, args, context) => handleResolver(parent, args, context, createUserResolver),
    },

    Query: {
        getUser: (parent, args, context) => handleResolver(parent, args, context, getUserResolver),
    }
}