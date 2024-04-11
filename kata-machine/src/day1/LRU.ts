class Node<T> {
    value: T;
    prev?: Node<T>;
    next?: Node<T>;    

    constructor(v: T) {
        this.value = v;
    }
}

export default class LRU<K, V> {
    private length: number;
    private capacity: number;
    private head?: Node<V>;
    private headKey?: K; // used to remove the LRU from hashMap;
    private tail?: Node<V>;
    private hashMap: Map<K, Node<V>>;

    constructor(cap?: number) {
        this.length = 0;
        this.hashMap = new Map();
        if (cap) {
            this.capacity = cap;
        } else {
            this.capacity = 3;
        }
    }

    update(key: K, value: V): void {
        // Should deal with capacity less than 3 but im lazy
        if (this.length === this.capacity) {
            if (this.head) {
                this.head = this.head.next;
                if (this.headKey) {
                    this.hashMap.delete(this.headKey);
                }                    
            }                
        }   
        const node = this.prepend(key, value);
        this.hashMap.set(key, node);                        
    }

    get(key: K): V | undefined {
        const node = this.hashMap.get(key);        
        if (node?.value && this.tail?.value != node.value) {            
            this.shiftNodeToTail(node);            
        }
        return node?.value;
    }

    private shiftNodeToTail(node: Node<V>) {
        this.removeNode(node);
        this.append(node.value);
    }

    private removeNode(node: Node<V>) {  
        // Zero down case      
        if (!node.next && !node.prev) {
            this.head = undefined;
            this.hashMap = new Map();
            this.length--;
            return;
        }
        // Remove head
        if (!node.prev) {                            
            this.head = node.next;                
            this.length--;
            return;
        }
        // Remove tail
        if (!node.next) {                
            if (this.head && this.length === 2) {
                this.head.next = undefined;
                this.tail = undefined;
            } else {                
                const newTail = this.tail?.prev;
                if (newTail) {
                    newTail.next = undefined;
                    this.tail = newTail;
                }
            }            
            this.length--;
            return;
        }        

        // Mid case
        const prevTmp = node.prev;
        node.prev.next = node.next;
        node.next.prev = prevTmp;
        this.length--;
    }

    private append(value: V): Node<V> {
        const newNode = new Node(value);
        if (this.length === 0) {            
            this.head = newNode;            
            this.length++;
            return newNode;
        }        
        if (this.length === 1 && this.head) {            
            this.tail = newNode;
            this.tail.prev = this.head;
            this.head.next = this.tail;
        } else if (this.tail) {             
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }

        this.length++;
        return newNode;
    }

    private prepend(key: K, value: V): Node<V> {        
        const newNode = new Node(value);        
        if (this.length === 0) {            
            this.head = newNode;            
            this.length++;
            return newNode;
        }  
        
        if (this.length === 1 && this.head) {
            this.tail = this.head;                        
            this.head = newNode;
            this.tail.prev = this.head           
            this.head.next = this.tail;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }

        this.headKey = key;
        this.length++;
        return newNode;
    }


}