"use strict";

const canditates = [];

const INIT = BigInt(2432902008176640000);

function* divisors() {
    for (let i = 1; i <= 20; i++) yield i;
}


function check_div(v) {
    if (typeof v === "bigint");
    for (const div of divisors()) {
        if (v % div !== 0) return false;
    }
    return true;
}

console.log(
    check_div(INIT)
);