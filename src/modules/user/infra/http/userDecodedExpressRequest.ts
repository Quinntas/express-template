import {DecodedExpressRequest} from "../../../../types/decodedExpressRequest";

export interface UserDecodedExpressRequest<iBody extends object, iQuery extends object> extends DecodedExpressRequest<iBody, iQuery> {
    user: {
        pid: string,
        id: number
    }
}

