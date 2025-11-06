onmessage = function(e) {
  const i32 = new Int32Array(e.data);
  Atomics.store(i32, 0, 1337);
  Atomics.notify(i32, 0);
};