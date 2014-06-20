#!/usr/bin/env node
'use strict';

process.title = 'testrunner';

var fs = require( 'fs' ),
    broccoli   = require( 'broccoli' ),
    mergeTrees = require( 'broccoli-merge-trees' ),
    filterES6Modules = require( 'broccoli-es6-module-filter' ),
    pickFiles = require( 'broccoli-static-compiler' ),
    Testem  = require( 'testem' ),
    exportTree = require( 'broccoli-export-tree' ),
    broconcat = require( 'broccoli-concat' ),
    tree = broccoli.loadBrocfile(),
    builder,
    Watcher,
    watcher,
    testem;

tree =  mergeTrees(
            [
                tree,
                broconcat(
                    mergeTrees(
                        [
                            pickFiles( 'vendor/jquery/dist', {
                                srcDir : '/',
                                files : [ 'jquery.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/handlebars', {
                                srcDir : '/',
                                files : [ 'handlebars.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/loader.js', {
                                srcDir : '/',
                                files : [ 'loader.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/ember', {
                                srcDir : '/',
                                files : [ 'ember.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/ember-resolver/dist', {
                                srcDir : '/',
                                files : [ 'ember-resolver.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/mocha/', {
                                srcDir : '/',
                                files : [ 'mocha.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/chai/', {
                                srcDir : '/',
                                files : [ 'chai.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/chai-as-promised/lib/', {
                                srcDir : '/',
                                files : [ 'chai-as-promised.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/sinonjs/', {
                                srcDir : '/',
                                files : [ 'sinon.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/sinon-chai/lib', {
                                srcDir : '/',
                                files : [ 'sinon-chai.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/sl-modelize/dist', {
                                srcDir : '/',
                                files : [ 'sl-modelize.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/ic-ajax/dist/named-amd', {
                                srcDir : '/',
                                files : [ 'main.js' ],
                                destDir : '/assets'
                            } ),
                            pickFiles( 'vendor/ember-cli-shims', {
                                srcDir : '/',
                                files : [ 'app-shims.js' ],
                                destDir : '/assets'
                            } )
                        ],
                        { overwrite : true }
                    ),
                    {
                        inputFiles : [
                            'assets/loader.js',
                            'assets/jquery.js',
                            'assets/handlebars.js',
                            'assets/ember.js',
                            'assets/mocha.js',
                            'assets/chai.js',
                            'assets/sinon-chai.js',
                            'assets/sinon.js',
                            'assets/app-shims.js',
                            '**/*.js'
                        ],
                        outputFile : '/assets/vendor.js',
                        wrapInEval : false
                    }
                ),
                broconcat(
                    filterES6Modules(
                        pickFiles( 'test', {
                            srcDir : '/',
                            inputFiles : [ '**/*.js' ],
                            destDir : '/test'
                        } ),
                        {
                            moduleType : 'amd',
                            anonymous : false,
                            compatFix : true,
                            packageName : 'sl-model-test'
                        }
                    ),
                    {
                        inputFiles : [ '**/*.js' ],
                        outputFile : '/test/tests.js',
                        wrapInEval : false
                    }
                ),
                pickFiles( 'test',{
                    srcDir : '/',
                    files : [ 'test.mustache' ],
                    destDir : '/test'
                } )
            ],
            { overwrite : true }
        );

tree = mergeTrees( [
    tree,
    exportTree( tree, {
        destDir : 'tmp/output'
    } )
],{ overwrite : true } );

builder = new broccoli.Builder( tree );
Watcher = require( 'broccoli/lib/watcher' );
watcher = new Watcher( builder );

watcher.then( 
    function(){
        testem  = new Testem();

        testem.startDev( { 'file' : './testem.json' }, function( code ) {
            process.exit( code );
        } );
    }
    ,function( reason ){
        console.log( 'broccoli build failed:', reason );
        process.exit( 1 );
    }
);

watcher.on( 'change', function() {
    testem.restart();
} );

process.on( 'SIGINT', function () {
    process.exit( 1 );
} );

process.on( 'SIGTERM', function () {
    process.exit( 1 );
} );

process.addListener( 'exit', function () {
    console.log( 'exiting' );
    builder.cleanup();
    fs.rmdir( 'tmp' );
} );

console.log( 'starting...' );