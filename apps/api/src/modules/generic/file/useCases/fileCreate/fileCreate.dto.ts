export interface FileCreateDto {
    hash: string;
    bucket: string;
    type: string;
}

export interface FileCreateResponseDto {
    insertId: number;
    message: string;
}
