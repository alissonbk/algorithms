import Trie from "@code/Trie";

test("Trie", function() {
    const trie = new Trie();
    trie.insert("foo");
    trie.insert("fool");
    trie.insert("foolish");
    trie.insert("bar");
    trie.printTrie();

    expect(trie.find("ba").sort()).toEqual(["bar"])
    expect(trie.find("fo").sort()).toEqual([
        "foo",
        "fool",
        "foolish",
    ]);

    // // trie.delete("fool");

    expect(trie.find("fo").sort()).toEqual([
        "foo",
        "fool",// !
        "foolish",
    ]);
});

