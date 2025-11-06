const v1 = [Worker];
for (let i3 = 0;
    (() => {
        const o5 = {
        };
        o5.c = 5;
        o5.__proto__ = v1;
        const o6 = {
            ...o5,
        };
        return Worker;
    })();
    ) {
}