import {HasPermissionDTO, HasPermissionResponseDTO} from "./hasPermissionDTO";
import {permissionRepo} from "../../repo/permissionRepo";
import {objectResponse} from "../../../../core/responses";

export async function hasPermissionUseCase(request: HasPermissionDTO) {
    const res = await permissionRepo.findByRoleIdAndPath(request.roleId, request.path);

    if (!res)
        return objectResponse<HasPermissionResponseDTO>({
            hasPermission: false
        })

    return objectResponse<HasPermissionResponseDTO>({
        hasPermission: true
    })
}