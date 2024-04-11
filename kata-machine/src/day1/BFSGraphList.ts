export default function bfs(
    graph: WeightedAdjacencyList, 
    source: number, needle: number): number[] | null {
    const seen = new Array(graph.length).fill(false);
    const prev = new Array(graph.length).fill(-1);

    seen[source] = true;
    const q: number[] = [source];

    while(q.length) {
        const curr = q.shift() as number;
        if (curr === needle) {
            break;
        }

        const adjs = graph[curr]
        console.log(adjs);
        for (let i = 0; i < graph.length; i++) {
            if (!adjs[i] || (adjs[i] && !adjs[i].to)) {
                continue;
            }

            if (seen[i]) {
                continue;
            }

            seen[i] = true;
            prev[i] = adjs[i].to;
            q.push(i);
        }
    }

    console.log("list: ", prev);

    if (prev[needle] === -1) {
        return null;
    }

    let curr = needle;
    const out: number[] = [];

    while(prev[curr] !== -1) {
        out.push(curr);
        curr = prev[curr];
    }
    
    return [source].concat(out.reverse());    
}