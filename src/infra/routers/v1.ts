import {userTypes} from "../../modules/user/infra/graphql";
import {userResolvers} from "../../modules/user/infra/resolverRouter/userResolvers";

export const v1TypeDefs: string = `
    ${userTypes}
`;

export const v1Resolvers = {
    ...userResolvers
}