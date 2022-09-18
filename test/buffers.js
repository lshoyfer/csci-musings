"use strict";

const buff = new ArrayBuffer(8);
// const ta = new Uint8Array(buff, 0, 8);
// console.log(ta);

// ta.set([1,2,3], 2)
// console.log(ta);


const view = new DataView(buff);
console.log(buff.byteLength);
console.log(view.byteLength);
view.setUint16(0, 16); // [0, 1] => [0x00, 0x10]
view.setUint16(6, 16);
console.log(view.getUint16(6)); //
console.log(view.getUint32(4));
const ta = new Uint8Array(buff, 0, 8);
const ta2 = new Uint16Array(buff, 0, 4);
console.log(ta);
console.log(ta2);

// 0 1 2 3 4 5 6 7
// 0, 1, 2, 3

// uint16
// top: elements, bottom: bytes allocated to each element
//  0      1      2      3
// [0, 1] [2, 3] [4, 5] [6, 7]
//
// WRITING
// view.setUint16(6, 16) is concerning element 3 in the uint16 context
// its bytes start out as so in regards to the fact that you're explicity
// editing byte 6:
// 6 | 0001 0000 | 0x10 
// 7 | 0000 0000 | 0x00
// however the element's data are stored to different bytes depending
// on the encoding: big-endian (be) or little-endian (le):
// be: number is stored as 76 | 0x0010 | reading 6 now gives 0x00
// le: number is stored as 67 | 0x1000 | reading 6 now gives 0x10
//
// READING
// be: reads left-right | [6, 7] element => 6,7
// le: reads right-left | [6, 7] element => 7,6
// this gives expected values if read protocol is in the same encoding as the data
// its reading from:
// view.setUint16(6, 16) // implicit be encoding: element is stored
// // such that [6, 7] => [0x00, 0x10]
// view.getUint16(6) // implicit be reading: element is read as 0x0010
// // because it reads left to right from [6, 7] into 67 => 0x0010
//
// view.setUint(6, 16, true) // explicit le encoding: element is stored
// // such that [6, 7] => [0x10, 0x00]
// view.getUint16(6, true) // explicity le reading: element is read as 0x0010
// // because it reads right to left from [6, 7] into 76 => 0x0010
//
// however, when reading and writing encodings differ, problems arise:
// view.setUint16(6, 16) // be, [0x00, 0x10]
// view.getUint16(6, true) // le, right-to-left, [0x00, 0x10] => 0x1000
// we encoded 16 with the intent of 0x0010, but received 4096 / 0x1000
//
// this issue is compounded when switching type protocols as well, see uint32
// comments



// uint32
// under uint16 the array elements would be represented like so:
//  0      1      2      3
// [0, 1] [2, 3] [4, 5] [6, 7]
// but when reading under uint32, bytes [4, 5] and [6, 7] are merged like so:
//  1,           2,
// [0, 1, 2, 3] [4, 5, 6, 7]
// reading be would produce: 4567
// reading le would produce: 7654
// view.setUint16(6, 16) // be, different type... what happens?
// well [6, 7] are stored [0x00, 0x10] and [4,5] are unset & therefore [0x00, 0x00]
// view.getUint32(4) // reads be, thus [4, 5, 6, 7] => 4567
// => 0x00001000, 16, no loss
// view.getUint32(4, true) // reads le, thus [4, 5, 6, 7] => 7654
// => 0x10000000, 268,435,456, huge loss
// youll get results similar in principle if you write in le and read in be... etc etc

// now finally, lets look at the last bit of code
/**
 * view.setUint16(6, 16); // A
 * const ta = new Uint8Array(buff, 0, 8);
 * const ta2 = new Uint16Array(buff, 0, 4);
 * console.log(ta);
 * console.log(ta2);
 */
// Output:
//  >> Uint8Array(8) [0, 0, 0, 0, 0, 0, 0, 16]
//  >> Uint16Array(4) [0, 0, 0, 4096]
//
// what happened here? lets look at the byte representations for uint8 & 16:
//
// top: elements, bottom: bytes allocated to each element
// uint16
//  0      1      2      3
// [0, 1] [2, 3] [4, 5] [6, 7]
//
// uint8
//  0,  1,  2,  3,  4,  5,  6,  7
// [0] [1] [2] [3] [4] [5] [6] [7]
//
// line A writes using be, so [6, 7] => [0x00, 0x10]
// in Uint8 that means element 7 is simply byte 7, be or le produces same result: 0x10
// in Uint16 if it reads be, element 3 would be 0x0010, not 0x1000, therefore
// the <<ElementType>>Array constructor MUST be reading using ** le ** !!!!, which
// confuses me to be honest, as everything else seems to default to be and there's
// no option to have it read be... ?????
// upon googling, the typed array constructors use the endian of the operating system
// as most protocols and libraries internally do and provide you with the same, nice!