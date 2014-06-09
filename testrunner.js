#!/usr/bin/env node
'use strict';

process.title = 'testrunner';

var fs = require( 'fs' );
var broccoli   = require('broccoli');
var mergeTrees = require('broccoli-merge-trees');
var filterES6Modules = require('broccoli-es6-module-filter');
var pickFiles = require('broccoli-static-compiler');
var Testem  = require('testem');
var exportTree = require('broccoli-export-tree');
var broconcat = require('broccoli-concat');

var tree = broccoli.loadBrocfile();

tree =  mergeTrees(
            [
                tree,
                broconcat(
                    mergeTrees(
                        [
                            pickFiles( 'bower_components/jquery/dist', {
                                srcDir: '/',
                                files: [ 'jquery.js' ],
                                destDir: '/assets'
                            }),
                            pickFiles( 'bower_components/handlebars', {
                                srcDir: '/',
                                files: [ 'handlebars.js' ],
                                destDir: '/assets'
                            }),
                            pickFiles( 'bower_components/loader.js', {
                                srcDir: '/',
                                files: [ 'loader.js' ],
                                destDir: '/assets'
                            }),
                            pickFiles( 'bower_components/ember', {
                                srcDir: '/',
                                files: [ 'ember.js' ],
                                destDir: '/assets'
                            }),
                            pickFiles( 'bower_components/ember-resolver/dist', {
                                srcDir: '/',
                                files: [ 'ember-resolver.js' ],
                                destDir: '/assets'
                            }),
                            pickFiles( 'bower_components/emberize-model/dist', {
                                srcDir: '/',
                                files: [ 'emberize-model.js' ],
                                destDir: '/assets'
                            })
                        ],
                        { overwrite: true }
                    ),
                    {
                        inputFiles: ['assets/loader.js','assets/jquery.js','assets/handlebars.js','assets/ember.js','**/*.js'],
                        outputFile: '/assets/vendor.js',
                        wrapInEval: false
                    }
                ),
                broconcat(
                    filterES6Modules(
                        pickFiles('test', {
                            srcDir: '/',
                            inputFiles: ['**/*.js'],
                            destDir: '/test'
                        }),
                        {
                            moduleType: 'amd',
                            anonymous: false,
                            compatFix: true,
                            packageName: 'interface-model-test'
                        }
                    ),
                    {
                        inputFiles: ['**/*.js'],
                        outputFile: '/test/tests.js',
                        wrapInEval: false
                    }
                ),
                pickFiles('test',{
                    srcDir: '/',
                    files: ['test.mustache'],
                    destDir: '/test'
                })
            ],
            { overwrite: true }
        );

var finalTree = mergeTrees([
    tree,
    exportTree(tree, {
        destDir: 'tmp/output'
    })
],{ overwrite: true });

var util=require('util');
var builder = new broccoli.Builder(finalTree);
var Watcher = require('broccoli/lib/watcher');
var watcher = new Watcher(builder);

var testem  = new Testem();

testem.startDev( { 'file':'./testem.json'}, function(code) {
    process.exit(code);
});

watcher.on('change', function() {
    testem.restart();
});

process.on('SIGINT', function () {
  process.exit(1);
});

process.on('SIGTERM', function () {
  process.exit(1);
});

process.addListener('exit', function () {
    console.log( 'exiting' );
    builder.cleanup();
    fs.rmdir( 'tmp' );
});

console.log('starting...');