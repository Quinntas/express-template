import {Primitive} from "spectre-orm";

export interface Condition {
    key: string;
    value: Primitive | null | undefined;
    connector?: 'AND' | 'OR'
    custom?: [string, Primitive[]]

}

export function Conditionator(baseQuery?: string) {
    this.q = baseQuery ?? '';
    this.conditions = [];

    this.where = function where() {
        this.q += ' WHERE '
        return this
    }

    this.add = function add(condition: Condition) {
        if (condition.value === null || condition.value === undefined)
            return this;
        this.conditions.push(condition);
        return this;
    };

    this.result = function (tokenStartIndex: number = 1, returnAsStringOnly: boolean = false, forceFirstConnector: boolean = false): [string, Primitive[]] | string {
        if (this.conditions.length === 0) return [this.q, []];
        let isFirstAdded = forceFirstConnector;
        let params: Primitive[] = [];
        for (let i = 0; i < this.conditions.length; i++) {
            if (isFirstAdded && this.conditions[i].connector === undefined)
                throw new Error("Connector must be defined for all conditions except the first one");
            if (this.conditions[i].custom) {
                this.conditions[i].custom[0] = this.conditions[i].custom[0].replace(/\$\d+/g, `$${i + tokenStartIndex}`);
                this.q += `${isFirstAdded ? this.conditions[i].connector : ""} ${this.conditions[i].custom[0]} `;
                params = params.concat(this.conditions[i].custom[1]);
            } else {
                this.q += `${isFirstAdded ? this.conditions[i].connector : ""} ${this.conditions[i].key} = $${i + tokenStartIndex} `;
                params.push(this.conditions[i].value);
            }
            isFirstAdded = true;
        }
        if (returnAsStringOnly) {
            for (let i = 0; i < params.length; i++) {
                if (this.conditions[i].custom) continue;

                switch (typeof params[i]) {
                    case 'string':
                        this.q = this.q.replace(`$${i + tokenStartIndex}`, `'${params[i]}'`);
                        break;
                    case 'number':
                        this.q = this.q.replace(`$${i + tokenStartIndex}`, params[i].toString());
                        break;
                    case `object`:
                        this.q = this.q.replace(`$${i + tokenStartIndex}`, `'${JSON.stringify(params[i])}'`);
                        break;
                }
            }
        }
        return [this.q, params]
    };
}



