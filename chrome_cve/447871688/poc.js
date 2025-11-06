// PoC for potential HashTable allocation issues after the OOM fix
// The fix changed HashTable::New() to return MaybeHandle, but some code paths
// might not handle the failure properly, causing crashes instead of exceptions

try {
    // Try to trigger massive hashtable allocation
    let obj = {};

    // Add huge number of properties to force hashtable allocation
    for (let i = 0; i < 10000000; i++) {
        obj["prop" + i] = i;
    }

} catch (e) {
    // Expected - should throw RangeError
}

try {
    // Try Array.prototype.concat with huge arrays to trigger ArrayConcatVisitor
    let arr1 = new Array(0x7FFFFFF0).fill(1);
    let arr2 = new Array(0x7FFFFFF0).fill(2);

    // This should trigger the hashtable allocation in ArrayConcatVisitor
    let result = arr1.concat(arr2);

} catch (e) {
    // Expected - should throw RangeError
}

// Try to trigger the issue in different ways
try {
    // Create Map/Set with huge initial capacity
    let map = new Map();
    for (let i = 0; i < 0x7FFFFFF0; i++) {
        map.set(i, i);
    }
} catch (e) {
    // Expected
}

try {
    // Try JSON parsing with massive object to trigger hashtable
    let hugeJsonStr = '{"' + new Array(0x1000000).fill(0).map((_, i) => `"prop${i}":${i}`).join(',') + '}';
    JSON.parse(hugeJsonStr);
} catch (e) {
    // Expected
}