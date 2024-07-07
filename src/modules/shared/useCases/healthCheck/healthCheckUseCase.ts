import {Ok} from 'ts-results';
import {HttpResponse} from '../../../../core/responses';
import {HealthCheckResponseDTO} from './healthCheckDTO';

export async function healthCheckUseCase() {
    return Ok<HttpResponse<HealthCheckResponseDTO>>({
        data: {
            message: 'ok',
        },
    });
}
