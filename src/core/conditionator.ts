export function Conditionator(baseQuery?: string) {
    this.q = baseQuery ?? ''

    this.where = function where() {
        this.q += ' WHERE '
        return this
    }

    this.add = function add(condition: TemplateStringsArray, ...values: any[]) {
        let result = condition[0] ?? '';
        let valueIndex = 0
        for (let i = 1; i < condition.length; i++) {
            if (!values[valueIndex])
                return this
            result += `${values[valueIndex]}${condition[i] ?? ''}`;
            valueIndex++
        }
        if (this.q !== '')
            this.q += ` AND `;
        this.q += `${result}`;
        return this;
    };

    this.result = function (): string {
        return this.q;
    };
}

