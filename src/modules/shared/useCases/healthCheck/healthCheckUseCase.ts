import {HttpResponse} from '../../../../core/responses';
import {HealthCheckResponseDTO} from './healthCheckDTO';
import {Ok} from "ts-results";

export async function healthCheckUseCase() {
    return Ok<HttpResponse<HealthCheckResponseDTO>>({
        data: {
            message: 'ok',
        },
    });
}
