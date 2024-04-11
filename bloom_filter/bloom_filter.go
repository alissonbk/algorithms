package main

import (
	"fmt"
	"hash/fnv"
	"math"
	"strings"
)

type BloomFilter struct {
	bitmapCapacity    uint32
	wordDivisionCount int
	bitmap            []uint32
	referenceList     []string // for tests purpouse
}

func NewBloomFilter(bitmapCapacity uint32, wordDivisionCount int) *BloomFilter {
	bitmap := make([]uint32, bitmapCapacity)
	rl := make([]string, bitmapCapacity*2)
	bf := &BloomFilter{
		bitmapCapacity:    bitmapCapacity,
		wordDivisionCount: wordDivisionCount,
		bitmap:            bitmap,
		referenceList:     rl,
	}
	bf.populateBitmap()
	return bf
}

func (bf *BloomFilter) populateBitmap() {
	for i := range bf.bitmapCapacity {
		bf.bitmap[i] = 0
	}
}

func (bf *BloomFilter) AddElement(str string) {
	bf.referenceList = append(bf.referenceList, str)

	split := strings.Split(str, "")
	strLen := len(split)
	if strLen < int(bf.wordDivisionCount) {
		for i := range split {
			hash := bf.hashStr(split[i])
			pos := hash % uint32(bf.bitmapCapacity)
			bf.bitmap[pos] = 1
		}
		return
	}
	div := int(math.Ceil(float64(strLen / bf.wordDivisionCount)))
	for i := range split {
		newWord := ""
		for i < div && i < strLen {
			newWord += split[i]
			i++
		}
		hash := bf.hashStr(newWord)
		pos := hash % uint32(bf.bitmapCapacity)
		bf.bitmap[pos] = 1
		div *= 2
	}
}

func (bf *BloomFilter) ElementExists(str string) bool {
	exists := true
	split := strings.Split(str, "")
	strLen := len(split)
	if strLen < int(bf.wordDivisionCount) {
		for i := range split {
			hash := bf.hashStr(split[i])
			pos := hash % uint32(bf.bitmapCapacity)
			if !(bf.bitmap[pos] == 1) {
				return false
			}
		}
	}
	div := int(math.Ceil(float64(strLen / bf.wordDivisionCount)))
	for i := range split {
		newWord := ""
		for i < div && i < strLen {
			newWord += split[i]
			i++
		}
		hash := bf.hashStr(newWord)
		pos := hash % uint32(bf.bitmapCapacity)
		if !(bf.bitmap[pos] == 1) {
			return false
		}
		div *= 2
	}

	return exists
}

func (bf *BloomFilter) hashStr(s string) uint32 {
	fnvHash := fnv.New32()
	fnvHash.Write([]byte(s))
	return fnvHash.Sum32()
}

func main() {
	bloomFilter := NewBloomFilter(64, 3)
	bloomFilter.AddElement("google.com.br")
	bloomFilter.AddElement("facebook.com")
	bloomFilter.AddElement("twitter.com")
	bloomFilter.AddElement("instagram.com")
	bloomFilter.AddElement("capcom.com")
	fmt.Println("google.com.br exists? ", bloomFilter.ElementExists("google.com.br"))
	fmt.Println("youtube.com exists? ", bloomFilter.ElementExists("youtube.com"))
	fmt.Println("tiktak.com exists? ", bloomFilter.ElementExists("tiktak.com"))
}
