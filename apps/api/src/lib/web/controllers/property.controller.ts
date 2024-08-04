import {Err, Ok} from 'ts-results';
import {UseCaseFunction} from '../../ddd/useCase';
import {ControllerFunction} from '../controller';
import {HttpResponse} from '../responses';

export async function propertyController(
    useCase: UseCaseFunction<
        {
            value: any;
            property: string;
        },
        any
    >,
): Promise<ControllerFunction<any>> {
    return async (req) => {
        const property = req.params['property'];
        if (!property) return Err(new Error('property is required'));
        const value = req.body['value'];
        if (!value) return Err(new Error('value is required'));
        const result = await useCase({
            data: {
                property,
                value,
            },
        });
        if (!result.ok) return Err(result.val);
        return Ok<HttpResponse<null>>({
            data: null,
            statusCode: 204,
        });
    };
}
