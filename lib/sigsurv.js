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

function analyseFile (file) {
  var contents = fs.readFileSync(file, { 'encoding': 'utf8' });
  var tokens = contents.match(regexps.rb);
  var report = tokens.map(function (x) {
    return symbols.rb[x];
  }).join();
  return [
    file,
    report
  ];
}

function analyse (directory) {
  var files = glob.sync('**/*.rb', {
    'cwd': directory,
    'nosort': true
  });
  return files.map(analyseFile);
}

module.exports = {
  'analyse': analyse
};