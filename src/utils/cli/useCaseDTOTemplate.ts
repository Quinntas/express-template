export function useCaseDTOTemplate(useCase: string): string {
    const useCaseName = useCase.charAt(0).toUpperCase() + useCase.slice(1);

    return `export interface ${useCaseName}DTO {
    
}

export interface ${useCaseName}ResponseDTO {
    
}
`;
}
