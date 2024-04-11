function walk(curr: BinaryNode<number> | null, path: number[]): number[] {
    // Base case is when walk into a non existent node
    if (!curr) { 
        return path
    };

    // pre
    // Nothing to do before in the PostOrder traversal
    
    // recurse left
    walk(curr.left, path);        
    // recurse right
    walk(curr.right, path);    
    
    // post        
    path.push(curr.value)
    return path;
}

export default function post_order_search(head: BinaryNode<number>): number[] {
    return walk(head, [])
}