package main

import (
	"strconv"
)

const (
	PRE_ORDER = iota
	IN_ORDER
	POST_ORDER
)

type NodeValue struct {
	x int
	y int
}

func (nv *NodeValue) Text() string {
	return "x: " + strconv.Itoa(nv.x) + " y: " + strconv.Itoa(nv.y)
}

type Node struct {
	value NodeValue
	right *Node
	left  *Node
}

func NewNode(v NodeValue) *Node {
	return &Node{
		value: v,
	}
}

type KDimensionalTree struct {
	length int
	head   *Node
}

func (k *KDimensionalTree) Insert(x int, y int) {
	newNode := NewNode(NodeValue{x: x, y: y})
	k.length++
	if k.head == nil {
		k.head = newNode
		return
	}

	currentNode := k.head
	count := 0
	for currentNode != nil {
		if k.isBiggerEqualThan(count, newNode.value, currentNode.value) {
			if currentNode.right == nil {
				currentNode.right = newNode
				return
			}
			currentNode = currentNode.right
		} else {
			if currentNode.left == nil {
				currentNode.left = newNode
				return
			}
			currentNode = currentNode.left
		}
		count++
	}
}

func (k *KDimensionalTree) DFS(order int) []NodeValue {
	tree := make([]NodeValue, k.length)
	idx := -1
	k.traverse(&tree, k.head, order, &idx)
	return tree
}

// post traversal type
func (k *KDimensionalTree) traverse(tree *[]NodeValue, currentNode *Node, order int, idx *int) {
	// base case
	if currentNode == nil {
		return
	}

	// pre
	if order == PRE_ORDER {
		*idx++
		(*tree)[*idx] = currentNode.value
	}

	// recurse
	k.traverse(tree, currentNode.left, order, idx)
	if order == IN_ORDER {
		*idx++
		(*tree)[*idx] = currentNode.value
	}
	k.traverse(tree, currentNode.right, order, idx)

	// post
	if order == POST_ORDER {
		*idx++
		(*tree)[*idx] = currentNode.value
	}
}

func (k *KDimensionalTree) isBiggerEqualThan(count int, a NodeValue, b NodeValue) bool {
	if count%2 == 0 {
		return a.x >= b.x
	}
	return a.y >= b.y
}
