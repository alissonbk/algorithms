function walk(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
    // Base case
    if (a === null && b === null) {
        return true;
    }
    
    if (a === null || b === null) {
        return false;
    }

    if (a.value !== b.value) {
        return false;
    }

    return compare(a.left, b.left) && compare(a.right, b.right);
}

export default function compare(a: BinaryNode<number> | null, b: BinaryNode<number> | null): boolean {
    return walk(a, b);
}