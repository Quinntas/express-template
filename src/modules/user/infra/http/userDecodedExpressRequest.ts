import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";

export interface UserDecodedExpressRequest<iBody extends object | null, iQuery extends object | null> extends DecodedExpressRequest<iBody, iQuery> {
    user: {
        pid: string,
        id: number,
        email: string
    }
}

