"use strict";

// microtask?

function sb(strArr, arg) {
    let strs = strArr.toString();
    console.log(strs, arg);
    const nestState = new Map(); // TODO

    function handleNest(str) {
        const checkNest = /(?<=\(\[).*(?=\]\))/;

        if (checkNest.test(str)) {
            const key = {};
            nestState.set(key, `[${checkNest.exec(str).at(0)}]`);
            handleNest(nestState.get(key));
        };
    } 
    

    console.log(strs);
    // console.log(state.nest);


    const formatAtomic = /\(.*?\)/g;
    const rmParenth = /(?<=\().*(?=\))/;
    const getIterVar = /(?<=const|let|var).*(?=of)/;

    const [outStr, _iterStr, predStr] = 
        (function* () { for (let i = 0; i < 3; i++) yield formatAtomic.exec(strs)?.at(0); })(); // yup
    
    
    const iterVar = getIterVar.exec(_iterStr)?.at(0).trim();
    const iterStr = _iterStr.replace(/(?<=of).*/, ' ');
    const outStrCut = rmParenth.exec(outStr)?.at(0);

    const pred = predStr ? new Function(iterVar, `return ${predStr}`) : () => true;

    const set = [];
    const evaluate = new Function('refArr, pred, set', `
        for ${iterStr}refArr) {
            if (pred(${iterVar})) set.push(${outStrCut});
        }
    `);

    evaluate(arg, pred, set);

    return set;
}

// const arr = [-1, 2, 3];
// const out1 = sb`[(x) for (const x of ${arr}) if (x > 0)]`;
// const out2 = sb`[(x**2) for (const x of ${arr}) if (x > 0)]`;
// const out3 = sb`[(x*100 - 10) for (const x of ${arr}) if (x < 0)]`

// console.log(out1, out2, out3);

// const arr2 = ["hey", 10010, {id: 6}, BigInt(100), [1, 2, 4]];
// const outMixed = sb`[(x) for (const x of ${arr2})]`;
// const arrOut = sb`[([x, x*1000]) for (const x of ${arr})]`;

// console.log(outMixed, arrOut);

const arr3 = [1, 2, 3];
const arr4 = [-1, -2, -3];

const nestedComp = sb`[([([x, y]) for (const y of ${arr4})]) for (const x of ${arr3})]`;
console.log(nestedComp);