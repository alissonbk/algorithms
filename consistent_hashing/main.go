package main

import (
	"errors"
	"hash/fnv"
	"math"
)

type Value string

type ValueRetrieve struct {
	value    Value
	nodeName string
}

type NodeContent map[string]Value

type Node struct {
	name    string
	content NodeContent
	index   uint
	deleted bool // When true means the Node was "removed" (has no content and cannot be used to point new content)
}

func NewNode(name string) *Node {
	return &Node{name: name, content: make(map[string]Value)}
}

type ConsistentHashing struct {
	nodeList          []Node
	unoccupiedIndexes []int // list of all indexes that where removed and are waiting to be filled
	length            uint
	maxLength         uint
	nodeCapacity      uint
	lowerNodeIndex    uint // The first Node in the circle
	higherNodeIndex   uint // The last Node in the circle
}

func NewConsistentHashing(nodeCapacity uint) *ConsistentHashing {
	return &ConsistentHashing{
		length:            0,
		higherNodeIndex:   0,
		lowerNodeIndex:    uint(math.Inf(1)),
		maxLength:         0,
		nodeCapacity:      nodeCapacity,
		nodeList:          make([]Node, (nodeCapacity*2)-1),
		unoccupiedIndexes: make([]int, 0),
	}
}

func (ch *ConsistentHashing) hash(v string) uint {
	hash := fnv.New64()
	hash.Write([]byte(v))
	return uint(hash.Sum64())
}

func (ch *ConsistentHashing) hashModule(v string) uint {
	return ch.hash(v) % ch.maxLength
}

// This will overwrite collisions
func (ch *ConsistentHashing) moveNodeContent(contentToBeMoved *NodeContent, node Node) {
	for key, value := range *contentToBeMoved {
		node.content[key] = value
	}
}

func deleteFromSlice[T any](slice []T, idx int) []T {
	return append(slice[:idx], slice[idx+1:]...)
}

func (ch *ConsistentHashing) removeNodeFromList(idx int) {
	deletedNode := *NewNode("deleted_node")
	deletedNode.deleted = true
	ch.nodeList[idx] = deletedNode
	ch.unoccupiedIndexes = append(ch.unoccupiedIndexes, idx)
}

func (ch *ConsistentHashing) getNextNode(idx uint) *Node {
	if ch.length == idx-1 {
		idx = 0
	}

	for i := idx; i < uint(len(ch.nodeList)); i++ {
		if !ch.nodeList[i].deleted {
			return &ch.nodeList[i]
		}
	}
	return NewNode("")
}

// Missing shift from old values
func (ch *ConsistentHashing) AddNode(name string) error {
	if ch.length == ch.nodeCapacity {
		return errors.New("could not add new node, max capacity exceeded")
	}
	node := NewNode(name)

	// Look for unoccupiedIndexes
	if len(ch.unoccupiedIndexes) > 0 {
		node.index = uint(ch.unoccupiedIndexes[0])
		ch.unoccupiedIndexes = deleteFromSlice(ch.unoccupiedIndexes, 0)
		// Shift values to the right node
		nextNode := ch.getNextNode(node.index + 1)
		for key, value := range nextNode.content {
			if ch.hashModule(key) <= node.index {
				node.content[key] = value
				delete(nextNode.content, key)
			}
		}
	} else {
		node.index = ch.length
	}

	ch.length++
	ch.nodeList[node.index] = *node
	if node.index > ch.higherNodeIndex {
		ch.higherNodeIndex = node.index
	}
	if node.index < ch.lowerNodeIndex {
		ch.lowerNodeIndex = node.index
	}

	if ch.length > ch.maxLength {
		ch.maxLength = ch.length
	}

	return nil
}

func (ch *ConsistentHashing) AddValue(key string, value Value) {
	if len(ch.nodeList) <= 0 {
		panic("Cant add value in a empty list")
	}
	// Find node index
	hashIndex := ch.hashModule(key)
	var indexToAddress uint
	if hashIndex > ch.higherNodeIndex {
		indexToAddress = ch.lowerNodeIndex
	} else {
		for _, node := range ch.nodeList {
			if hashIndex <= node.index {
				indexToAddress = node.index
				break
			}
		}
	}

	// Add
	node := ch.nodeList[indexToAddress]
	node.content[key] = value
}

func (ch *ConsistentHashing) GetValue(key string) (ValueRetrieve, error) {
	hashIndex := ch.hashModule(key)
	for _, node := range ch.nodeList {
		if !node.deleted && hashIndex <= node.index {
			var valueRetrieve = ValueRetrieve{value: node.content[key], nodeName: node.name}
			return valueRetrieve, nil
		}
	}
	return ValueRetrieve{}, errors.New("Could not find the value from the following key: " + key + "\n")
}

func (ch *ConsistentHashing) RemoveNode(name string) error {
	idxToRemove := -1
	idxToMoveContent := -1
	var contentToMove *NodeContent
	for i, node := range ch.nodeList {
		if node.name == name {
			idxToRemove = i
			contentToMove = &node.content
			break
		}
	}

	if idxToRemove == -1 {
		return errors.New("Could not find any node with the following name: " + name + "\n")
	}

	if idxToRemove+1 < len(ch.nodeList) {
		idxToMoveContent = idxToRemove + 1
	} else {
		idxToMoveContent = 0
	}

	ch.moveNodeContent(contentToMove, ch.nodeList[idxToMoveContent])
	ch.removeNodeFromList(idxToRemove)
	ch.length--
	return nil
}
