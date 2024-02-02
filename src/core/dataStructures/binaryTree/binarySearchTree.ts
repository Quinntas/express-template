import {Node} from "./node";

export class BinarySearchTree {
    private root: Node;

    constructor() {
        this.root = null;
    }

    public getRoot(): Node {
        return this.root;
    }

    public inorder(node: Node) {
        let results = []

        if (node !== null) {
            this.inorder(node.getLeft());
            results.push({
                value: node.getValue(),
                payload: node.getPayload(),
            })
            this.inorder(node.getRight());
        }

        return results
    }

    public search(node: Node, value: number): Node {
        if (node === null)
            return null;
        else if (value < node.getValue())
            return this.search(node.getLeft(), value);
        else if (value > node.getValue())
            return this.search(node.getRight(), value);
        else
            return node;
    }

    public insert(value: number, payload?: any): void {
        function insertNode(node: Node, newNode: Node): void {
            if (newNode.getValue() < node.getValue()) {
                if (node.getLeft() === null) {
                    node.setLeft(newNode);
                } else {
                    insertNode(node.getLeft(), newNode);
                }
            } else {
                if (node.getRight() === null) {
                    node.setRight(newNode);
                } else {
                    insertNode(node.getRight(), newNode);
                }
            }
        }

        const newNode = new Node(value, payload);
        if (this.root === null)
            this.root = newNode;
        else
            insertNode(this.root, newNode);
    }
}
