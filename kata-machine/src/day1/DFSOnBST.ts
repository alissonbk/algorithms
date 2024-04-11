function find(next: BinaryNode<number> | null, value: number): boolean {
    if (!next) return false;
    if (next.value === value) return true;
        
    if (value > next.value) {
        return find(next.right, value);
    }    
    return find(next.left, value);    
}

export default function dfs(head: BinaryNode<number>, needle: number): boolean {
    return find(head, needle);
}