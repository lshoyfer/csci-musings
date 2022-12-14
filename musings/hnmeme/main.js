'use strict';

// function findUniqueXSlice(sliceLen) {
//     console.log((sliceLen.charCodeAt()).toString(2));
// }

// findUniqueXSlice('A');
// findUniqueXSlice('B');
// findUniqueXSlice('C');
// findUniqueXSlice('D');
// findUniqueXSlice('E');
// findUniqueXSlice('Z');


function findFirstUniqueXSliceHash(str, sliceLen) {
    const set = new Set();
    let i = 0
    while (i < str.length - sliceLen) {
        if (set.size !== i % sliceLen) {
            set.clear();
            i += sliceLen - (i % sliceLen);
        }
        console.log(i % sliceLen);

    }
    }

}

findFirstUniqueXSliceHash('poooooooooooooooop', 4);
// iteration := (i % sliceLen)