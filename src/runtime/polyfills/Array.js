// Copyright 2014 Traceur Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  isCallable,
  isConstructor,
  checkIterable,
  toInteger,
  toLength,
  toObject
} from './utils';

// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.2.1
export function from(arrLike, mapFn = undefined, thisArg = undefined) {
  var C = this;
  var items = toObject(arrLike);
  var mapping = mapFn !== undefined;
  var k = 0;
  var arr, len;

  // mapFn must be callable if mapping
  if (mapping && !isCallable(mapFn)) {
    throw TypeError();
  }

  if (checkIterable(items)) {
    arr = isConstructor(C) ? new C() : [];

    for (var item of items) {
      if (mapping) {
        arr[k] = mapFn.call(thisArg, item, k);
      } else {
        arr[k] = item;
      }

      k++;
    }

    arr.length = k;

    return arr;
  }

  len = toLength(items.length);
  arr = isConstructor(C) ? new C(len) : new Array(len);

  for (; k < len; k++) {
    if (mapping) {
      arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
    } else {
      arr[k] = items[k];
    }
  }

  arr.length = len;

  return arr;
}

// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.2.3
export function of(...items) {
  var C = this;
  var len = items.length;
  var arr = isConstructor(C) ? new C(len) : new Array(len);

  for (var k = 0; k < len; k++) {
    arr[k] = items[k];
  }

  arr.length = len;

  return arr;
}

// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.3.6
export function fill(value, start = 0, end = undefined) {
  var object = toObject(this);
  var len = toLength(object.length);
  var fillStart = toInteger(start);
  var fillEnd = end !== undefined ? toInteger(end) : len;

  // set the start and end
  fillStart = fillStart < 0 ?
      Math.max(len + fillStart, 0) : Math.min(fillStart, len);
  fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);

  // set the values
  while (fillStart < fillEnd) {
    object[fillStart] = value;
    fillStart++;
  }

  return object;
}

// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.3.8
export function find(predicate, thisArg = undefined) {
  return findHelper(this, predicate, thisArg);
}

// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.3.9
export function findIndex(predicate, thisArg = undefined) {
  return findHelper(this, predicate, thisArg, true);
}

// generic implementation for find and findIndex
function findHelper(self, predicate, thisArg = undefined, returnIndex = false) {
  var object = toObject(self);
  var len = toLength(object.length);

  // predicate must be callable
  if (!isCallable(predicate)) {
    throw TypeError();
  }

  // run through until predicate returns true
  for (var i = 0; i < len; i++) {
    if (i in object) {
      var value = object[i];
      if (predicate.call(thisArg, value, i, object)) {
        return returnIndex ? i : value;
      }
    }
  }

  return returnIndex ? -1 : undefined;
}
