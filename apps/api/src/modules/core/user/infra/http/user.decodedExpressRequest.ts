import {DecodedExpressRequest} from '../../../../../lib/types/decodedExpressRequest';
import {User} from '../../domain/user';

export interface UserDecodedExpressRequest<iBody extends object | null, iQuery extends object | null> extends DecodedExpressRequest<iBody, iQuery> {
    user: User;
}
