"use strict";

// THIS IS A JAVASCRIPT SET-BUILDER / PYTHON LIST COMPREHENSION
// CRUDE / ELEMENTARY IMPLEMENTATION:

// refs must be passed with ${}
// the syntax is more JS like, although 1000x more disgusting: (especially nested)
// sb`[(out) for (varINIT iterItem of ${iter}) if? (pred)]`;

// the semantics of this are actually a bit different
// from python (who certaintly do it better and support
// many more patterns) in that:
//      sb`[([([x, y]) for (const y of ${arrY})]) for (const x of ${arrX})]`
// is equivalent to this list comp in python EXCEPT if it were FLATTENED:
//      [[[x, y] for y in arrY] for x in arrX]
// and equivalent to this list comp in python BUT in a DIFFERENT ORDER:
//      [[x, y] for y in arrY for x in arrX]
// so in a sense, this JS set-builder is a hybrid of those two python
// list comprehension patterns.

// I don't really feel like implementing support for the above two patterns
// as I already feel satisfied with what I've done. This was simply
// supposed to be a cute little 'What if' experiment.

// this program fails with arbitrary refs, as I didn't
// feel like implementing them either. See line 203 in
// sb_debug.js

// ex1: --copy--
//      sb`[(x) for (const x of ${[1, 2, 3]})]`
// ex2: --matrix flatten--
//      const matrix = [[1, 2, 3], [4, 5], [6, 7, 8, 9]];
//      sb`[([(el) for (const el of inner)]) for (const inner of ${matrix})]`
// ex3: --multi ref & (redundant) if statements--
//      const arrX = [-1, -2, -3];
//      const arrY = [1, 2, 3];
//      const arrZ = [0, 0, 0];
//      sb`[([([([x, y, z]) for (const z of ${arrZ}) if (z === 0)]) for (const y of ${arrY}) if (y>0)]) for (const x of ${arrX}) if (x<0)]`



function sb(strArr, ...args) {
    let strs = strArr.join('@');
    const nestState = new Map([[0, strs]]);
    const refState = new Map();
    const predState = new Map();
    let nests = 0;

    function handlePopStr(str) {
        nestState.set(nests - 1, str.replace(nestState.get(nests), ''));
    }

    function handleNest(str) {
        const checkNest = /(?<=\(\[).*(?=\]\))/;
        const checkRefs = (str) => {
            const [f, l] = [str.indexOf('for'), str.lastIndexOf('for')];
            return ((f !== -1) && (f === l));
        }

        if (checkNest.test(str) && !checkRefs(str)) {
            nests++;
            nestState.set(nests, `[${checkNest.exec(str).at(0)}]`);
            handlePopStr(str);
            handleNest(nestState.get(nests));
        } else {
            const getRefs = /(?<=\().*?(?=\))/;
            const key = {};
            const res = getRefs.exec(str)?.at(0) ?? '';
            nestState.set(nests, str.replace(res, ''));
            nestState.set(key, `set.push(${res})`);
        }
    }

    handleNest(strs);
    const evalStr = [...nestState.values()].reduceRight((acc, cur) => {
        cur = parseComp(cur);
        nests && nests--;
        return `${cur} { ${acc} } }`;
    });

    let funcArgs = [...refState.keys()].reduce((acc, cur) => acc + `, ref${cur}`, 'set');
    funcArgs = [...predState.keys()].reduce((acc, cur) => acc + `, pred${cur}`, funcArgs);

    let set = [];
    const evaluate = new Function(funcArgs, evalStr);
    evaluate(set, ...refState.values(), ...predState.values());
    return set;


    function parseComp(str) {
        const formatAtomic = /\(.*?\)/g;
        const rmParenth = /(?<=\().*(?=\))/;
        const getIterVar = /(?<=const|let|var).*(?=of)/;

        const [outStr, iterStr, predStr] =
            (function* () { for (let i = 0; i < 3; i++) yield formatAtomic.exec(str)?.at(0); })();

        const iterVar = getIterVar.exec(iterStr)?.at(0).trim();

        predState.set(nests, predStr ? new Function(iterVar, `return ${predStr}`) : () => true);

        if (iterStr.includes('@')) {
            refState.set(nests, args.shift());
            return `for ${iterStr.replace('@', `ref${nests}`)} { if (pred${nests}(${iterVar})) `;
        }
        return `for ${iterStr} { if (pred${nests}(${iterVar})) `;
    }
}
