'use strict';

var fs = require('fs');
var glob = require('glob');

var symbols = require('./symbols.json');
var regexps = {};
Object.keys(symbols).forEach(function (type) {
  var symbolMap = symbols[type];
  var regexpStr = Object.keys(symbolMap).map(function (keyword) {
    return '\\b' + keyword + '\\b';
  }).join('|');
  regexps[type] = new RegExp(regexpStr, 'g');
});

function analyseFile (filename) {
  var contents = fs.readFileSync(filename, { 'encoding': 'utf8' });
  var type = filename.match(/\.(rb|js)$/)[1];
  var tokens = contents.match(regexps[type]);
  var report = tokens && tokens.map(function (x) {
    return symbols[type][x];
  });
  return [
    filename,
    type,
    (report || []).join()
  ];
}

function analyse (directory) {
  var files = glob.sync('**/*.+(rb|js)', {
    'cwd': directory,
    'nosort': true
  });
  return files.map(analyseFile);
}

module.exports = {
  'analyse': analyse
};