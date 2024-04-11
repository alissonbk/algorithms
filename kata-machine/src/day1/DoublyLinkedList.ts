export class Node<T> {
    value: T;
    prev?: Node<T>;
    next?: Node<T>;

    constructor(value: T, prev?: Node<T>, next?: Node<T>) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

export default class DoublyLinkedList<T> {
    public length: number;
    public head?: Node<T>;
    public tail?: Node<T>;


    constructor() {
        this.length = 0;
    }

    prepend(item: T): void {
        this.length++;
        if (!this.head) {
            this.head = new Node(item, undefined, undefined);
            return;
        }
        if (this.tail) {
            this.head = new Node(item, this.tail, this.head);
            this.tail.next = undefined;
            return;
        }
        this.head = new Node(item, undefined, this.head);
    }
    insertAt(item: T, idx: number): void {
        if (idx > this.length) throw Error("Unreachable index, linked list length: " + this.length + " index: " + idx);
        // Head insertion
        if (idx === 0) {
            this.prepend(item);
            return;
        }
        // Tail insertion
        if (idx === this.length) {
            this.append(item);
            return;
        }
        // Middle Insertion
        let currentIdx = 0;
        let currentNode = this.head;
        while (currentIdx < idx) {            
            if (currentIdx + 1 === idx) {
                if (currentNode?.next) {
                    const newNode = new Node(item, currentNode.next, currentNode.next?.next);
                    currentNode.next = newNode;
                    this.length += 1;
                } else {
                    throw new Error("should not happend");
                }
                break;                
            }
            currentIdx += 1;
            currentNode = currentNode?.next;
        }
    }
    append(item: T): void {
        if (this.head === undefined) {
            this.head = new Node(item, undefined, undefined);
            this.length = 1;
            return;
        }
        if (this.head !== undefined && this.tail === undefined) {
            this.tail = new Node(item, this.head, undefined);
            this.head.next = this.tail;
            this.length = 2;
            return;
        }
        if (this.tail !== undefined) {
            const newTail = new Node(item, this.tail, this.head);
            this.tail.next = newTail;
            this.tail = newTail;
            this.length += 1;
        }
    }
    remove(item: T): T | undefined {
        if (this.head === undefined) return undefined;
        if (this.tail === undefined) {
            if (this.head.value === item) {
                this.head = undefined;
                this.length = 0;
                return item;
            }
            return undefined;
        }
        if (this.head.value === item) {
            const result = this.removeHead();
            if (result !== undefined) {
                this.length -= 1
            };
            return result;
        }
        
        if (this.removeTailTraversing(item) === false) {
            return undefined;
        }

        this.length -= 1;
        return item;
    }
    get(idx: number): T | undefined {
        if (this.head === undefined) return undefined;
        if (this.tail === undefined && idx > 0) return undefined;
        let currentIdx = 0;
        let currentNode = this.head;        
        while (currentIdx <= idx) {                      
            if (currentIdx === idx) {
                return currentNode.value;
            }
            if (currentNode.next === undefined) return undefined;            
            currentNode = currentNode.next;
            currentIdx += 1;
        }
        return undefined;
    }

    removeAt(idx: number): T | undefined {        
        if (this.head === undefined) return undefined;
        if (this.tail === undefined && idx != 0) return undefined; 
        if (idx === 0) {            
            const v = this.removeHead();
            if (v !== undefined) { 
                this.length -= 1;
            }
            return v;
        }

        let currentIdx = 0;
        let currentNode = this.head;
        while (currentIdx < idx) {          
            if (currentIdx + 1 === idx) {                
                let nextNode = currentNode.next;
                if (nextNode === undefined) return undefined;
                const v = nextNode.value;
                // Removing the tail
                if (nextNode.next === undefined) {                    
                    nextNode = undefined; // search if this is useful to the gargage collector...
                    currentNode.next = undefined;
                    this.tail = currentNode;     
                    this.head.prev = undefined;
                    this.length -= 1;               
                    return v;
                }               
                if (currentNode === this.head) {
                    this.head.next = nextNode.next;
                    nextNode.next.prev = this.head;
                } else {
                    currentNode = nextNode.next;
                }                         
                nextNode = undefined; 
                this.length -= 1;
                return v;
            }            
            if (currentNode.next === undefined) return undefined;            
            
            currentNode = currentNode.next;
            currentIdx += 1;
        }
        return undefined;
    }

    // Private dont change length
    private removeTailTraversing(item: T): boolean {
        if (this.head === undefined || this.tail === undefined) {
            return false;
        }
        let currentNode = this.head;
        let count = 0;
        while (count < this.length - 1) {
            console.log("while 4")
            if (currentNode.next === undefined) {
                return false;
            }
            if (currentNode.next.value === item) {                           
                if (currentNode.next!.next) {
                    currentNode.next.next.prev = currentNode;
                }     
                currentNode.next = undefined;
                return true;
            }
            currentNode = currentNode.next;
            count++;
        }
        return false;
    }

    // Private dont change length
    private removeHead(): T | undefined {
        if (this.head != undefined) {
            if (this.tail === undefined) {
                const v = this.head.value;
                this.head = undefined;
                return v;
            }
            const v = this.head.value;
            this.head = this.head.next;
            if (this.length === 2) {
                this.head!.prev = undefined;
            }
            this.head!.prev = this.tail;
            return v;
        }
        return undefined;
    }
}