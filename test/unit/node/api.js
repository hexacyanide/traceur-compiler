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

suite('api.js', function() {

  setup(function() {
    $traceurRuntime.options.reset();
  });

  teardown(function() {
    $traceurRuntime.options.reset();
  });

  test('api compile script function declaration', function() {
    var api = require('../../../src/node/api');
    var result = api.compile('function foo() {};',
        {modules: false});
    assert(result.length > 0);
  });

  test('api compile script function expression', function() {
    var api = require('../../../src/node/api');
    var result = api.compile('var foo = function() {};',
        {modules: false});
    assert(result.length > 0);
  });

  test('api compile experimental', function() {
    var api = require('../../../src/node/api');
    var result = api.compile('let a = 1;', {blockBinding: true});
    assert(result.length > 0);
  });

  test('api compile filename', function() {
    var api = require('../../../src/node/api');
    var options = {modules: 'register', moduleName: true};
    var result = api.compile('var a = 1;', options, 'a.js');
    assert.equal(
        result.indexOf('System.registerModule("a.js", [], function() {'),
        0,
        'The module has register format and name "a.js"');
  });

  test('api compile require', function() {
    var api = require('../../../src/node/api');
    var options = {
      modules: 'register',
      moduleName: true,
      require: true
    };
    var result = api.compile('var a = 1;', options, 'a.js');
    assert.equal(
        result.indexOf('System.registerModule("a.js", [], function(require) {'),
        0,
        'The module factory passes require');
  });

  test('api compile inline', function() {
    var src = 'export function Half(n) {\n this.halfNumber = n / 2;\n};';
    var api = require('../../../src/node/api');
    var result = api.compile(src, {modules: 'inline'});
    assert(result.length > 0);
  });

  test('no sourceURL unless output name differs from input name', function() {
    var src = 'var x = 4;';
    var api = require('../../../src/node/api');
    var sourceName = 'source.js';
    var outputName = 'output.js';

    var result = api.compile(src, {}, sourceName, outputName);
    assert.equal(result.indexOf('sourceURL'), 29);

    result = api.compile(src, {}, sourceName, sourceName);
    assert.equal(result.indexOf('sourceURL'), -1);
  });

});
