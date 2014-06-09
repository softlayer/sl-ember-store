var filterES6Modules = require('broccoli-es6-module-filter');
var broconcat = require('broccoli-concat');

module.exports = broconcat(
    filterES6Modules('lib', {
        moduleType: 'amd',
        anonymous: false,
        compatFix: true,
        packageName: 'interface-model',
        main: 'main'
    }),
    {
        inputFiles: ['**/*.js'],
        outputFile: '/interface-model.js',
        wrapInEval: false
    }
);