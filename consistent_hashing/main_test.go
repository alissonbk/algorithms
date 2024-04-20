package main

import (
	"testing"
)

func TestConsistentHashing(t *testing.T) {
	keyList := [...]string{"google", "youtube", "twitter", "spotify"}
	valueList := [...]string{"www.google.com", "www.youtube.com", "www.twitter.com", "www.spotify.com"}
	ch := NewConsistentHashing(10)
	ch.AddNode("s0")
	ch.AddNode("s1")
	ch.AddValue("google", "www.google.com")
	ch.AddValue("youtube", "www.youtube.com")
	ch.AddValue("twitter", "www.twitter.com")
	ch.AddValue("spotify", "www.spotify.com")

	var v ValueRetrieve
	var err error
	for i := range keyList {
		v, err = ch.GetValue(keyList[i])
		if err != nil || string(v.value) != valueList[i] {
			t.Errorf("Could not find correct value by the key" + keyList[i])
		}
	}

	ch.RemoveNode("s0")
	if !ch.nodeList[0].deleted {
		t.Errorf("Node should be tagged as deleted")
	}
	if ch.nodeList[1].deleted {
		t.Errorf("Node should'nt be tagged as deleted")
	}
	for i := range keyList {
		v, err = ch.GetValue(keyList[i])
		if err != nil || string(v.value) != valueList[i] {
			t.Errorf("Could not find value by the key" + keyList[i])
		}
		if v.nodeName == "s0" {
			t.Errorf("Key" + string(v.value) + " is not in the correct Node")
		}
	}

	ch.AddNode("s3")
	valuesInNodeS3 := 0
	for i := range keyList {
		v, err = ch.GetValue(keyList[i])
		if err != nil || string(v.value) != valueList[i] {
			t.Errorf("Could not find value by the key" + keyList[i])
		}
		if v.nodeName == "s0" {
			t.Errorf("Key" + string(v.value) + " is not in the correct Node")
		}
		if v.nodeName == "s3" {
			valuesInNodeS3++
		}
	}

	if valuesInNodeS3 <= 0 {
		t.Logf("[WARNING] no value was moved to the new Node, this depends on the hash algorithm and could be fine")
	}

}
