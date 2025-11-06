let iterProto = Object.getPrototypeOf(new Uint8Array(1)[Symbol.iterator]());
iterProto.next = 1;
for (let v of new Uint8Array(1)) {
  break;
}