export default function bs_list(haystack: number[], needle: number): boolean {
    let lower = 0;    
    let higher = haystack.length; 

    while((lower < higher)) {             
        const currentPos = Math.floor(lower + (higher - lower) / 2);
        const v = haystack[currentPos];

        if (v === needle) {
            return true;
        } else if (needle > v) {
            lower = currentPos + 1;                        
        } else {
            higher = currentPos;            
        }
    };
    return false;
}