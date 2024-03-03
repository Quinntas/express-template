import {Primitive} from "../types/primitives";

export interface Condition {
    key: string;
    value: Primitive | null | undefined;
    connector?: 'AND' | 'OR'
}

export class Conditionator {
    private q: string;
    private conditions: Condition[];

    constructor(baseQuery?: string) {
        this.q = baseQuery ?? '';
        this.conditions = [];
    }

    public where(): this {
        let space = ""
        if (this.q !== "") space = " "
        this.q += `${space}WHERE`
        return this
    }

    public add(condition: Condition): this {
        if (condition.value === null || condition.value === undefined)
            return this;
        this.conditions.push(condition);
        return this;
    }

    public result(tokenStartIndex: number = 1, returnAsStringOnly: boolean = false, forceFirstConnector: boolean = false): [string, Primitive[]] | string {
        if (this.conditions.length === 0) return returnAsStringOnly ? this.q : [this.q, []];
        let isFirstAdded = forceFirstConnector;
        let params: Primitive[] = [];
        for (let i = 0; i < this.conditions.length; i++) {
            if (isFirstAdded && this.conditions[i].connector === undefined)
                throw new Error("Connector must be defined for all conditions except the first one");
            let value = ""
            if (returnAsStringOnly)
                value = String(this.conditions[i].value);
            else
                value = `$${i + tokenStartIndex}`;
            this.q += `${isFirstAdded ? this.conditions[i].connector : ""} ${this.conditions[i].key} = ${value} `;
            params.push(this.conditions[i].value);
            isFirstAdded = true;
        }
        return [this.q, params]
    }
}