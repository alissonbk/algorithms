export function partition(arr: number[], lo: number, hi: number): number {
    const pivot = arr[hi];
    let idx = lo - 1;
    for (let i = lo; i < hi; i++) {
        if (arr[i] <= pivot) {
            idx++;
            const tmp = arr[idx];
            arr[idx] = arr[i];
            arr[i] = tmp;
        }
    }
    idx++; // need to move pivot to the next position of the idx    
    arr[hi] = arr[idx];
    arr[idx] = pivot;
    return idx;
}

export function qs(arr: number[], lo: number, hi: number) {
    // Base case
    if (lo >= hi) {
        return;
    }

    const pivotIdx = partition(arr, lo, hi);
    qs(arr, lo, pivotIdx - 1);
    qs(arr, pivotIdx + 1, hi);
}


export default function quick_sort(arr: number[]): void {
    qs(arr, 0, arr.length - 1);
}