type Char = string & { length: 1 };
export default class Trie {        
    head: Trie | undefined;
    children: Map<Char, Trie>;
    value: Char | undefined;
    isWord: boolean; // if is the last letter of a word    
    

    constructor() {
        this.children = new Map<Char, Trie>();
        this.isWord = false;
        this.value = undefined;
        this.head = this;
    }       
    
    private newTrie(value: Char, isWord?: boolean): Trie {        
        const t = new Trie();
        t.head = this.head;
        t.value = value;
        t.children = new Map<Char, Trie>();
        t.isWord = isWord !== undefined && isWord;
        return t;
    }

    insert(item: string): void {
        let curr = this.head;
        const split = item.split("")
        for (let i = 0; i < split.length; i++) {
            const c = split[i] as Char;


            if (!curr?.children.has(c)) {
                curr?.children.set( c, this.newTrie(c, (i === split.length - 1)));
            }            
            curr = curr?.children.get(c);
        }     
    }
    delete(item: string): void {

    }

    find(partial: string): string[] {         
        let words = [] as string[];      
        console.log(partial.split("") as Char[])  
        this.findWords(partial.split("") as Char[], 0, this.head, words);
        return words;
    } 

    private findWords(partialSplit: Char[], pIdx: number, 
        currentTrie: Trie | undefined, words: string[], charTrack: Char[] = [], lastCharHitted: boolean = false): void {        

        // base case        
        if (currentTrie === undefined) {
            return;
        }

        // pre rec.
        lastCharHitted = pIdx === (partialSplit.length - 1);
        
        charTrack.push(currentTrie.value as Char);
        if (currentTrie.isWord) {
            words.push(charTrack.join(""));            
        }

        // rec. Go next
        if (!lastCharHitted) {                                    
            const nextTrie = currentTrie.children.get(partialSplit[pIdx]);            
            pIdx++;
            this.findWords(partialSplit, pIdx, nextTrie, words, charTrack, lastCharHitted);
        } else {            
            currentTrie.children.forEach(trie => {
                this.findWords(partialSplit, pIdx, trie, words, charTrack, lastCharHitted);
            });
        }
        
        // Post rec
        if (currentTrie.children.size === 0) {
            return;
        }    
      
    }

    printTrie(curr = this.head, idx = 1, map = new Map<number, string>) {        
        if (curr) {            
            if (curr.value)  {
                const currentMapValue = map.get(idx);
                const str = currentMapValue 
                ? currentMapValue + curr.value + " - "
                : curr.value + " - ";
                map.set(idx, str);                        
            }
            
            for (let c of curr.children) {
                this.printTrie(c[1], idx++, map);
            }
        }    

        // if (curr === this.head) console.log(this.head?.children.forEach(c => console.log(c.value)))  ;
        if (!curr || !curr.children || curr.children.size === 0) {
            console.log(map);
            return;
        }
    }
    
}


/*    
private findWords(partialSplit: Char[], currentPartialPosition: number, 
        currentTrie: Trie | undefined, words: string[], charTrack: Char[] = [], lastCharHitted: boolean = false): void {        

        // base case        
        if (currentTrie === undefined) {
            return;
        }

        // lastCharHitted
        lastCharHitted = currentPartialPosition === (partialSplit.length - 1);
        
        // Adding
        charTrack.push(currentTrie.value as Char);
        if (currentTrie.isWord) {
            console.error("IS WORD");
            words.push(charTrack.join(""));            
        }

        // Go next
        if (!lastCharHitted) {
            currentPartialPosition++;
            const nextTrie = currentTrie.children.get(partialSplit[currentPartialPosition]);
            this.findWords(partialSplit, currentPartialPosition, nextTrie, words, charTrack, lastCharHitted);
        }
        
        currentTrie.children.forEach(trie => {
            this.findWords(partialSplit, currentPartialPosition, trie, words, charTrack, lastCharHitted);
        });
        if (currentTrie.children.size === 0) {
            return;
        }    
      
    } 
*/