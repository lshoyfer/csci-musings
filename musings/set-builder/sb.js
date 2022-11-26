"use strict";

// microtask?

function sb(strArr, arg) { // REALTODO: IMPL ALL ARG REFS
    let strs = strArr.toString();
    console.log('init', strs, '\n', arg, '\n\n');
    const nestState = new Map([[0, strs]]); // TODO
    let nests = 0;

    function handlePopStr(str) {
        console.log(
            '\nstartpop\n', 'old\n', nestState.get(nests-1), '\nnew\n',
            nestState.get(nests), '\nendpop\n'
        );
        nestState.set(nests-1, str.replace(nestState.get(nests), ''));
    }

    function handleNest(str) {
        console.log('passing:', str);
        const checkNest = /(?<=\(\[).*(?=\]\))/;
        const checkRefs = (str) => {
            const [f, l] = [str.indexOf('for'), str.lastIndexOf('for')];
            return ((f !== -1) && (f === l));
        }

        if (checkNest.test(str) && !checkRefs(str)) {
            nests++;
            // str.replace(checkNest, "");
            nestState.set(nests, `[${checkNest.exec(str).at(0)}]`);
            handlePopStr(str);
            console.log('parsed:', nestState.get(nests));
            console.log('oldpop:', nestState.get(nests-1));
            handleNest(nestState.get(nests));
        } else {
            // potential nests impl
            const getRefs = /(?<=\().*?(?=\))/; // good enuf
            const key = {};
            const res = getRefs.exec(str)?.at(0) ?? '';
            nestState.set(nests, str.replace(res, ''));
            nestState.set(key, `set.push(${res})`);
            console.log('parsed refs:', nestState.get(key));
        }
    }

    handleNest(strs);
    let evalStr = '';
    if (nestState.size) {
        console.log('\n\ncheck:', [...nestState.values()], '\n\nendcheck');
        evalStr = [...nestState.values()].reduceRight((acc, cur) => {
            // res = parseFn(cur); // TODO
            // console.log(parseComp(cur));
            parseComp(cur);
            return `${cur}{${acc}}`;
        });
    }

    // console.log('zdes', evalStr);

    // console.log(strs);

    function parseComp(str) {
        console.log('\nstartparse\n', str, '\nendparse\n');
        const formatAtomic = /\(.*?\)/g;
        const rmParenth = /(?<=\().*(?=\))/;
        const getIterVar = /(?<=const|let|var).*(?=of)/;

        const [outStr, _iterStr, predStr] = 
            (function* () { for (let i = 0; i < 3; i++) yield formatAtomic.exec(str)?.at(0); })(); // yup
        
        console.log('\nstartvarch\n', outStr, '\n', _iterStr, '\n', predStr, '\nendvarch\n');


        const iterVar = getIterVar.exec(_iterStr)?.at(0).trim();
        const iterStr = _iterStr.replace(/(?<=of).*/, ' ');
        // const outStrCut = rmParenth.exec(outStr)?.at(0); // unneeded now i think

        console.log('\nstartparsevarch\n', iterVar, '\n', iterStr, '\nendparsevarch\n');


        const pred = predStr ? new Function(iterVar, `return ${predStr}`) : () => true;
        // REALTODO: IMPL ALL ARG REFS 

        // const evaluate = new Function('refArr, pred, set', `
        //     for ${iterStr}refArr) {
        //         if (pred(${iterVar})) set.push(${outStrCut});
        //     }
        // `);

        // evaluate(arg, pred, set);

        // return set;
    }
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
const arr5 = [0, 0, 0];

// const nestedComp = sb`[([(x + y) for (const y of ${arr4})]) for (const x of ${arr3})]`;

const nestedComp3 = sb`[([([([x, y, z]) for (const z of ${arr5}) if (z === 0)]) for (const y of ${arr3}) if (y)]) for (const x of ${arr4}) if (x<0)]`
// console.log(nestedComp);