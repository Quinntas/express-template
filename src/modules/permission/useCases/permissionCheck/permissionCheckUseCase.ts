import {objectResponse} from '../../../../core/responses';
import {permissionRepo} from '../../repo/permissionRepo';
import {PermissionCheckDTO, PermissionCheckResponseDTO} from './permissionCheckDTO';

export async function permissionCheckUseCase(request: PermissionCheckDTO) {
    const res = await permissionRepo.findByRoleIdAndPath(request.roleId, request.path);

    if (!res)
        return objectResponse<PermissionCheckResponseDTO>({
            hasPermission: false,
        });

    return objectResponse<PermissionCheckResponseDTO>({
        hasPermission: true,
    });
}
