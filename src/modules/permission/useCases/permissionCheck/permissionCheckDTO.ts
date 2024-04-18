export interface PermissionCheckDTO {
    roleId: number;
    path: string;
}

export interface PermissionCheckResponseDTO {
    hasPermission: boolean;
}
