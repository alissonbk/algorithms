function walk(curr: BinaryNode<number> | null, path: number[]): number[] {
    // Base case is when walk into a non existent node
    if (!curr) { 
        return path
    };

    // pre
    // Nothing to do before in the InOrder traversal
    
    // recurse left
    walk(curr.left, path);
    // Post left recursion
    path.push(curr.value)
    // recurse right
    walk(curr.right, path);    
    
    // post        
    return path;
}

export default function in_order_search(head: BinaryNode<number>): number[] {
    return walk(head, []);
}