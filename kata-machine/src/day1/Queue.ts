export class Node<T> {
    public value: T;
    public next: Node<T> | undefined;
    constructor(value: T, next: Node<T> | undefined) {
        this.value = value;
        this.next = next;
    }
}

export default class Queue<T> {
    public length: number;
    public head: Node<T> | undefined;
    public tail: Node<T> | undefined;


    constructor() {
        this.length = 0;
    }

    enqueue(item: T): void {
        const newNode = new Node(item, undefined);    
        this.length += 1;

        if (!this.head) {                                
            this.head = newNode;            
            return;
        }

        if (!this.tail) {            
            this.head.next = newNode;
            this.tail = newNode;            
            return;
        }

        if (this.tail) {            
            this.tail.next = newNode;
            this.tail = newNode;                        
        }

    }
    deque(): T | undefined {
        if (!this.head) return undefined;
        const prevHead = this.head;        
        this.head = this.head.next;
        prevHead.next = undefined;
        this.length -= 1;
        return prevHead.value;
    }
    peek(): T | undefined {
        return this.head?.value;
    }
}