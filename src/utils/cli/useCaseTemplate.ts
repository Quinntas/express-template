export function useCaseTemplate(useCase: string): string {
    const useCaseName = useCase.charAt(0).toUpperCase() + useCase.slice(1);
    const useCaseNameLowerFirst = useCase.charAt(0).toLowerCase() + useCase.slice(1);

    return `import {Response} from 'express';
import {jsonResponse} from '../../../../core/responses';
import {DecodedExpressRequest} from '../../../../types/decodedExpressRequest';
import {${useCaseName}DTO, ${useCaseName}ResponseDTO} from './${useCaseNameLowerFirst}DTO';

export async function ${useCaseNameLowerFirst}UseCase(request: DecodedExpressRequest<${useCaseName}DTO, null>, response: Response) {
    return jsonResponse<${useCaseName}ResponseDTO>(response, 200, {message: 'ok'});
}
`;
}
