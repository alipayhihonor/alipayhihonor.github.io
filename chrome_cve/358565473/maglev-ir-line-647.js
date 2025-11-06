const v1 = ("I").split();
function f2(a3) {
    const v4 = a3.length;
    function f5(a6, a7, a8) {
        if (a8 == 3) {
            a6 >= a7;
        }
        return a6;
    }
    f5("I", v4);
    f5("ab", "cd", 3);
}
const o18 = {
};
o18[Symbol.toPrimitive] = f2;
const o21 = {
};
const v22 = new Proxy(o18, o21);
const v23 = [-4096,-2,-9007199254740991,-5,-6,1073741823,1497775793,30009,-9007199254740990];
const v24 = [6,62606,-41376,2147483649];
function f25() {
    const o26 = {
        [v22]: v1,
    };
    return JSON.rawJSON(v24);
}
v24.toString = f25;
v23[v24];
