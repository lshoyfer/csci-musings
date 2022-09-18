"use strict";

const toSort = [
    { name: "Albi", value: -2}, 
    { name: "Larry", value: -6}, 
    { name: "Valbon", value: 12}, 
    { name: "Sameer", value: 0}, 
    { name: "Joe", value: 1234}, 
    { name: "Michael C", value: 4321}, 
    { name: "Nick", value: -32}, 
    { name: "Michael P", value: -6}, 
]

const sorted = toSort.flatMap((e, i) => (e.value > 0) ? { name: e.name, value: e.value, index: i} : []);
console.log(sorted);