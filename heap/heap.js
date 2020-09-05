class Heap {
  constructor(arr, comparator = (a, b) => a - b) {
    this.heap = arr;
    this.comparator = comparator;
    for (let i = arr.length - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  siftDown(i) {
    const h = this.heap, comp = this.comparator;
    while (i < h.length) {
      let left = 2 * i + 1, right = left + 1, min = i;
      if (left < h.length && comp(h[left], h[min]) < 0) {
        min = left;
      }
      if (right < h.length && comp(h[right], h[min]) < 0) {
        min = right;
      }
      if (min !== i) {
        [h[i], h[min]] = [h[min], h[i]];
        i = min;
      } else {
        return;
      }
    }
  }

  siftUp(i) {
    const h = this.heap, comp = this.comparator;
    while (i > 0) {
      let parent = Math.floor((i - 1) / 2);
      if (comp(h[i], h[parent]) < 0) {
        [h[i], h[parent]] = [h[parent], h[i]];
        i = parent;
      } else {
        return;
      }
    }
  }
  
  push(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length == 1) {
      return this.heap.pop();
    } else {
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.siftDown(0);
      return min;
    }
  }

  empty() {
    return this.heap.length == 0;
  }
}