"use strict";

function swap(arr, i, j) {
    const lData = arr[i];
    arr[i] = arr[j];
    arr[j] = lData;
}

function partition(arr, pLeft, pRight) {
    const pivot = Math.floor((pLeft + pRight) / 2);
    while (pLeft <= pRight) {
        while (arr[pLeft] < arr[pivot]) pLeft++;
        while (arr[pRight] > arr[pivot]) pRight--;
        if (pLeft <= pRight) {
            swap(arr, pLeft, pRight);
            pLeft++; pRight--;
        }
    }
    return pLeft;
}

function qSort(arr, pStart, pEnd) {
    let mIndex; // meta index
    if (arr.length > 1) {
        mIndex = partition(arr, pStart, pEnd);
        if (pStart < mIndex - 1) qSort(arr, pStart, mIndex - 1);
        if (pEnd > mIndex) qSort(arr, mIndex, pEnd);
    }
    return arr;
}

let poop = [2, 4, 1, 7, 8, 7, 3123, 52435, 122, -11234];
console.log(qSort(poop, 0, poop.length - 1));