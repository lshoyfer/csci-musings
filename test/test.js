"use strict";


/** Makes a multidimensional array
 * 
 */
class MultiArray extends Array {
    #dimensions;
    constructor(...args) {
        super();
        this.#dimensions = [...args];
        MultiArray.#createStack.call(this, 0, this);
    }
    static #createStack(dim, arr) {
        if (dim >= this.#dimensions.length) return 0;
        else {
            for (let i = 0; i < this.#dimensions[dim]; i++) arr.push(MultiArray.#createStack.call(this, dim+1, []));
            return arr;
        }
    }

}

const test = new MultiArray(4, 3, 2);
console.log(Reflect.ownKeys(test));
console.log(test);
