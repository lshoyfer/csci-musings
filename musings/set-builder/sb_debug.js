"use strict";

function sb(strArr, ...args) { // REALTODO: IMPL ALL ARG REFS
    let strs = strArr.join('@');
    console.log('init', strs, '\n', args, '\n\n');
    const nestState = new Map([[0, strs]]); // TODO
    const refState = new Map();
    const predState = new Map();
    let nests = 0;

    function handlePopStr(str) {
        console.log(
            '\nstartpop\n', 'old\n', nestState.get(nests - 1), '\nnew\n',
            nestState.get(nests), '\nendpop\n'
        );
        nestState.set(nests - 1, str.replace(nestState.get(nests), ''));
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
            console.log('oldpop:', nestState.get(nests - 1));
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
    console.log('\n\ncheck:', [...nestState.values()], '\n\nendcheck');
    const evalStr = [...nestState.values()].reduceRight((acc, cur) => {
        // res = parseFn(cur); // TODO
        // console.log(parseComp(cur));
        console.log('\nRETURNED\n', cur = parseComp(cur));
        nests && nests--;
        return `${cur} { ${acc} } }`;
    });

    let funcArgs = [...refState.keys()].reduce((acc, cur) => acc + `, ref${cur}`, 'set');
    funcArgs = [...predState.keys()].reduce((acc, cur) => acc + `, pred${cur}`, funcArgs);


    console.log('\nNESTSTATE\n', nestState);
    console.log('\nREFSTATE\n', refState);
    // console.log('\nPREDSTATE\n', predState);
    console.log('\nPREDSTATE\n', predState);
    [...predState.values()].forEach((v) => console.log(v.toString()));

    console.log('\nevalStr\n', evalStr);
    console.log('\nfuncArgs\n', funcArgs);

    console.log('\nPASSING-IN\n', ...refState.values(), ...[...predState.values()].map(
        v => v.toString()
    ), '\nPASSEDIN\n')

    let set = [];
    const evaluate = new Function(funcArgs, evalStr);
    console.log('\nSTARTEVAL\n', evaluate.toString(), '\nENDEVAL\n');
    evaluate(set, ...refState.values(), ...predState.values());
    return set;

    // console.log(strs);

    function parseComp(str) {
        console.log('\nstartparse\n', str, '\nendparse\n');
        const formatAtomic = /\(.*?\)/g;
        const rmParenth = /(?<=\().*(?=\))/;
        const getIterVar = /(?<=const|let|var).*(?=of)/;

        const [outStr, iterStr, predStr] =
            (function* () { for (let i = 0; i < 3; i++) yield formatAtomic.exec(str)?.at(0); })(); // yup

        console.log('\nstartvarch\n', outStr, '\n', iterStr, '\n', predStr, '\nendvarch\n');


        const iterVar = getIterVar.exec(iterStr)?.at(0).trim();
        // const iterStr = _iterStr.replace(/(?<=of).*(?=\))/, ' ');
        // const outStrCut = rmParenth.exec(outStr)?.at(0); // unneeded now i think

        console.log('\nstartparsevarch\n', iterVar, '\n', iterStr, '\nendparsevarch\n');


        predState.set(nests, predStr ? new Function(iterVar, `return ${predStr}`) : () => true);
        // REALTODO: IMPL ALL ARG REFS 


        if (iterStr.includes('@')) {
            refState.set(nests, args.shift());
            // nests && nests--;
            return `for ${iterStr.replace('@', `ref${nests}`)} { if (pred${nests}(${iterVar})) `;
        }
        // nests && nests--;
        return `for ${iterStr} { if (pred${nests}(${iterVar})) `;

        // return (
        //     `for ${iterStr.includes('@') ? iterStr}`
        // );


        // const evaluate = new Function('refArr, pred, set', `
        //     for ${iterStr}refArr) {
        //         if (pred(${iterVar})) set.push(${outStrCut});
        //     }
        // `);

        // evaluate(args, pred, set);

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

const nestedComp = sb`[([(x + y) for (const y of ${arr4})]) for (const x of ${arr3})]`;
console.log(nestedComp);

// HETEREREREREREHETEREREREREREHETEREREREREREHETERERERHETEREREREREREHETEREREREREREHETEREREREREREHETEREREREREREERERE
// const nestedComp3 = sb`[([([([x, y, z]) for (const z of ${arr5}) if (z === 0)]) for (const y of ${arr3}) if (y>0)]) for (const x of ${arr4}) if (x<0)]`
// console.log('\n\n\nstartnested\n\n\n', nestedComp3, '\n\n\nendnested\n\n\n');


// let pee = [];
// for (const x of arr4) {
//     if (x<0) {
//         for (const y of arr3) {
//             if (y>0) {
//                 for (const z of arr5) {
//                     if (z === 0) {
//                         pee.push([x, y, z])
//                     }
//                 }
//             }
//         }
//     }
// }

// console.log(pee);



// const ts = [0, 1, 2];
// const nts = [0, -1, -2];
// const zts = [0, 0, 0];

// console.log('\n\nstart endtest\n\n');
// for (const p of ts) {
//     if (p > 0) for (const n of nts) {
//         if (n < 0) for (const z of zts) {
//             if (z === 0) console.log(p, n, z);
//         }
//     }
// }

// console.log('\n\nstart endtest2\n\n');
// for (const p of ts) {
//     for (const n of nts) {
//         for (const z of zts) {
//             if ((p > 0) && (n < 0) && (z === 0)) console.log(p, n, z);
//         }
//     }
// }

// console.log('\n\nstart endtest3\n\n');
// const matrix = [[1, 2, 3], [4, 5], [6, 7, 8, 9]];
// const flatM = [];
// console.log(sb`[([(el) for (const el of sub)]) for (const sub of ${matrix})]`);

// let meme = [1, 2, 3];
// let boolRef = true;
// console.log(sb`[(x) for (const x of ${meme}) if (${boolRef})]`);
// this will break it ^^ b/c i haven't implemented arbitrary refs anywhere, and
// i don't feel like doing so either -- i've accomplished what i've set out to do
// imo... tho if given another hour i could probably rewrite this to accommodate
// for that


// for (const sub of matrix) {
//     for (const el of sub) {
//         flatM.push(el);
//     }
// }
// console.log(flatM);