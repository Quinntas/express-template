import {Ok} from 'ts-results';
import {HttpResponse} from '../../../../lib/web/responses';
import {HealthCheckResponseDTO} from './healthCheck.dto';

export async function healthCheckUsecase() {
    return Ok<HttpResponse<HealthCheckResponseDTO>>({
        data: {
            message: 'ok',
        },
    });
}
