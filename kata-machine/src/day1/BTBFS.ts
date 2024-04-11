import Queue from "./Queue";

export default function bfs(head: BinaryNode<number>, needle: number): boolean {
    const q = new Queue<BinaryNode<number>>();
    q.enqueue(head);

    while(q.length > 0) {
        const next = q.deque();        
        if (next?.value === needle) return true;
        if (!next) throw Error("Shouldnt happend, but happend");
        if (next.left) q.enqueue(next.left);
        if (next.right) q.enqueue(next.right);                        
    }

    return false;
}