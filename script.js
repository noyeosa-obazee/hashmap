export class HashMap {
  constructor() {
    this.loadFactor = 0.75;
    this.capacity = 16;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  set(key, value) {
    const index = this.hash(key);

    // Initialize bucket if it doesn't exist
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }

    // Check if key already exists in the bucket (collision handling)
    const bucket = this.buckets[index];
    const existingIndex = bucket.findIndex((item) => item.key === key);

    if (existingIndex !== -1) {
      // Update existing key-value pair
      bucket[existingIndex].value = value;
    } else {
      // Add new key-value pair
      bucket.push({ key, value });
      this.size++;

      // Check if resizing is needed
      if (this.size / this.capacity > this.loadFactor) {
        this.resize();
      }
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket) return null;

    const item = bucket.find((item) => item.key === key);
    return item ? item.value : null;
  }

  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket) return false;

    return bucket.some((item) => item.key === key);
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket) return false;

    const itemIndex = bucket.findIndex((item) => item.key === key);

    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      this.size--;

      // Clean up empty bucket
      if (bucket.length === 0) {
        this.buckets[index] = null;
      }
      return true;
    }

    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  keys() {
    const keysArray = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const item of bucket) {
          keysArray.push(item.key);
        }
      }
    }
    return keysArray;
  }

  values() {
    const valuesArray = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const item of bucket) {
          valuesArray.push(item.value);
        }
      }
    }
    return valuesArray;
  }

  entries() {
    const entriesArray = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const item of bucket) {
          entriesArray.push([item.key, item.value]);
        }
      }
    }
    return entriesArray;
  }

  resize() {
    const oldBuckets = this.buckets;
    const oldEntries = this.entries();

    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;

    // Rehash all entries
    for (const [key, value] of oldEntries) {
      this.set(key, value);
    }
  }
}
