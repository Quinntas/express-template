export interface HasPermissionDTO {
    roleId: number;
    path: string;
}

export interface HasPermissionResponseDTO {
    hasPermission: boolean;
}
