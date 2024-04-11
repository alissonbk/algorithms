export default function two_crystal_balls(breaks: boolean[]): number {
    const jmpAmount = Math.floor(Math.sqrt(breaks.length));

    for (let i = jmpAmount; i < breaks.length; i += jmpAmount) {        
        if (breaks[i] === true) {
            for (let j = i - jmpAmount; j < i; j++) {
                if (breaks[j] === true) {
                    return j;
                }
            }
        }
    }
    return -1;
}