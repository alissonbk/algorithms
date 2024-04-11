export default class ArrayList<T> {
    public length: number;
    public capacity: number;
    private arr: Array<T | undefined>;


    constructor(capacity: number) {
        this.capacity = capacity;
        this.arr = [];
    }

    prepend(item: T): void {
        this.length = this.arr.unshift(item);
    }

    insertAt(item: T, idx: number): void {
        this.length++;
        const beforeArray = this.arr.slice(0, idx);
        const afterArray = this.arr.slice(idx);
        beforeArray.push(item);
        this.arr = beforeArray.concat(afterArray);
    }
    append(item: T): void {
        this.length = this.arr.push(item);
    }
    remove(item: T): T | undefined {                
        for(let i = 0; i < this.length; i++) {
            if (this.arr[i] === item) {
                this.length--;
                const v = this.arr[i];
                this.arr = this.arr.slice(0, i).concat(this.arr.slice(i + 1));                      
                return v;
            }
        }
        return undefined;
    }
    get(idx: number): T | undefined {       
        return this.arr[idx];
    }
    removeAt(idx: number): T | undefined {        
        this.length--;
        const v = this.arr[idx];                
        this.arr = this.arr.slice(0, idx).concat(this.arr.slice(idx + 1));        
        return v;
    }
}