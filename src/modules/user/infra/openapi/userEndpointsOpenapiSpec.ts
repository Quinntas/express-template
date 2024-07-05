import {userCreateOpenAPISpec} from '../../useCases/userCreate/userCreateOpenAPISpec';
import {userLoginOpenAPISpec} from '../../useCases/userLogin/userLoginOpenAPISpec';

export const userEndpointsOpenapiSpec = {
    ...userCreateOpenAPISpec,
    ...userLoginOpenAPISpec,
};
