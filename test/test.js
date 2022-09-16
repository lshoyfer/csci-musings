"use strict";


/** Makes a multidimensional array
 * 
 */
class MultiArray extends Array {
    constructor(...args) {
        super();
        console.log(args);
        MultiArray.#createStack.call(this, 0);
    }
    static #createStack(dim) {
        console.log(this === MultiArray)
        if (dim >= this.dimensions.length) return 0;
        else {
            for (let i = 0; i < dim; i++) this.push(MultiArray.#createStack.call(this, dim+1));
        }
    }

}

const test = new MultiArray(4, 3, 2);
console.log(test);