export class Node {
    private value: number;
    private readonly payload?: any;
    private left: Node;
    private right: Node;

    setValue(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    getPayload(): any {
        return this.payload;
    }

    setLeft(left: Node) {
        this.left = left;
    }

    getLeft(): Node {
        return this.left;
    }

    setRight(right: Node) {
        this.right = right;
    }

    getRight(): Node {
        return this.right;
    }

    constructor(value: number, payload?: any) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.payload = payload;
    }
}
