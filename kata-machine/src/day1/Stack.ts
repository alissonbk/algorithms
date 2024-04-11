export class Node<T> {
    public value: T;    
    public prev?: Node<T>; // To avoid full traversal o(n) in the pop operation
    
    constructor(value: T, prev?: Node<T>) {
        this.value = value;        
    }
}
export default class Stack<T> {
    public length: number;
    public head?: Node<T>;    

    constructor() {
        this.length = 0;
    }

    push(item: T): void {
        this.length++;
        const node = new Node(item, this.head);      
        if (!this.head) {
            this.head = node;          
            this.head.prev = undefined;
            return;
        }
        node.prev = this.head;              
        this.head = node;        
    }

    pop(): T | undefined {        
        if (!this.head) return undefined;                
        this.length--;        
        const v = this.head.value;       
        this.head = this.head.prev;
        return v;
    }

    peek(): T | undefined {        
        console.log(this.head);
        return this.head?.value;
    }
}