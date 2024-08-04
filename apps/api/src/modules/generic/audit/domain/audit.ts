import {Domain} from '../../../../lib/types/domain';
import {auditTable} from '../infra/database/audit.table';

export interface AuditData<T> {
    oldValue: T;
    newValue: T;
}

export interface Audit<T> extends Domain<typeof auditTable> {
    data: AuditData<T>;
}
