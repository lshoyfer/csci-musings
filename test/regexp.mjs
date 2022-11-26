"use strict";
import {strict as assert} from 'node:assert';

function copyAndAddFlags(regExp, flagsToAdd='') {
    // The constructor doesn’t allow duplicate flags;
    // make sure there aren’t any:
    const newFlags = Array.from(
      new Set(regExp.flags + flagsToAdd) // this is for duplicate flags
    ).join('');
    return new RegExp(regExp, newFlags);
  }
assert.equal(/abc/i.flags, 'i');
assert.equal(copyAndAddFlags(/abc/i, 'g').flags, 'gi');