package main

import "testing"

func TestKDimensionTree(t *testing.T) {
	kDTree := KDimensionalTree{}
	kDTree.Insert(10, 5)
	kDTree.Insert(20, 8)
	kDTree.Insert(2, 4)
	kDTree.Insert(5, 3)
	kDTree.Insert(18, 11)
	kDTree.Insert(9, 8)
	preOrderArr := kDTree.DFS(PRE_ORDER)
	inOrderArr := kDTree.DFS(IN_ORDER)
	postOrderArr := kDTree.DFS(POST_ORDER)

	if inOrderArr[0].x != 5 || inOrderArr[0].y != 3 {
		t.Errorf("In order is in the wrong order :)")
	}

	if inOrderArr[1].x != 2 || inOrderArr[1].y != 4 {
		t.Errorf("In order is in the wrong order :)")
	}

	if inOrderArr[2].x != 9 || inOrderArr[2].y != 8 {
		t.Errorf("In order is in the wrong order :)")
	}

	if preOrderArr[0].x != 10 || preOrderArr[0].y != 5 {
		t.Errorf("Pre order is in the wrong order :)")
	}

	if preOrderArr[1].x != 2 || preOrderArr[1].y != 4 {
		t.Errorf("Pre order is in the wrong order :)")
	}

	if preOrderArr[2].x != 5 || preOrderArr[2].y != 3 {
		t.Errorf("Pre order is in the wrong order :)")
	}

	if postOrderArr[0].x != 5 || postOrderArr[0].y != 3 {
		t.Errorf("Post order is in the wrong order :)")
	}

	if postOrderArr[1].x != 9 || postOrderArr[1].y != 8 {
		t.Errorf("Post order is in the wrong order :)")
	}

	if postOrderArr[2].x != 2 || postOrderArr[2].y != 4 {
		t.Errorf("Post order is in the wrong order :)")
	}

}
