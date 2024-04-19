/**
 * Represents a base domain object.
 * @interface
 */
export interface BaseDomain {
    id?: number;
    pid?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
